import { useEffect } from 'react';
import { useScript } from './';
import { SearchResults } from '../interfaces/locationInterfaces';
import { Address } from '../interfaces/userInterfaces';
import { History } from 'history';

/**
 *
 * A custom hook that can be used with components that require the info for the current
 * SearchResults to be loaded. If it is not, the SearchResults object is fetched from the server
 */
export function useLocationSearch(
  searchResults: SearchResults | null,
  orderType: string,
  locationSearch: (
    address: Address | null,
    orderType: string,
    history?: History,
    locationName?: string
  ) => void,
  currentAddress: Address | null,
  history?: History,
  locationName?: string | null,
  searchInitialized?: boolean
) {
  const mapsStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&libraries=places`
  );
  return useEffect(() => {
    if (
      mapsStatus === 'ready' &&
      !searchInitialized &&
      !searchResults &&
      (currentAddress || locationName)
    ) {
      if (!locationName) {
        locationSearch(currentAddress, orderType, history);
      } else {
        locationSearch(currentAddress, orderType, history, locationName);
      }
    }
  }, [
    mapsStatus,
    locationName,
    locationSearch,
    orderType,
    history,
    searchInitialized,
    currentAddress,
    searchResults,
  ]);
}
