/**
 * Represents the user object in the database.
 */
export interface User {
  id?: string;
  email?: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  password: string;
  addresses: Address[];
  marketing: boolean;
  smsOptIn: boolean;
  role: string;
}
/**
 * The object representing an address for a user.
 */
export interface Address {
  id?: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  presetAddressEntry?: boolean;
  deliveryInstructions: string;
  placeId?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  fromSelectComponent?: boolean;
  addressRaw?: any;
}
/**
 * Interface for the userStore in the redux store.
 */
export interface UserStore {
  user: User | null;
  selectedAddress: Address | null;
  showModal: boolean;
  modalTitle?: string | null;
  modalText?: string | null;
  modalBtn?: any;
  authLoaded?: boolean;
}
