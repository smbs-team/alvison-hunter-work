import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { flattenStore } from "../../utils";
import * as rawActions from "../../store/actions";
import { useHistory, useParams } from "react-router-dom";
import { Brand, Store } from "../../interfaces";
import {
  useLocationSearch,
  useActions,
  useAddressSearchQueries,
  useFeatureFlag,
  useLocationViewAnalytics,
} from "../../hooks";
import { Footer } from "../../components";
import "./brands.scss";
import BrandsLoadingSkeleton from "./BrandsLoadingSkeleton/BrandsLoadingSkeleton";
import { BrandsHero } from "./BrandsHero/BrandsHero";
import { WEWORK_FAVORITES } from "../../constants/wework-favorites";
import BrandTile from "./BrandTile/BrandTile";

interface ParamTypes {
  locationName: string | undefined;
  brandName: string | undefined;
}

interface BrandsProps {
  type: string;
}

/**
 * A component for a view that show some kind of information for all brands
 * that are at a location.
 */
export const Brands = ({ type }: BrandsProps) => {
  const { addressSearchObj, method, addressSearch, queryChecked } =
    useAddressSearchQueries();

  const {
    orderType,
    searchResults,
    searchLoaded,
    searchInitialized,
    user,
    selectedAddress,
  } = useSelector((store: Store) => flattenStore(store));

  const { locationSearch, selectAddress, setOrderType } =
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
      localStorage.removeItem("savedAddress");
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

  const { isEnabled: addressSelectEnabled, loading: addressSelectFlagLoading } =
    useFeatureFlag("weworkaddressselect");

  useEffect(() => {
    if (addressSelectEnabled && !selectedAddress?.fromSelectComponent) {
      // If a user is trying to visit the wework subdomain,
      // but has an address selected already, the selected address
      // must be removed
      selectAddress(null);
      setOrderType("delivery");
    }
  }, [addressSelectEnabled, selectedAddress, selectAddress, setOrderType]);

  const brandsFilter = (brand: Brand) => {
    return type === "wework"
      ? WEWORK_FAVORITES.has(brand.name)
      : !brand.name.match(/Light Speed/gi);
  };

  //scrolls to the top if it's the first time visiting the page
  useEffect(() => window.scrollTo(0, 0), []);

  //! render
  return (
    <div>
      {queryChecked ? (
        <>
          <BrandsHero />

          <div className="brands-view">
            {searchLoaded ? (
              searchResults ? (
                <div className="all-restaurants-container">
                  <div className="font-grotesque font-bold text-2xl sm:text-lg sm:mb-2 invisible sm:visible">
                    All Restaurants
                  </div>
                  <div className="px-3 sm:px-0 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {searchResults.brands
                      .filter((brand: Brand) => brandsFilter(brand))
                      .map((brand) => {
                        return (
                          <Fragment key={brand.locationBrandId}>
                            <BrandTile brand={brand} />
                          </Fragment>
                        );
                      })}
                  </div>
                </div>
              ) : //  If there are no Results in that location
              searchLoaded && !searchResults ? (
                <div className="sorry">
                  {orderType === "delivery"
                    ? "We are not delivering in your area yet, but you can pick-up your order at one of our nearby locations!"
                    : "We are not available in your area yet. Enter your address and we'll let you know when we get there."}
                </div>
              ) : (
                <div className="pt-7_5">Loading...</div>
              )
            ) : (
              <BrandsLoadingSkeleton />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="brands-view" />
        </>
      )}
      <Footer />
    </div>
  );
};
