import { UserStore, Action } from '../../interfaces';

function avoidLocalStorageBug() {
  const saved = localStorage.getItem('savedAddress');
  if (saved) {
    try {
      JSON.parse(saved);
    } catch (e) {
      localStorage.removeItem('savedAddress');
    }
  }
}

/**
 *
 * @returns
 * Gets the saved address from localStorage that is saved when a user
 * searches on the homepage.
 */
export function getSavedAddress() {
  avoidLocalStorageBug();
  const saved = localStorage.getItem('savedAddress');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
}

const initialState: UserStore = {
  user: null,
  selectedAddress: getSavedAddress(),
  showModal: false,
  modalTitle: '',
  modalText: '',
  modalBtn: null,
  authLoaded: false,
};
/**
 *
 * @param state
 * @param action
 * @returns
 * Reducer for the user state.
 */
export default function userReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'AUTH_CHECKED':
    case 'LOGIN':
    case 'SIGNUP':
    case 'UPDATE_USER':
    case 'NEW_ADDRESS':
    case 'UPDATE_ADDRESS':
    case 'DELETE_ADDRESS':
      return { ...state, user: action.payload, authLoaded: true };
    case 'SELECT_ADDRESS':
      const { address } = action.payload;
      localStorage.setItem('savedAddress', JSON.stringify(address));
      return { ...state, selectedAddress: address };
    case 'TOGGLE_MODAL':
      return {
        ...state,
        showModal: action.payload.showModal,
        modalTitle: action.payload.modalTitle,
        modalText: action.payload.modalText,
        modalBtn: action.payload.modalBtn,
      };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}
