import { useEffect, useMemo, useState } from 'react';
import {useLocation} from "react-router-dom";
import { 
  useActions, 
  useAddressSearchQueries, 
  useFeatureFlag 
} from '../../../../hooks';
import { useSelector } from 'react-redux';
import { 
  flattenStore, 
  getTabs 
} from '../../../../utils';
import { Store } from '../../../../interfaces';
import {FlyingClock, Wework } from '../../../../assets/icons';
import { useHistory } from 'react-router-dom';
import * as rawActions from '../../../../store/actions';
import { StringParam, useQueryParam } from 'use-query-params';
import { TABS } from '../../../../constants/KEYS';
const { REACT_APP_FORCE_ALPACA } = process?.env;

const Tabs = () => {
  const history = useHistory();
  const {brandName} = useAddressSearchQueries();
  const {pathname} = useLocation(); 
  const {
    searchResults,
    searchLoaded,
    selectedTab
  } = useSelector((store: Store) => flattenStore(store));

  const { selectTab } = useActions(rawActions);

  useEffect(() => {
    // If the address that was used to get an empty set of search results is saved,
    // it must be removed from localStorage. This user will now be redirected back to the
    // Landing page when they revisit the site. This currently only will occur if a user entered
    // their address from the Landing page. If they enter it from the address modal, it is not saved
    // if there are no results.
    if (searchLoaded && !searchResults?.brands.length) {
      localStorage.removeItem("savedAddress");
    }

  }, [searchLoaded, searchResults]);

  useEffect(() => {
    const strOfferingPath = "/offering";
    if (pathname === strOfferingPath) {
      selectTab(' ');
    }

    if (pathname !== "/location" && !strOfferingPath) {
      selectTab(localStorage.getItem("localSelectedTab"));
    }

    localStorage.setItem("localSelectedTab", selectedTab);
  }, [selectedTab]);

  const {
    isEnabled: isAddressSelectEnabled,
  } = useFeatureFlag('weworkaddressselect');

  const isAlpaca = useMemo(
    () =>
      window.location.href.indexOf(`alpaca.getreef.com`) > -1 ||
      window.location.href.indexOf(`alpaca-stg.getreef.com`) > -1 || 
      REACT_APP_FORCE_ALPACA,
    []
  );

  const [partnerQueryParam] = useQueryParam('partner', StringParam);
  const location =  partnerQueryParam ? `/location?partner=${partnerQueryParam}` : `/location`;

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

  return (
    <div>
        { searchLoaded ? (
          searchResults && (tabs.length > 1) ? (
            <div className="brands-section flex flex-col justify-center items-start lg:ml-1_5">
                <div className="brand-types flex justify-start p-0_5">

                  {tabs.map((tabName, idx) => (
                    <div
                      className={`brand-types-item 
                        ${ tabName === selectedTab && 'selected' } 
                        ${ tabName === 'WeWork' ? 'wework h-4_5' : 'restaurants pt-0_5 flex flex-col justify-center items-center'}
                        ${ tabs.length === 3 ? 'text-xs sm:text-base' : 'two-tabs text-sm '}
                        font-grotesque font-bold text-center cursor-pointer h-4
                      `}
                      onClick = {() => { 
                        selectTab(tabName);
                        history.push(location)
                      }}
                      key={idx}
                    >

                      <div className="py-1 px-1">

                        {/* WeWork */}
                        {tabName === TABS.WE_WORK && <Wework className="w-6 h-2_5 sm:w-10"/>}

                        {/* 10 min menu (Grocery) */}
                        {tabName === TABS.FAST_DELIVERY && 
                        <span>
                          <FlyingClock className="w-2 h-1 sm:w-2_5 sm:h-1_5" /> 
                          <span className=""> {(isAddressSelectEnabled || isAlpaca) ? 'Convenience' : tabName}</span>
                        </span>
                        }

                        {/* 30 min menu (Brands) */}
                        {tabName === TABS.STANDARD_DELIVERY && 
                        <span className="">{(isAddressSelectEnabled || isAlpaca) ? 'Restaurants' : tabName}</span>
                        }

                      </div>

                    </div>
                  ))}
                </div>
            </div>
          ):(
            <div className="brands-section flex flex-col justify-center items-start" />
          )
        ):(
        ''
        )}
    </div >
  );
};

export default Tabs;
