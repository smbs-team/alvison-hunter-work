import { Brand } from './menuInterfaces';

export interface LocationStore {
  searchResults: SearchResults | null;
  searchLoaded: boolean;
  selectedLocation?: string | null;
  unavailableItems: UnavailableItem[];
  unavailableFetched: boolean;
  searchInitialized: boolean;
  showAddressEntry: boolean;
  selectedTab: string;
}

export interface UnavailableItem {
  id: number;
  name: string;
  date: string;
}

/**
 * Corresponds to location search results from the API.
 */
export interface SearchResults {
  addressRaw: any;
  id: string;
  name: string;
  brands: Brand[];
  address: string;
  currency?: string;
  location: {
    coordinates: number[];
  };
}

export interface PlaceType {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      }
    ];
  };
}

export interface IWeWorkLocationsObject {
  [cityName: string]: {[weworkName: string]: IWeWorkLocation};
}

export interface IWeWorkLocation {
  name: string;
  full_address: string;
  address1: string;
  floors: string[]
  city: string;
  state: string;
  zip: string;
  directions: string;
  timeZone: string;
  enable_asap?: boolean;
}

export interface IAlpacaLocationsObject {
  [cityName: string]: {[alpacaName: string]: IAlpacaLocation};
}

export interface IAlpacaLocation {
  name: string;
  full_address: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
}