import { useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Store } from '../../interfaces';
import {
  useLocationSearch,
  useActions,
  useUnavailableItems,
  useAddressSearchQueries,
  useNearestBrandInstance,
  useMissingBrandSearch,
} from '../../hooks';
import {Menu, Footer} from '../../components';
import { Button } from '@material-ui/core';
import { flattenStore, willBrandBeOpen } from '../../utils';
import { useSelector } from 'react-redux';
import * as rawActions from '../../store/actions';
import './brand.scss';
import '../../styles/button.scss';
import BrandHero from "./BrandHero/BrandHero";
import BrandLoadingSkeleton from "./BrandLoadingSkeleton/BrandLoadingSkeleton";

interface ParamTypes {
  brandNameAndId: string | undefined;
}


/**
 * View for information about a single brand. For now, it just shows the current
 * menu for the brand that is loaded.
 */
export const Brand = () => {
  const {
    searchResults,
    searchLoaded,
    selectedAddress,
    carts,
    orderType,
    selectedLocation,
    unavailableFetched,
    user,
    searchInitialized,
    deliveryTime,
  } = useSelector((store: Store) => flattenStore(store));

  const {
    toggleCart,
    fetchUnavailableItems,
    clearUnavailableItems,
    locationSearch,
  } = useActions(rawActions);

  const { brandNameAndId } = useParams<ParamTypes>();

  const brandAndIdWithCharactersReplaced = 
    useMemo(() => brandNameAndId?.replace(/[-_+]/gi, ' '), 
  [brandNameAndId]);

  const splitBrandNameAndId = useMemo(() => 
    (brandAndIdWithCharactersReplaced || '').split(' '), 
    [brandAndIdWithCharactersReplaced]
  ); 

  const brandId = useMemo(() => 
    splitBrandNameAndId.pop(), 
    [splitBrandNameAndId]
  );
  const brandName = useMemo(() => 
    splitBrandNameAndId.join(' '), 
    [splitBrandNameAndId]
  );

  const history = useHistory();
  if (brandName.match(/light speed/gi) || !brandId) {
    // Currently light speed must be handled as an exception, but in the future, it probably should not be.
    history.push('/location' + window.location.search);
  }

  const { queryChecked, addressSearch, addressSearchObj } =
      useAddressSearchQueries(brandName, brandId);

  const { currentBrand, backupAddress } = useMissingBrandSearch(
      brandName,
      // If the code gets to here, brandId will always be defined
      brandId!,
      queryChecked,
      addressSearch,
      addressSearchObj
  );
  useLocationSearch(
      searchResults,
      orderType,
      locationSearch,
      (queryChecked && addressSearch ? addressSearchObj : selectedAddress) ||
      backupAddress ||
      null,
      history,
      selectedLocation || undefined,
      searchInitialized
  );
  // If the code gets to here, brandId will always be defined
  useNearestBrandInstance(brandName, brandId!);

  const isCartEmpty =
      (currentBrand && !carts[currentBrand.id]) ||
      (currentBrand && carts[currentBrand.id].length === 0);

  const itemCount =
      currentBrand && carts[currentBrand.id] && carts[currentBrand.id].length;


  useEffect(() => {
    if (currentBrand) {
      let address = currentBrand?.location?.address;
      if (orderType === 'delivery') {
        address = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        if (!selectedAddress?.line2) {
          address = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
        }
      }
      let currency = currentBrand.location?.currency || 'USD';
      let ecomItems = [];
      let menu = currentBrand.transformedMenu;

      if (menu) {
        for (let i = 0; i < menu.menus.length; i++) {
          for (let j = 0; j < menu.menus[i].menuGroups.length; j++) {
            for (
                let k = 0;
                k < menu.menus[i].menuGroups[j].menuItems.length;
                k++
            ) {
              let ecomItem = {
                item_id: menu.menus[i].menuGroups[j].menuItems[k].guid,
                item_name: menu.menus[i].menuGroups[j].menuItems[k].name,
                item_list_name: currentBrand.name,
                item_list_id: currentBrand.id,
                item_list_dir: currentBrand.location?.address,
                price: menu.menus[i].menuGroups[j].menuItems[k].price,
              };
              ecomItems.push(ecomItem);
            }
          }
        }
        let user_id = user?.id;
        if (user?.id === undefined) {
          user_id = 'anonymous';
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: 'view_item_list',
          date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
          user_id: user_id,
          vessel: currentBrand.location?.name,
          ecommerce: {
            affiliation: orderType,
            currency: currency,
            address: address,
            items: ecomItems,
          },
        });
        window.dataLayer.push({
          event: 'virtual_pageview',
          page_title: `brand:${currentBrand.name}`,
          page_url: window.location.pathname,
        });
      }
    }
  }, [currentBrand, selectedAddress, orderType, user]);

  useUnavailableItems(
      fetchUnavailableItems,
      clearUnavailableItems,
      currentBrand?.integrationId
  );

  //scrolls to the top if it's the first time visiting the Brand page
  useEffect(() => window.scrollTo(0, 0), []);


  //! render
  return (
      <div className="brand-view">

        {searchLoaded && searchResults && currentBrand && unavailableFetched ? (
            <div>


              {/* Hero image*/}
              <BrandHero currentBrand={currentBrand}/>


              {/* Menus */}
              {currentBrand.transformedMenu?.menus.map((menu, idx) => (
                  <Menu menu={menu} key={idx} brand={currentBrand}/>
              ))}


              {/* Added to cart / View cart bar */}
              {!isCartEmpty && (currentBrand.isOpen || willBrandBeOpen(currentBrand, deliveryTime)) ? (
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
                          <div className="font-sm">{itemCount} Added to cart</div>
                          <div className="font-xs">View Cart</div>
                        </div>
                      </Button>
                    </div>
                  </div>
              ) : (
                  ''
              )}
            </div>
        ) : (
            //  Loading Skeletons
            <BrandLoadingSkeleton/>
        )}

        <Footer />
      </div>
  );
};
