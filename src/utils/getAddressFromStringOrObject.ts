import { Address } from '../interfaces/userInterfaces';

export const getAddressFromStringOrObject = (
  address: string | Address,
  latitude?: number,
  longitude?: number
) => {
  if (typeof address === 'string') {
    try {
      const split = address.split(', ');
      const stateAndZip = split[2].split(' ');
      return {
        line1: split[0],
        line2: '',
        city: split[1],
        state: stateAndZip[0],
        zip: stateAndZip.slice(1).join(' '),
        country: split[3],
        latitude,
        longitude,
        deliveryInstructions: ''
      };
    } catch (e) {
      return null;
    }
  }
  return address;
};
