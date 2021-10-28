import { Address, SearchResults } from '../interfaces';

export function getDeliveryMessageText(
  orderType: string,
  selectedAddress?: Address | null,
  searchResults?: SearchResults | null
) {
  const orderTypeText = orderType === 'delivery' ? 'Delivery' : 'Pickup';
  const shortSelectedAddress =
    selectedAddress && selectedAddress?.line1.length > 20
      ? selectedAddress?.line1.substring(0, 20)
      : selectedAddress?.line1;
  const shortSearchResultsAddress =
    searchResults?.address && searchResults.address.length > 20
      ? searchResults.address.substring(0, 20)
      : searchResults?.address;
  const [addressPreposition, shortAddress] =
    orderType === 'delivery'
      ? selectedAddress?.presetAddressEntry
        ? ['near', shortSelectedAddress]
        : ['to', shortSelectedAddress]
      : searchResults?.address
      ? ['at', shortSearchResultsAddress]
      : ['near', shortSelectedAddress];
  return {
    orderTypeText,
    addressPreposition,
    shortAddress,
  };
}
