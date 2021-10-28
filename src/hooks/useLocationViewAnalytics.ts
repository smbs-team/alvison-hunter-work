import { useEffect } from 'react';
import { SearchResults, User, Address } from '../interfaces';

interface LocationViewAnalyticsProps {
  searchResults: SearchResults | null;
  searchLoaded: boolean;
  orderType: string;
  selectedAddress: Address | null;
  initialLoad: boolean;
  locationName?: string;
  user: User | null;
  setInitialLoad: (nevVal: boolean) => void;
}

export function useLocationViewAnalytics({
  searchResults,
  searchLoaded,
  orderType,
  selectedAddress,
  initialLoad,
  locationName,
  user,
  setInitialLoad,
}: LocationViewAnalyticsProps) {
  useEffect(() => {
    if (searchLoaded && !initialLoad && selectedAddress) {
      let ecomAddress = searchResults?.brands[0]?.location?.address || '';
      if (orderType === 'delivery') {
        ecomAddress = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state}, ${selectedAddress?.zip} ${selectedAddress?.country}`;
        if (!selectedAddress?.line2) {
          ecomAddress = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state}, ${selectedAddress?.zip} ${selectedAddress?.country}`;
        }
      }
      let brands = [];
      if (searchResults !== null) {
        for (let i = 0; i < searchResults.brands.length; i++) {
          let brand = {
            item_list_name: searchResults.brands[i].name,
            item_list_id: searchResults.brands[i].id,
          };
          brands.push(brand);
        }
      }
      let user_id = user?.id;
      if (user?.id === undefined) {
        user_id = 'anonymous';
      }
      let currency = searchResults?.brands[0]?.location?.currency || 'USD';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'home',
        date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
        user_id: user_id,
        ecommerce: {
          affiliation: orderType,
          currency: currency,
          address: ecomAddress,
          brand_list: brands,
        },
      });
      window.dataLayer.push({
        event: 'virtual_pageview',
        page_title: 'locations',
        page_url: window.location.pathname,
      });
      setInitialLoad(true);
    }
  }, [
    searchLoaded,
    orderType,
    searchResults,
    selectedAddress,
    initialLoad,
    locationName,
    user,
    setInitialLoad,
  ]);
}
