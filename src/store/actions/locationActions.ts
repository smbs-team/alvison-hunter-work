import axios from 'axios';
import { Dispatch } from 'redux';
import {
  geocodeByPlaceId,
  getLatLng,
  geocodeByAddress,
} from 'react-places-autocomplete';
import { History } from 'history';
import { Address } from '../../interfaces/userInterfaces';
import { toggleModal } from './userActions';
import { transformLocationMenus } from '../../utils/makeMenuUsable';
import { parseError } from '../../utils/parseError';
import { selectAddress } from './userActions';
import { getAddressFromStringOrObject } from '../../utils/getAddressFromStringOrObject';
/**
 *
 * @param address
 * @param history
 * @returns
 * Fetches search results a given address or a given Location name. History can be provided to
 * this function for redirecting to /location.
 */
export const locationSearch =
  (
    address: Address | null,
    orderType: string,
    history?: History,
    locationName?: string,
    cb?: (resetVals?: boolean) => void
  ) =>
  async (dispatch: Dispatch) => {
    await dispatch({
      type: 'TOGGLE_LOCATION_LOADED',
      payload: { searchLoaded: false, searchInitialized: true },
    });
    if (address && !locationName) {
      // This part handles when an address is properly provided and the search is done by radius
      try {
        // Gets the latLng from the address or placeId that is provided.
        const googleResponse = address.placeId
          ? await geocodeByPlaceId(address.placeId!)
          : await geocodeByAddress(
              `${address.line1} ${address.city}, ${address.state} ${address.zip}`
            );
        const latLng = await getLatLng(googleResponse[0]);
        // Fetching the nearest search results from the server. The search radius
        // is 5 miles for delivery and 15 miles for pickup. This number is multiplied
        // by 1609.34 to convert to meters.
        const { data } = await axios.get(
          `/api/location?orderType=${orderType}&maxDistance=${
            orderType === 'delivery' ? `${1609.34 * 8}` : `${1609.34 * 15}`
          }`,
          {
            params: { latitude: latLng.lat, longitude: latLng.lng },
          }
        );
        if (!(data.searchResults || data.location) && history) {
          window.analytics.track('Outside Delivery Range', {
            address: address.zip,
          });
          if (cb) {
            cb();
          }
          await dispatch({
            type: 'TOGGLE_LOCATION_LOADED',
            payload: { searchLoaded: true },
          });
          // If no results are found with an address query from a brand page, we need
          // to redirect
          if (window.location.href.match(/brand/)) {
            if (history) {
              history.push('/location' + window.location.search);
            }
          }
          return dispatch(
            toggleModal(
              true,
              `We’re sorry to say that REEF is not available for ${orderType} at the provided address…yet. We’re constantly adding locations and we hope to be in your neighborhood soon.`,
              'Not Available'
            ) as any
          );
        }
        transformLocationMenus(data.searchResults);
        await dispatch({
          type: 'UPDATE_LOCATION',
          payload: {
            searchResults: data.searchResults,
            selectedLocation: null,
          },
        });
        if (cb) {
          cb(true);
        }
        return data.location;
      } catch (e) {
        if (cb) {
          cb();
        }
        await dispatch({
          type: 'TOGGLE_LOCATION_LOADED',
          payload: { searchLoaded: true },
        });
        return dispatch(toggleModal(true, ...parseError(e)) as any);
      }
    } else {
      // If the location name is provided, only brands at that location are
      // fetched with a different route. This search is also used by the QR codes for pickup
      try {
        const { data } = await axios.get(
          `/api/location/${locationName}?orderType=${orderType}`
        );
        await dispatch(
          selectAddress({
            ...getAddressFromStringOrObject(data.location.address)!,
            presetAddressEntry: orderType === 'delivery',
            deliveryInstructions: ""
          }) as any
        );
        transformLocationMenus(data.location);
        await dispatch({
          type: 'UPDATE_LOCATION',
          payload: {
            searchResults: data.location,
            selectedLocation: orderType !== 'delviery' && locationName,
          },
        });
        if (cb) {
          cb(true);
        }
      } catch (e) {
        if (cb) {
          cb();
        }
        await dispatch({
          type: 'TOGGLE_LOCATION_LOADED',
          payload: { searchLoaded: true },
        });
        return dispatch(toggleModal(true, ...parseError(e)) as any);
      }
    }
  };
/**
 *
 * @returns
 * Clears the most recently loaded location.
 */
export const resetLocation = () => (dispatch: Dispatch) => {
  return dispatch({ type: 'RESET_LOCATION' });
};

export const fetchUnavailableItems =
  (id: string | number, setUnavailable?: boolean, tries: number = 3) =>
  async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(
        `/api/order/stores/${id}/unavailable_items`
      );
      if (setUnavailable) {
        dispatch({
          type: 'SET_UNAVAILABLE_ITEMS',
          payload: {
            unavailableItems: data.data.unavailable_items,
            unavailableFetched: true,
          },
        });
      }
      return data.data.unavailable_items;
    } catch (error) {
      if (tries > 0) {
        return dispatch(
          fetchUnavailableItems(id, setUnavailable, tries - 1) as any
        );
      }
      return [];
    }
  };
/**
 *
 * @returns
 * Clears the currently used unavailable items array from the store
 */
export const clearUnavailableItems = () => async (dispatch: Dispatch) => {
  return dispatch({
    type: 'SET_UNAVAILABLE_ITEMS',
    payload: { unavailableItems: [], unavailableFetched: false },
  });
};
/**
 *
 * @param newVal
 * @returns
 * Toggles the address entry modal that is rendered from the ModalWrapper component
 */
export const toggleAddressEntry =
  (newVal: boolean) => async (dispatch: Dispatch) => {
    return dispatch({ type: 'TOGGLE_ADDRESS_ENTRY', payload: { newVal } });
  };
/**
  *
  * @param tab
  * @returns
  * Updates selected tab to display on locations 
*/
export const selectTab = (tab: string) => (dispatch: Dispatch) =>
  dispatch({ type: 'UPDATE_SELECTED_VIEW_TAB', payload: { tab } });
