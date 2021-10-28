import { useHistory, useParams } from 'react-router-dom';
import { Store } from '../../../interfaces';
import LightspeedCover from '../../../assets/images/lightspeed_cover.jpg';
import { Menu } from '../../../components';
import { Button } from '@material-ui/core'
import { useUnavailableItems } from '../../../hooks/useUnavailableItems';
import { useActions, useLocationSearch } from '../../../hooks';
import { useSelector } from 'react-redux';
import {
  flattenStore,
  filterCartsBySearchResults,
  countCartItems,
} from '../../../utils';
import * as rawActions from '../../../store/actions';
import '../../../styles/lightspeed.scss';
import '../grocery.scss';

export interface ParamTypes {
  locationName: string | undefined;
}

export const Lightspeed = () => {
  const {
    searchResults,
    searchLoaded,
    orderType,
    selectedAddress,
    carts,
    quantities,
    unavailableFetched,
    searchInitialized,
  } = useSelector((store: Store) => flattenStore(store));
  const {
    toggleCart,
    locationSearch,
    fetchUnavailableItems,
    clearUnavailableItems,
  } = useActions(rawActions);
  const history = useHistory();
  const { locationName } = useParams<ParamTypes>();
  const lightspeedObj = searchResults
    ? searchResults.brands.find((brand) => brand.name.match(/Light Speed/gi))
    : null;
  useLocationSearch(
    searchResults,
    orderType,
    locationSearch,
    selectedAddress,
    history,
    locationName,
    searchInitialized
  );
  useUnavailableItems(
    fetchUnavailableItems,
    clearUnavailableItems,
    lightspeedObj?.integrationId
  );
  const filteredCarts = filterCartsBySearchResults(
    carts,
    searchResults ? [searchResults] : [],
    orderType
  );
  const cartCount = countCartItems(filteredCarts, quantities);
  return (
    <div className="lightspeed-view">
      {searchLoaded && unavailableFetched ? (
        searchResults && lightspeedObj ? (
          <div>


            {/* products Menu (+tabs etc..)  */}
            <Menu
              menuType="retail"
              menu={lightspeedObj.transformedMenu!.menus[0]}
              brand={lightspeedObj}
            />


            {/* View Cart bar */}
            {!(cartCount === 0) && !!lightspeedObj.isOpen && (
              <div className="white-container flex justify-center h-20 w-full fixed left-0">
                <div className="flex flex-col justify-center h-full">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="w-80 h-12"
                    onClick={() => toggleCart(true)}
                  >
                    <div className="flex justify-between w-full">
                      <div className="font-sm">{cartCount} Added to cart</div> 
                      <div className="font-xs">View Cart</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Light Speed not available in your area
          <div className="type s20">
            <div className="lightspeed-cover">
              <img src={LightspeedCover} alt="" />
            </div>
            <div className="no-lightspeed">
              Convenience in 10 deliveries are not available in your area yet! We hope to be there
              soon!
            </div>
          </div>
        )
      ) : (
        //Skeleton
        <div className="loading-skeleton">
          <div className="banner" />
          <div className="store-hrs">
            <div className="text" />
          </div>
          <div className="width">
            <div className="categories">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                (each) => (
                  <div key={each} className="horiz-center cat-container ">
                    <div className="category" />
                  </div>
                )
              )}
            </div>
            <div className="retail-list">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((each) => (
                <div key={each} className="retail-list-item">
                  <div className="item-image" />
                  <div className="item-name" />
                  <div className="item-price" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
