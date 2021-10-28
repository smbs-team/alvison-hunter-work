import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { SWRFetch } from '../utils';
import { useHistory } from 'react-router-dom';
import { Brand as BrandInterface, Store, Address } from '../interfaces';
import { useActions, useScript } from '../hooks';
import { flattenStore, getAddressFromStringOrObject } from '../utils';
import { useSelector } from 'react-redux';
import * as rawActions from '../store/actions';
/**
 *
 * @param brandName
 * @param brandId
 * @param queryChecked
 * @param addressSearch
 * @param addressSearchObj
 * @returns
 * This hook handles what happens when the user loads a page, but the search results for a provided do not contain
 * the brandName that matches the url. When this occurs, it uses the address on the brand as a 'backup address' and uses
 * the late address entry feature.
 */
export function useMissingBrandSearch(
  brandName: string,
  brandId: string,
  queryChecked: boolean,
  addressSearch?: string | null,
  addressSearchObj?: Address | null
) {
  const mapsStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
  );
  const { searchResults, searchLoaded, selectedAddress, orderType } =
    useSelector((store: Store) => flattenStore(store));
  const { locationSearch, selectAddress } = useActions(rawActions);
  const history = useHistory();
  const currentBrand = useMemo(
    () =>
      searchResults?.brands.find(
        (brand: BrandInterface) => brand.name.match(new RegExp(`${brandName}`, 'gi'))
      ),
    [searchResults, brandName]
  );
  const { data: brandData, error: brandError } = useSWR(
    (brandId && !currentBrand && `/api/location/brand/${brandId}`) || null,
    SWRFetch
  );

  if (!(brandId || addressSearch) || brandError) {
    // Redirect if no brandId found or if backup brand search returns nothing
    history.push('/location' + window.location.search);
  }

  const backupAddress = useMemo(
    () =>
      brandData && {
        ...getAddressFromStringOrObject(brandData.brand.location.address),
        presetAddressEntry: true,
      },
    [brandData]
  );
  const [presetAddressChecked, setPresetAddressChecked] = useState(false);
  useEffect(() => {
    if (mapsStatus === 'ready') {
      // If a user already has an address but the linked brand is not nearby, a late
      // address is assigned here and a search is conducted so that the menu is shown.
      // The brand's address is also assigned here if no stored address is found at all.
      const noAddressFound =
        !(queryChecked && addressSearch ? addressSearchObj : selectedAddress) &&
        backupAddress;
      const notInBrandSearchButFound =
        selectedAddress && searchLoaded && !currentBrand && backupAddress;
      if (currentBrand) {
        setPresetAddressChecked(true);
      }
      if (noAddressFound || notInBrandSearchButFound) {
        if (!presetAddressChecked) {
          selectAddress(backupAddress);
          locationSearch(backupAddress, orderType, history);
          setPresetAddressChecked(true);
        } else if (searchLoaded && !currentBrand) {
          history.push('/location' + window.location.search);
        }
      }
    }
  }, [
    selectedAddress,
    searchLoaded,
    brandId,
    history,
    currentBrand,
    backupAddress,
    selectAddress,
    queryChecked,
    addressSearch,
    addressSearchObj,
    locationSearch,
    orderType,
    presetAddressChecked,
    mapsStatus,
  ]);
  return { currentBrand, backupAddress };
}
