import { LocationStore, Action } from '../../interfaces';

export const initialState: LocationStore = {
  searchResults: null,
  searchLoaded: false,
  selectedLocation: localStorage.getItem('selectedLocation'),
  unavailableItems: [],
  unavailableFetched: false,
  searchInitialized: false,
  showAddressEntry: false,
  selectedTab: localStorage.getItem('localSelectedTab') || '10 min menu',
};

/**
 *
 * @param state
 * @param action
 * @returns
 * Reducer for the location state.
 */
export default function locationReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'UPDATE_LOCATION':
      const { searchResults, selectedLocation } = action.payload;
      if (selectedLocation) {
        localStorage.setItem('selectedLocation', selectedLocation);
      } else {
        localStorage.removeItem('selectedLocation');
      }
      return {
        ...state,
        searchResults,
        searchLoaded: true,
        selectedLocation,
      };
    case 'TOGGLE_LOCATION_LOADED':
      const { searchLoaded, searchInitialized } = action.payload;
      return {
        ...state,
        searchLoaded,
        searchInitialized: searchInitialized || state.searchInitialized,
      };
    case 'SET_UNAVAILABLE_ITEMS':
      const { unavailableItems, unavailableFetched } = action.payload;
      return {
        ...state,
        unavailableItems: unavailableItems,
        unavailableFetched,
      };
    case 'TOGGLE_ADDRESS_ENTRY':
      const { newVal } = action.payload;
      return {
        ...state,
        showAddressEntry: newVal,
      };
    case 'RESET_LOCATION':
      return { ...initialState };
    case 'UPDATE_SELECTED_VIEW_TAB':
      const { tab } = action.payload;
      return { ...state, selectedTab: tab };
    default:
      return state;
  }
}
