import { Brand, Carts, Quantities, Store } from '../../../interfaces';
import { useEffect, useMemo } from 'react';
import { Button, Typography } from '@material-ui/core';
import { WhiteCart } from '../../../assets/icons';
import { totalAllCarts, 
  taxTable, 
  flattenStore, 
  getModifiersTotal 
} from '../../../utils';
import { useSelector } from 'react-redux';
import { useActions } from '../../../hooks';
import * as rawActions from '../../../store/actions';
import '../../Cart/cart.scss';
import './recent-item-added-popup.scss';

export interface RecentItemAddedPopUpProps {
  filteredCarts: Carts;
  quantities: Quantities;
  itemCount: number;
}
/**
 * The component shows the recent item added pop up modal.
 */
export const RecentItemAddedPopUp = ({
  filteredCarts,
  quantities,
  itemCount,
}: RecentItemAddedPopUpProps) => {
  const { searchResults, selectedAddress, orderType, user, recentItem } = useSelector(
    (store: Store) => flattenStore(store)
  );
  const { removeFromCart } = useActions(rawActions);
  const { toggleRecentItem, toggleCart } = useActions(rawActions);
  const currentBrandId = useMemo(() => 
    filteredCarts && Object.keys(filteredCarts)[0], 
    [filteredCarts],
  );
  const currentBrandObj = useMemo(() => 
    searchResults?.brands.find((brand: Brand) => brand.id === currentBrandId),
    [searchResults, currentBrandId],
  );

  const pricesObj = useMemo(
    () =>
      totalAllCarts(
        filteredCarts,
        quantities,
        taxTable[currentBrandObj?.location!.name || 0] || 0,
        0
      ),
    [filteredCarts, quantities, currentBrandObj]
  );

  useEffect(() => {
    // scroll listener fires once and then turns off
    function scrollListenerInPopup() {
      toggleRecentItem(false);
      document.removeEventListener('scroll', scrollListenerInPopup);
    }
    document.addEventListener('scroll', scrollListenerInPopup);
  }, [toggleRecentItem]);

  const modifiersPrice = useMemo(() => 
    recentItem?.modifiers && getModifiersTotal(recentItem.modifiers), 
      [recentItem],
  );
  return (
        <div className="recent-item-modal-content">
          <div className="font-grotesque">
            <div className="horiz-center border-0 border-b border-solid border-grey_line py-2_5">
              <Typography className="text-lg">Added to Cart!</Typography>
            </div>
            <div className="horiz-center border-0 border-b border-solid border-grey_line py-3">
              <div className="space-bt px-2">
                <div className="flex">
                  <div className="text-base font-bold mr-2">
                    x{quantities[recentItem?.cartId!]}
                  </div>
                  <div>
                    <div className="font-bold mb_3 text-base">
                      {recentItem && recentItem.name.length > 20
                        ? `${recentItem.name.replace(/^(.{20}[^\s]*).*/, '$1')}...`
                        : recentItem?.name}
                    </div>
                    <Button
                      variant="text"
                      className="underline pl-0 font-light text-sm cursor-pointer"
                      onClick={() => {
                        toggleRecentItem(false);
                        removeFromCart(
                          currentBrandObj,
                          recentItem,
                          user,
                          selectedAddress,
                          orderType
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="text-base font-bold">
                  {recentItem && `$ ${(recentItem.price + (modifiersPrice || 0)).toFixed(2)}`}
                </div>
              </div>
            </div>
            <div className="p-2">
                <Button
                  onClick={() => {
                    toggleCart(true);
                    toggleRecentItem(false);
                  }}
                  variant="contained"
                  color="primary"
                  className="text-base h-12 w-full justify-between"
                >
                        <WhiteCart />
                      <div>
                        View Cart ${pricesObj.currentCartSubTotal.toFixed(2)}
                      </div>
                      <div>{itemCount}</div>
                </Button>
            </div>
          </div>
        </div>
  );
};
