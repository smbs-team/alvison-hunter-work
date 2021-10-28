import { IWeWorkLocationsObject } from '../interfaces';

export const WEWORK_LOCATIONS: IWeWorkLocationsObject = {
  // SAN_FRANCISCO: {
  //   SALESFORCE_BUILDING: {
  //     name: 'Salesforce Building',
  //     full_address: '415 Mission Street, San Francisco, CA 94105',
  //     address1: '415 Mission Street',
  //     floors: ['36th Floor'],
  //     city: 'San Francisco',
  //     state: 'CA',
  //     zip: '94105',
  //     directions: 'Coming soon',
  //     timeZone: 'America/Los_Angeles',
  //   }
  // },
  MIAMI: {
    BRICKELL: {
      name: 'Brickell City Centre',
      full_address: '78 SW 7th St, Miami, FL 33130',
      address1: '78 Southwest 7th Street',
      floors: ['8th Floor'],
      city: 'Miami',
      state: 'FL',
      zip: '33131',
      directions: 'Drop off on 8th Floor',
      timeZone: 'America/New_York',
      enable_asap: true,
    },
    SE_FINANCIAL_CENTER: {
      name: 'South East Financial Center',
      full_address: '200 S Biscayne Blvd, Miami, FL 33131',
      address1: '200 South Biscayne Boulevard',
      floors: ['20th Floor'],
      city: 'Miami',
      state: 'FL',
      zip: '33131',
      directions: `Enter the main entrance and go through the double doors on the left of the cafe / escalators. Show the security office your REEF badge and they will authorize the freight elevator for 20th floor.`,
      timeZone: 'America/New_York',
      enable_asap: true,
    },
    WYNWOOD: {
      name: 'Wynwood Garage',
      full_address: '360 NW 27th St, Miami, FL 33127',
      address1: '360 Northwest 27th Street',
      floors: ['8th Floor'],
      city: 'Miami',
      state: 'FL',
      zip: '33127',
      directions:
        'Loading zone at 26th St. at the entrance of the garage. Ring the telecom for access to the elevator, which should take you to the 8th floor. The outpost is located on this floor.',
      timeZone: 'America/New_York',
      enable_asap: true,
    },
    SOUTH_BEACH: {
      name: 'South Beach',
      full_address: '429 Lenox Avenue, Miami Beach, FL 33139',
      address1: '429 Lenox Avenue',
      floors: ['1st Floor'],
      city: 'Miami Beach',
      state: 'FL',
      zip: '33139',
      directions:
        'There is a loading zone in front of entrance on Lenox Ave and a parking lot you can pull into on the side of the building. Ring the telecom button outside the door and the community manager will let you in. The outpost is located on the ground floor just inside.',
      timeZone: 'America/New_York',
    },
    CORAL_GABLES_1: {
      name: 'Coral Gables (Giralda Place)',
      full_address: '255 Giralda Avenue, Coral Gables, FL 33134',
      address1: '255 Giralda Avenue',
      floors: ['5th Floor'], 
      city: 'Coral Gables',
      state: 'FL',
      zip: '33134',
      directions: 'Can be delivered via main elevators heading up to 5th floor, check in with community team and drop off.',
      timeZone: 'America/New_York',
    },
    CORAL_GABLES_2: {
      name: 'Coral Gables (2222 Ponce de Leon)',
      full_address: '2222 Ponce de Leon, Miami, FL 33134',
      address1: '2222 Ponce de Leon',
      floors: ['3rd Floor'], 
      city: 'Coral Gables',
      state: 'FL',
      zip: '33134',
      directions: 'Delivery instructions: Street parking in area near Giralda or garage connected to building on 260 Giralda. Go up public elevator to main floor. Drop off near pantry.',
      timeZone: 'America/New_York',
    },
  },
};