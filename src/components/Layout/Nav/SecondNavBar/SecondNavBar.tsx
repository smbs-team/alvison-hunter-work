import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  flattenStore, 
  getTabs, 
  getDeliveryTimeStrings,
} from '../../../../utils';
import { Store } from '../../../../interfaces';
import './secondNav.scss';
import Tabs from './Tabs'
import AddressSelect from './AddressSelect';
import { useAddressSearchQueries, useFeatureFlag, useActions } from '../../../../hooks';
import { ExpandIcon } from '../../../../assets/icons';
import * as rawActions from '../../../../store/actions';
import { LOCAL_STORAGE_KEYS } from '../../../../constants/KEYS';
/**
 *
 * A component below the main nav that holds address selection, restaurant vs lightspeed selection 
 * and time selection for the user to interact with while choosing what to order. 
 * 
 */
const SecondNavBar = () => {

  const {brandName} = useAddressSearchQueries();
  
  const {
    orderType,
    searchResults,
    searchLoaded,
    deliveryTime,
  } = useSelector((store: Store) => flattenStore(store));
  const { toggleDeliveryScheduler } = useActions(rawActions);

  useEffect(() => {
    // If the address that was used to get an empty set of search results is saved,
    // it must be removed from localStorage. This user will now be redirected back to the
    // Landing page when they revisit the site. This currently only will occur if a user entered
    // their address from the Landing page. If they enter it from the address modal, it is not saved
    // if there are no results.
    if (searchLoaded && !searchResults?.brands.length) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SAVED_ADDRESS);
    }
  }, [searchLoaded, searchResults]);


  const {
    isEnabled: isAddressSelectEnabled,
  } = useFeatureFlag('weworkaddressselect');

  const showLightspeed = useMemo(
    () =>
      !!(
        brandName === 'Light Speed' ||
        (searchResults &&
          searchResults.brands.find((brand) =>
            brand.name.match(/Light Speed/gi)
          ))
      ),
    [brandName, searchResults]
  );

  const tabs = getTabs({
    isAddressSelectEnabled,
    showLightspeed,
    resultsLength: searchResults?.brands.length || 0,
  });

  const threeTabs = tabs.length === 3;
  
  const deliveryTimeStrings = useMemo(() => 
    getDeliveryTimeStrings(deliveryTime)
  , [deliveryTime]); 

  const { isEnabled: slotBasedOrderSchedulerEnabled } =
    useFeatureFlag('slotBasedOrderScheduler');

  return (
    <div className="outer w-screen flex justify-center bg-white lg:px-2">
      <div className='hidden lg:w-11/12 lg:items-center lg:flex-row lg:flex lg:justify-between lg:p-3'>
        <div 
          className={`${
            threeTabs
            ? 'three-tabs'
            : 'two-tabs'
          }`} 
        >
          <Tabs />
        </div>
        <AddressSelect />
        {searchLoaded && searchResults ? (
          orderType === 'delivery' ? (
            <div 
              onClick={() => toggleDeliveryScheduler(true)}
              className={`${
                threeTabs
                ? 'three-tabs'
                : 'two-tabs'
              } 
              items-end flex justify-center flex-col font-sofia font-bold text-sm lg:text-base`}>
                <span className="font-sofia">
                  <span className="font-bold">{deliveryTimeStrings.long}</span>{' '}
                  <span className="cursor-pointer font-bold">
                    {slotBasedOrderSchedulerEnabled && <ExpandIcon />}
                  </span>
                </span>
            </div>
          ) : (
            <div 
              className={`
                ${threeTabs ? 'three-tabs' : 'two-tabs'}
                items-end flex justify-center flex-col font-sofia font-bold text-sm lg:text-base`}>
            </div>
          )
        ):(
          <div className={`${threeTabs ? 'three-tabs' : 'two-tabs'} flex justify-center flex-col items-end`} />
        )}
      </div>
      <div className="lg:hidden xs:flex xs:inner-nav xs:flex-col xs:justify-center xs:items-center xs:mx-1 my-3">
        <div className="mobile-view flex-col justify-center items-center flex">
          <div 
            className={`
              ${ orderType === 'delivery' && 'flex justify-between items-center'} 
              ${threeTabs ? 'three-tabs' : 'two-tabs'}
            `}
          >
            <AddressSelect />
            {searchLoaded ? (
              orderType === 'delivery' ? (
                <div 
                  className='items-end flex justify-center flex-col font-sofia font-bold sm:text-sm lg:text-base text-xs'
                  onClick={() => toggleDeliveryScheduler(true)}
                >
                  <span className="font-sofia">
                    <span className="font-bold">{deliveryTimeStrings.short}</span>{' '}
                    <span className="cursor-pointer font-bold">
                      {slotBasedOrderSchedulerEnabled && <ExpandIcon />}
                    </span>
                  </span>
                </div>
              ) : (
                <div 
                  className={`
                  ${threeTabs ? 'three-tabs' : 'two-tabs'}
                  items-end flex justify-center flex-col`}>
                </div>
              )
            ):(
              <div className="flex justify-center flex-col items-end" />
            )}
          </div>
          <div className="flex-col justify-center items-center flex mt-3">
            <Tabs />
          </div>
        </div>
      </div>
    </div >
  );
};

export default SecondNavBar;
