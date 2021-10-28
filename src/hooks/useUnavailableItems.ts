import { useEffect } from 'react';

/**
 *
 * A custom hook that fetches the current unavailable items info if it not already fetched from
 * the server.
 */
export function useUnavailableItems(
  fetchUnavailableItems: (
    storeId: string | number,
    setUnavailable?: boolean
  ) => void,
  clearUnavailableItems: () => void,
  storeId?: string | number
) {
  return useEffect(() => {
    if (storeId) {
      fetchUnavailableItems(storeId, true);
      return function () {
        clearUnavailableItems();
      };
    }
  }, [fetchUnavailableItems, clearUnavailableItems, storeId]);
}
