import { IAlpacaLocationsObject } from '../interfaces';

//These are the alpaca locations where the tip function should be hidden 
//bc alpaca will use 'alpaca runners' instead of drivers. 
//This is a short term solution until the alpaca team builds an endpoint 
//to fetch alpaca building locations and tipping requirements.
export const ALPACA_NO_TIP_LOCATIONS: IAlpacaLocationsObject = {
  NEW_YORK: {
    AVE_OF_AMERICAS: {
      name: '620 6th Avenue',
      full_address: '620 6th Avenue, New York, NY 10011',
      address1: '620 6th Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10011',
    },
  },
};