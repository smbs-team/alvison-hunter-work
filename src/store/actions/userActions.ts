import axios from 'axios';
import { Dispatch } from 'redux';
import { FormObject } from '../../interfaces/formInterfaces';
import { User, Address } from '../../interfaces/userInterfaces';
import { clearPayments } from './paymentActions';
import { parseError } from '../../utils/parseError';
import { History } from 'history';
import {
  geocodeByPlaceId,
  getLatLng,
  geocodeByAddress,
} from 'react-places-autocomplete';
import { subdomains } from '../../constants/subdomains';

/**
 * This should handle multiple types of errors that are returned from the server.
 * Currently validation errors return a differently formatted response object than
 * other requests.
 */
export const handleUserError = (e: any) => {
  return e.response.data.error
    ? e.response.data.error.message
    : e.response.data.message;
};
/**
 *
 * @returns
 * Fetches the currently logged-in user from the server.
 */
export const me = () => async (dispatch: Dispatch) => {
  try {
    const res = await axios.get('/api/auth/me');
    return dispatch({ type: 'AUTH_CHECKED', payload: res.data.currentUser });
  } catch (e) {
    return dispatch(toggleModal(true, ...parseError(e)) as any);
  }
};
/**
 *
 * @param user
 * @param history
 * @returns
 * Submits a login request from a form. Redirects to /location is history
 * is provided.
 */
export const login =
  (user: FormObject, history?: History, referrer?: string) =>
  async (dispatch: Dispatch) => {
    try {
      const res = await axios.post('/api/auth/login', user);
      await dispatch({ type: 'LOGIN', payload: res.data.currentUser });
      if (history) {
        history.push(referrer || '/');
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'login',
        user_id: res.data.currentUser.id,
      });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @param newUser
 * @param history
 * @returns
 * Signs up a new user from a FromObject.
 */
export const signup =
  (
    newUser: FormObject,
    history?: History,
    referrer?: string | null
  ) =>
  async (dispatch: Dispatch) => {
    try {
      const res = await axios.post('/api/auth/signup', newUser);
      await dispatch({ type: 'SIGNUP', payload: res.data.currentUser });
      if (history) {
        history.push(referrer || '/');
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'signup',
        user_id: res.data.currentUser.id,
      });
      //determine subdomain for usersignup
      const keyFound = Object.keys(subdomains).find(
        (key) =>
          window.location.href.includes(`${key}.getreef.com`) ||
          window.location.href.includes(`${key}-stg.getreef.com`)
      );
      const {firstName, lastName, email, marketing, smsOptIn, phone} = newUser;
      window.analytics.identify(res.data.currentUser.id, {
        mailOptIn: marketing,
        smsOptIn: smsOptIn,
        event: 'signup',
        origin: keyFound || 'getreef',
        firstName, 
        lastName,
        email,
        phone,
      });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @param user
 * @returns
 * Updates a current user with a FormObject.
 */
export const update =
  (user: FormObject | User) => async (dispatch: Dispatch) => {
    try {
      const res = await axios.put(`/api/auth/users/${user.id}`, user);
      return dispatch({ type: 'UPDATE_USER', payload: res.data.user });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @param history
 * @returns
 * Logs the currently logged-in user out.
 */
export const logout =
  (history?: History, skipClearPayments?: boolean) =>
  async (dispatch: Dispatch) => {
    try {
      await axios.post('/api/auth/logout');
      dispatch({ type: 'LOGOUT', payload: null });
      if (!skipClearPayments) {
        dispatch(clearPayments() as any);
      }
      //if (history) return history.push('/');
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @param address
 * @returns
 * Adds a new address for a user.
 */
export const newAddress =
  (address: FormObject) => async (dispatch: Dispatch) => {
    try {
      /**
       * This is a janky solution for requiring 4 lines in the address for now. Proper
       * validation will need to be added into the forms
       */
      const res = await axios.post('/api/address', address);
      return dispatch({ type: 'NEW_ADDRESS', payload: res.data.user });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
export const updateAddress =
  (address: FormObject) => async (dispatch: Dispatch) => {
    try {
      const res = await axios.put(`/api/address/${address.id}`, address);
      return dispatch({ type: 'UPDATE_ADDRESS', payload: res.data.user });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @param addressId
 * @returns
 * Deletes an address stored on the database.
 */
export const deleteAddress =
  (addressId?: string) => async (dispatch: Dispatch) => {
    try {
      const res = await axios.delete(`/api/address/${addressId}`);
      return dispatch({ type: 'DELETE_ADDRESS', payload: res.data.user });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @param showModal
 * @param modalText
 * @returns
 * Toggles the generic error modal.
 */
export const toggleModal =
  (
    showModal: boolean,
    modalText?: string,
    modalTitle?: string,
    modalBtn?: any
  ) =>
  async (dispatch: Dispatch) => {
    return dispatch({
      type: 'TOGGLE_MODAL',
      payload: { showModal, modalText, modalBtn, modalTitle },
    });
  };

/**
 *
 * @param address
 * @returns
 * Selects which address to use in the store.
 */
export const selectAddress =
  (address: Address | null, cb?: () => void) => async (dispatch: Dispatch) => {
    try {
      // Adding a fallback for if we are missing all the parts of the
      // address that we will need later
      if (address) {
        if (!address.latitude || !address.addressRaw) {
          const googleResponse = address.placeId
            ? await geocodeByPlaceId(address.placeId)
            : await geocodeByAddress(
                `${address.line1} ${address.city}, ${address.state} ${address.zip}`
              );
          const latLng = await getLatLng(googleResponse[0]);
          address.latitude = latLng.lat;
          address.longitude = latLng.lng;
          if (!address.addressRaw) {
            address.addressRaw = googleResponse[0];
          }
          address.placeId = googleResponse[0].place_id;
        }
        localStorage.setItem('savedAddress', JSON.stringify(address));
        dispatch({ type: 'SELECT_ADDRESS', payload: { address } });
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      return dispatch(toggleModal(true, e.message) as any);
    }
  };
/**
 *
 * @param phone
 * @param history
 * @returns
 * Sends a request to send the user a password reset link.
 */
export const requestPasswordReset =
  (phone: string) => async (dispatch: Dispatch) => {
    try {
      await axios.post(`/api/auth/users/password/request`, { phone });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 * Resets a password with a provided password reset token
 * @param userId
 * @param token
 * @param password
 * @param history
 * @returns
 */
export const resetPassword =
  (userId: string, token: string, password: string, history: History) =>
  async (dispatch: Dispatch) => {
    try {
      const res = await axios.post(`/api/auth/users/password/reset`, {
        userId,
        token,
        password,
      });
      if (history) {
        history.push('/location');
      }
      return dispatch({ type: 'LOGIN', payload: res.data.user });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 * Fetches a guest user object or creates one if there wasn't one previously
 * @param userData
 * @returns
 */
export const getGuestUserObject =
  (
    userData: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      marketing?: boolean;
      smsOptIn?: boolean;
    },
    history: History
  ) =>
  async (dispatch: Dispatch) => {
    try {
      const {
        data: { user },
      } = await axios.post('/api/auth/guest', userData);
      return user;
    } catch (e) {
      dispatch(
        toggleModal(
          true,
          ...parseError(e, history, async () => {
            await dispatch(toggleModal(false) as any);
          })
        ) as any
      );
      throw e;
    }
  };
