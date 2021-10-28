import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { flattenStore, getTabs } from "../../utils";
import * as rawActions from "../../store/actions";
import { useHistory, useParams } from "react-router-dom";
import { Store } from "../../interfaces";
import {
  useLocationSearch,
  useActions,
  useAddressSearchQueries,
  useFeatureFlag,
  useLocationViewAnalytics,
} from "../../hooks";
import { Button } from "@material-ui/core";
import { Footer } from "../../components";

import { Lightspeed } from "./Lightspeed/Lightspeed";

import "./grocery.scss";
import GroceryLoadingSkeleton from "./GroceryLoadingSkeleton/GroceryLoadingSkeleton";
import GroceryHero from "./GroceryHero/GroceryHero";
import { Brands } from "../Brands/Brands";
import { LOCAL_STORAGE_KEYS, TABS } from "../../constants/KEYS";

interface ParamTypes {
  locationName: string | undefined;
  brandName: string | undefined;
}
/**
 * A component for a view that show some kind of information for all brands
 * that are at a location.
 */
export const Grocery = () => {
  const { addressSearchObj, method, addressSearch, brandName, queryChecked } =
    useAddressSearchQueries();

  const {
    orderType,
    searchResults,
    searchLoaded,
    searchInitialized,
    user,
    selectedAddress,
    selectedTab,
  } = useSelector((store: Store) => flattenStore(store));

  const lightspeedObj = searchResults
    ? searchResults.brands.find((brand) => brand.name.match(/Light Speed/gi))
    : null;

  const { locationSearch, selectAddress, setOrderType, selectTab } =
    useActions(rawActions);
  const { locationName } = useParams<ParamTypes>();

  const history = useHistory();

  if (queryChecked && !(addressSearchObj || selectedAddress || locationName)) {
    // If there is no source for how to search, forward to home
    history.push("/" + window.location.search);
  }
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

  useLocationSearch(
    searchResults,
    method ? (method === "pickup" ? "takeaway" : "delivery") : orderType,
    locationSearch,
    queryChecked && addressSearch ? addressSearchObj : selectedAddress,
    history,
    locationName,
    searchInitialized
  );

  const [initialLoad, setInitialLoad] = useState(false);

  useLocationViewAnalytics({
    searchLoaded,
    orderType,
    searchResults,
    selectedAddress,
    initialLoad,
    setInitialLoad,
    locationName,
    user,
  });

  //?Note: comment to test wework view
  const {
    isEnabled: isAddressSelectEnabled,
    loading: addressSelectFlagLoading,
  } = useFeatureFlag("weworkaddressselect");

  //?Note: uncomment to test wework view
  // address: We work brickell/downtown
  // const isAddressSelectEnabled = true;
  // const addressSelectFlagLoading = false;

  const showLightspeed = useMemo(
    () =>
      !!(
        brandName === "Light Speed" ||
        (searchResults &&
          searchResults.brands.find((brand) =>
            brand.name.match(/Light Speed/gi)
          ))
      ),
    [brandName, searchResults]
  );

  //! get the tabs of the current location (wework, lightspeed, regular brands)
  const tabs = getTabs({
    isAddressSelectEnabled,
    showLightspeed,
    resultsLength: searchResults?.brands.length || 0,
  });

  //just for development to avoid localhost domain issues
  useEffect(() => {
    if (isAddressSelectEnabled && !selectedAddress?.fromSelectComponent) {
      // If a user is trying to visit the wework subdomain,
      // but has an address selected already, the selected address
      // must be removed
      selectAddress(null);
      setOrderType("delivery");
    }
  }, [isAddressSelectEnabled, selectedAddress, selectAddress, setOrderType]);

  //scrolls to the top if it's the first time visiting the page
  useEffect(() => window.scrollTo(0, 0), []);

  // If no Light Speed location is found, and this is the intial page load,
  // we need to switch to the first tab in the list.
  useEffect(() => {
    if ((searchLoaded && !showLightspeed) || isAddressSelectEnabled) {
      selectTab(tabs[0]);
    }
  }, [searchLoaded, showLightspeed, selectTab, isAddressSelectEnabled]);
  //! render
  return (
    <>
      {/* TODO: remove show the 'brands page' in this view and change it to a url change navigation */}
      {tabs.length && selectedTab !== "10 min menu" ? (
        //! Show the Brands page
        <Brands type={`${selectedTab === "WeWork" ? "wework" : "all"}`} />
      ) : (
        //!Show the Grocery page (this page content)
        <div>
          {queryChecked ? (
            <div>
              {lightspeedObj && <GroceryHero currentBrand={lightspeedObj}/>}

              <div className="horiz-center">
                <div className="location-view">
                  {searchLoaded ? (
                    searchResults ? (
                      <div className={"location-section"}>
                        {tabs.length && selectedTab === TABS.FAST_DELIVERY && (
                          <Lightspeed />
                        )}

                        {selectedTab === TABS.WE_WORK && (
                          <div className="flex justify-center">
                            <Button
                              className="w-2/12 h-4 mb-4"
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                window.scrollTo(0, 0);
                                selectTab("30 min menu");
                              }}
                            >
                              More
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : searchLoaded && !searchResults ? (
                      <div className="sorry">
                        {orderType === "delivery"
                          ? "We are not delivering in your area yet, but you can pick-up your order at one of our nearby locations!"
                          : "We are not available in your area yet. Enter your address and we'll let you know when we get there."}
                      </div>
                    ) : (
                      <div className="pt-7_5">Loading...</div>
                    )
                  ) : (
                    <GroceryLoadingSkeleton />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="horiz-center">
              <div className="location-view" />
            </div>
          )}
          <Footer />
        </div>
      )}
    </>
  );
};
