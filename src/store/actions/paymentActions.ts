import { Dispatch } from 'redux';
import axios from 'axios';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { CardNumberElement } from '@stripe/react-stripe-js';
import { User } from '../../interfaces/userInterfaces';
import { Card } from '../../interfaces/paymentInterfaces';
import { toggleModal } from './userActions';
import { parseError } from '../../utils/parseError';

/**
 *
 * @param userId
 * @param cb
 * @returns
 * Fetches a list of cards for a userId. A callback can be give optionally
 * if we need to have something done on completion.
 */
export const fetchCards =
  (userId: string, cb?: (cards: Card[]) => void) =>
  async (dispatch: Dispatch) => {
    try {
      const { cards } = (await axios.get(`/api/payment/user/${userId}/card`))
        .data;

      await dispatch({ type: 'FETCH_CARDS', payload: { cards } });
      if (cb) {
        cb(cards);
      }
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @param stripe
 * @param elements
 * @param user
 * @param callbackFunction
 * @returns
 * Adds a new card from stripe using the elements from the stripe.js library.
 */
export const addCard =
  (
    stripe: Stripe,
    elements: StripeElements,
    user?: User,
    defaultCard?: boolean,
    callbackFunction?: (arg?: any) => void
  ) =>
  async (dispatch: Dispatch) => {
    // All of these need to be present for adding a new card.
    if (!stripe || !elements) {
      return dispatch(
        toggleModal(
          true,
          'Please enter valid card information',
          'Invalid Card'
        ) as any
      );
    }
    try {
      const cardElement = elements.getElement(CardNumberElement);
      const token = await stripe.createToken(cardElement!);
      if (token.error) {
        if (callbackFunction) {
          callbackFunction(false); //dont hide the card form if there was any error
        }
        return dispatch(
          toggleModal(
            false,
            token.error.message || 'Invalid card information',
            'Error Adding Card'
          ) as any
        );
      }
      // Stores the payment method on our servers using the token provided
      // by stripe.js if the user is logged in. If they are a guest user,
      // the token can only be used one time.
      if (user) {
        await axios.post(`/api/payment/user/${user.id}/card`, {
          token: token.token!.id,
          defaultCard: defaultCard
        });
      }
      if (callbackFunction) {
        callbackFunction();
      }
      const { last4, exp_year, exp_month, brand, id } =
        token?.token?.card || {};
      const card = {
        last4,
        expYear: exp_year,
        expMonth: exp_month,
        type: brand,
        stripeId: id,
        defaultCard: defaultCard,
        // This is needed because for guest users, they cannot use the generated
        // token more than one time because there is no associated stripe "cutomer".
        source: token?.token?.id,
      };
      return dispatch({
        type: 'ADD_CARD',
        payload: { card },
      });
    } catch (e) {
      dispatch(
        toggleModal(true, ...parseError({ ...e, type: 'stripe' })) as any
      );
      if (callbackFunction) {
        callbackFunction();
      }
    }
  };
/**
 *
 * @param card
 * @returns
 * Selects a card that will be used in the next order.
 */
export const selectCard = (card: Card) => async (dispatch: Dispatch) => {
  return dispatch({ type: 'SELECT_CARD', payload: { card } });
};
/**
 *
 * @param card
 * @returns
 * Deletes a card that is stored.
 */
export const deleteCard =
  (userId: string, cardId: string) => async (dispatch: Dispatch) => {
    try {
      await axios.delete(`/api/payment/user/${userId}/card/${cardId}`);
      return dispatch({ type: 'DELETE_CARD', payload: { id: cardId } });
    } catch (e) {
      return dispatch(
        toggleModal(true, ...parseError({ ...e, type: 'stripe' })) as any
      );
    }
  };
/**
 *
 * @param user
 * @param amount
 * @param source
 * @returns
 * Makes a stripe payment through our server using a particular source (which may be provided
 * as a token)
 */
export const makePayment =
  (user: User, amount: number, currency: string = 'usd', source?: string) =>
  async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.post('/api/payment', {
        userId: user.id,
        amount,
        source,
        email: user.email,
        capture: false,
        currency,
        isGuest: user.role === 'GUEST',
      });
      return data.charge;
    } catch (e) {
      dispatch(
        toggleModal(true, ...parseError({ ...e, type: 'stripe' })) as any
      );
      throw {
        ...e,
        type: 'stripe',
      };
    }
  };
/**
 *
 * @param chargeId
 * @returns
 * Captures a charge that has been created but not captured
 */
export const capturePayment =
  (chargeId: string) => async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.put(`/api/payment/${chargeId}/capture`);
      return data.charge;
    } catch (e) {
      dispatch(
        toggleModal(true, ...parseError({ ...e, type: 'stripe' })) as any
      );
      throw {
        ...e,
        type: 'stripe',
      };
    }
  };
/**
 *
 * @returns
 * Initializes paymentState to its default values.
 */
export const clearPayments = () => (dispatch: Dispatch) => {
  return dispatch({ type: 'CLEAR_PAYMENTS' });
};
/**
 *
 * @param code
 * @returns
 * Verifys a promo code for a given user
 */
export const verifyPromo =
  (
    userId: string = 'guest',
    code: string,
    subTotal: number,
    cb?: (valid: boolean, message: string) => void
  ) =>
  async (dispatch: Dispatch) => {
    if (!code) {
      if (cb) {
        return cb(true, '');
      }
    }
    try {
      const { data } = await axios.post(`/api/promo/${code}/${userId}/verify`, {
        subTotal,
      });
      await dispatch({ type: 'SET_PROMO', payload: { promo: data.promo } });
      if (cb) {
        cb(true, `Promo code "${data.promo.code}" applied!`);
      }
    } catch (e) {
      await dispatch({ type: 'SET_PROMO', payload: { promo: null } });
      if (cb) {
        cb(
          false,
          `${e.response.data ? e.response.data.message : 'is invalid'}`
        );
      }
    }
  };

/**
 *
 * @param code
 * @returns
 * Marks a promo as used and removes it from the store
 */
export const usePromo =
  (userId: string, code: string) => async (dispatch: Dispatch) => {
    try {
      await axios.post(`/api/promo/${code}/${userId}/use`);
      await dispatch({ type: 'SET_PROMO', payload: { promo: null } });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError({ ...e })) as any);
    }
  };
/**
 *
 * @returns
 * Clears the promo from the store
 */
export const clearPromo = () => (dispatch: Dispatch) => {
  return dispatch({ type: 'SET_PROMO', payload: { promo: null } });
};
/**
 *
 * @returns
 * Opens up the add new card payment modal 
 */
export const toggleAddPaymentModal =
  (newVal: boolean) => async (dispatch: Dispatch) => {
    return dispatch({ type: 'TOGGLE_ADD_PAYMENT_MODAL', payload: { newVal } });
  };
