import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { flattenStore } from '../utils';
import { Store } from '../interfaces';
import { useHistory, useLocation } from 'react-router';
/**
 *
 * @param brandName
 * @param brandId
 * This hook determines if url you are at has the correct brand for your current locationSearch. If it does not,
 * it forwards to the correct url.
 */
export function useNearestBrandInstance(brandName: string, brandId: string) {
  const history = useHistory();
  const routerLocation = useLocation();
  const { searchResults, searchLoaded } = useSelector((store: Store) =>
    flattenStore(store)
  );
  useEffect(() => {
    if (searchLoaded) {
      if (brandName) {
        // This logic makes it so that if a brand view is open but the id of the link given is wrong
        // for the user's location, they are forwarded to the correct brand page
        const brandFound =
          searchResults?.brands.find((brand) => brand.name.match(new RegExp(`${brandName}`, 'gi')));
        if (
          brandFound &&
          !brandFound.name.match(/Light Speed/gi) &&
          brandFound.id !== brandId
        ) {
          history.push(
            `/brand/${`${brandFound.name.toLowerCase().replaceAll(' ', '-')}-${brandFound.id}`}${
              routerLocation.search
            }`
          );
        }
      }
    }
  }, [
    searchLoaded,
    searchResults,
    history,
    brandName,
    brandId,
    routerLocation,
  ]);
}
