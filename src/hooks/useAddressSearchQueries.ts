import { useEffect, useState } from 'react';
import { useScript, useActions } from '.';
import { useSelector } from 'react-redux';
import { flattenStore, getAddressFromStringOrObject } from '../utils';
import { useQueryParams, StringParam } from 'use-query-params';
import { Store, FormObject } from '../interfaces';
import { useLocation } from 'react-router';
import * as rawActions from '../store/actions';
/**
 *
 * @param brandName
 * @param brandId
 * @returns
 * This hook handles the entry of addresses and orderTypes into the url search params
 */
export function useAddressSearchQueries(brandName?: string, brandId?: string) {
  const { orderType, searchLoaded, selectedAddress } = useSelector(
    (store: Store) => flattenStore(store)
  );
  const { selectAddress, setOrderType } = useActions(rawActions);
  const mapsStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
  );
  const [queryChecked, setQueryChecked] = useState(false);
  const routerLocation = useLocation();
  const [query, setQuery] = useQueryParams({
    method: StringParam,
    brandName: StringParam,
    addressSearch: StringParam,
    line2: StringParam,
  });
  const { method, addressSearch, line2 } = query;
  const addressSearchObj = addressSearch
    ? getAddressFromStringOrObject(addressSearch)
    : null;

  const [queryCleared, setQueryCleared] = useState(false);

  useEffect(() => {
    if (mapsStatus === 'ready') {
      if (!queryChecked && routerLocation) {
        if (method) {
          setOrderType(method === 'pickup' ? 'takeaway' : method);
        }
        if (method && method === 'delivery') {
          setOrderType('delivery');
        }
        if (addressSearch) {
          selectAddress({
            ...addressSearchObj,
            line2,
          } as FormObject);
        }
        setQueryChecked(true);
      }
    }
    if (searchLoaded && !queryCleared) {
      setQuery({
        ...query,
        addressSearch: undefined,
        method: undefined,
        line2: undefined,
      });
      setQueryCleared(true);
    }
  }, [
    searchLoaded,
    routerLocation,
    queryChecked,
    setOrderType,
    method,
    addressSearch,
    addressSearchObj,
    line2,
    selectAddress,
    mapsStatus,
    orderType,
    selectedAddress,
    queryCleared,
    query,
    setQuery,
  ]);
  return { addressSearchObj, method, addressSearch, brandName, queryChecked };
}
