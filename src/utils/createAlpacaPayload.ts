import { IAlpacaPayload, Brand, Address, ICheckoutForm } from '../interfaces';
import { getAddressFromStringOrObject } from './';

export function createAlpacaPayload(
  currentBrandObj: Brand,
  alpacaNoteState: ICheckoutForm,
  selectedAddress: Address
): IAlpacaPayload {
  const { locationBrandId, vessel } = currentBrandObj;
  const [lng, lat] = currentBrandObj.location.location.coordinates;
  const { placeId } = selectedAddress;
  const { floor, unit, additionalNotes } = alpacaNoteState;
  // Place id will always be here as it is fetched in selectAddress before
  // you get to here
  const venueAddress = getAddressFromStringOrObject(currentBrandObj.location.address)
  
  const { 
    line1: street, 
    line2:street_number, 
    city, 
    state: region, 
    zip 
  } = venueAddress || {};
  return {
    isAlpaca: true,
    placeId,
    extra: {
      additionalNotes,
      floor,
      unit,
      photo: 'http://site.com/img.jpg',
    },
    venueName: locationBrandId + vessel,
    venueAddress: {
      street,
      street_number,
      city,
      region,
      zip,
      lat,
      lng,
    },
  };
}
