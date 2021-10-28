import axios from 'axios';
import { Dispatch } from 'redux';
import { User, CartItem, OrderGroup, IPlaceOrderData } from '../../interfaces';
import {
  makePayment,
  fetchUnavailableItems,
  toggleModal,
  update,
  logout,
  verifyPromo,
} from './';
import { clearCarts, getGuestUserObject } from './';
import {
  parseError,
  joinWithAnd,
  getConfigCatVal,
  transformCarts,
  totalAllCarts,
  handlePlaceOrderAnalytics,
  getSubdomain,
} from '../../utils';
import { DateTime } from 'luxon';
import { geocodeByPlaceId } from 'react-places-autocomplete';
/**
 *
 * Takes all steps that are required to place an order.
 * 1. If the user is a guest, the guest user object is found or created in the auth service.
 * 2. If the user is a guest, the provided promo is verified against the provided phone number for
 * 3. Transforms carts into a format that is usable by the server/OrderLord.
 *    restrictions.
 * 4. A request is done to the server to make sure that the store has not closed between going to checkout
 *    and placing the order.
 * 5. A check is done to make sure that the user is not trying to order items that have become unavailable
 *    since adding them to their cart.
 * 6. A request is made to the payment service to create an uncaptured payment to make sure that the user has
 *    the funds to place the order.
 * 7. A request is made to the order service that actually places the order.
 * 8. Google analytics are handled. Even if they fail, this function should succeed.
 * 9. The user is forwarded to the tracking page and relevant sections of the redux store are cleared.
 * 10. If the user was a guest, they are logged out.
 */

export const placeOrder =
  ({
    carts,
    quantities,
    address,
    history,
    searchResults,
    user,
    tip,
    orderType,
    selectedCard,
    orderNote,
    setLoading,
    promo,
    alpacaData,
    isGuestUser,
    subTotal,
    deliveryTime,
    ...formData
  }: IPlaceOrderData) =>
  async (dispatch: Dispatch) => {
    const { firstName, lastName, phone, email, marketing, smsOptIn } = formData;
    try {
      if (setLoading) {
        await setLoading(true);
      }
      // Add order note based on subdomain.
      const kitchenNote = await getConfigCatVal('kitchennote', `${getSubdomain() === 'wework' && '*WeWork*'}${getSubdomain() === 'alpaca' && '*Alpaca*'}`);
      // fetch google location info
      if (alpacaData && !alpacaData.googleResponse) {
        alpacaData.googleResponse =
          address.addressRaw || (await geocodeByPlaceId(alpacaData.placeId!));
      }
      if (isGuestUser) {
        // This needs to be put in a try/catch block so that the rest of this function can
        // be stopped. What this does is finds or creates a "User" object with the role of "GUEST"
        // for the person that is checking out as a guest. If they come back and sign up later,
        // the account will just be converted to a regular user account and they will be
        // able to find all their previous order.
        try {
          user = await dispatch(
            getGuestUserObject(
              {
                firstName,
                lastName,
                phone,
                email,
                marketing,
                smsOptIn,
              },
              history
            ) as any
          );
          // If a promo has been added by a guest user, it needs to be verified against their
          // guest user object befor ethey are allowed to use it. If they are not then the order
          // must be stopped at this point.
          if (promo) {
            await dispatch(
              verifyPromo(user.id, promo.code, subTotal, (success, message) => {
                if (!success) {
                  throw {
                    message,
                    type: 'promo',
                  };
                }
              }) as any
            );
          }
        } catch (e) {
          if (e.type === 'promo') {
            await dispatch(logout(undefined, true) as any);
            dispatch(
              toggleModal(true, `${e.message}.`, 'Promo Not Usable') as any
            );
          }
          if (setLoading) {
            setLoading(false);
          }
          return;
        }
      }
      const transformed = await transformCarts({
        carts,
        quantities,
        address,
        user,
        searchResults,
        tips: tip,
        type: orderType,
        note: orderNote,
        promo,
        deliveryTime: deliveryTime !== 'ASAP' ? deliveryTime : undefined,
      });
      // Update user object with marketing preference
      if (!isGuestUser) {
        await dispatch(update({ ...user, marketing, smsOptIn }) as any);
      }
      // If any of the brands are closed, we must prevent ordering from them.
      const brandClosed = Object.values(transformed).find(
        (item) => !item.isOpen
      );
      if (brandClosed) {
        if (setLoading) {
          await setLoading(false);
        }
        return dispatch(
          toggleModal(
            true,
            'Oh, that’s sad. Unfortunately, the restaurant you’re ordering from is currently closed.',
            'Closed'
          ) as any
        );
      }
      const currentCart = Object.values(transformed)[0];
      const { brand: brandObj } = currentCart;
      const { location: locationObj } = currentCart.brand;
      // This removes carts that previously had items that are now empty. This should
      // address a bug from earlier versions and may be able to be removed in the future.
      for (const each in transformed) {
        if (!transformed[each].products.length) {
          delete transformed[each];
        }
        if (transformed[each]) {
          delete transformed[each].brand;
        }
      }
      // This is a check for if the user is trying to order items that are currently unavailable
      const allUnavailable = new Set(
        (
          await dispatch(
            fetchUnavailableItems(brandObj.integrationId, false) as any
          )
        ).map((item: any) => item.id.toString())
      );
      const currentCartUnavailable: string[] = [];
      currentCart.products.forEach((prod: CartItem) => {
        if (allUnavailable.has(prod.orderingSystemId)) {
          currentCartUnavailable.push(prod.name);
        } else {
          prod.additions.forEach((add) => {
            if (allUnavailable.has(add.orderingSystemId)) {
              currentCartUnavailable.push(add.name);
            }
          });
        }
      });
      if (currentCartUnavailable.length) {
        if (setLoading) {
          await setLoading(false);
        }
        const errorText = `
          ${joinWithAnd([...currentCartUnavailable])} ${
          currentCartUnavailable.length === 1 ? 'is' : 'are'
        } no longer available. Please modify your order and try again.
        `;
        return dispatch(
          toggleModal(true, errorText, 'Unavailable Items') as any
        );
      }
      // Gets the total prices for all carts.
      const totals = totalAllCarts(
        carts,
        quantities,
        Object.values(transformed)[0].taxRate,
        tip,
        promo
      );
      // Makes the actual stripe charge
      const charge = await dispatch(
        makePayment(
          user,
          Math.round(Number(totals.currentCartGrandTotal.toFixed(2)) * 100),
          locationObj.currency,
          !isGuestUser ? selectedCard?.stripeId : selectedCard?.source
        ) as any
      );
      for (const key in transformed) {
        const customerNote = transformed[key].note;
        if (kitchenNote && kitchenNote.length > 1) {
          const hasPeriod = kitchenNote.includes('.');
          transformed[key].note = `${kitchenNote}${
            !hasPeriod ? '.' : ''
          } ${customerNote}`;
        }
      }
      //Add the chargeId onto each order.
      for (const key in transformed) {
        transformed[key].chargeId = charge.id;
      }
      //calculate utc offset
      const getOffset = (timeZone = 'UTC', date = new Date()) => {
        const utcDate = new Date(
          date.toLocaleString('en-US', { timeZone: 'UTC' })
        );
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
        return (tzDate.getTime() - utcDate.getTime()) / 6e4;
      };
      const time = getOffset(brandObj.location.timeZone);
      const { data } = await axios.post('/api/order', {
        carts: transformed,
        totals,
        promo,
        alpacaData,
        time,
      });
      await dispatch(clearCarts() as any);
      const { message } = data;
      const { orderId } = data.data;
      //Add purchase elements to datalayer for google analytics
      try {
        handlePlaceOrderAnalytics({
          transformed,
          locationObj,
          orderId,
          user,
          promo,
          selectedCard,
        });
      } catch {}
      // If we get the message below, it means that the alpaca request failed, but the user will
      // still get their order, hence the succes response with the request.
      if (message === 'Alpaca request failed') {
        dispatch(
          toggleModal(
            true,
            `Sorry! Your order was successful but we were unable to connect it to Alpaca.
          Please collect your order from the Alpaca outpost in the main lobby upon arrival.`,
            'Aplaca Error'
          ) as any
        );
      }
      await dispatch(setDeliveryTime(null) as any);
      history.push(`/order/${orderId}/tracking`);
      if (isGuestUser) {
        await dispatch(logout() as any);
        if (setLoading) {
          await setLoading(false);
        }
      }
    } catch (e) {
      // The setLoading function is sent if a button is used that will require turning
      // off of the loading setting.
      if (isGuestUser) {
        await dispatch(logout() as any);
      }
      if (setLoading) {
        await setLoading(false);
      }
      if (e.type !== 'stripe') {
        // This should only happen if the error is not thrown by stripe. Stripe error modals
        // inside the charging functions.
        return dispatch(toggleModal(true, ...parseError(e)) as any);
      }
    }
  };
/**
 *
 * @param orderId
 * @returns
 * Fetches tracking for a particular orderId from our server via the OrderLord
 * server.
 */
export const getTracking = (orderId: string) => async (dispatch: Dispatch) => {
  try {
    const { data } = await axios.get(`/api/order/${orderId}/tracking`);
    return dispatch({
      type: 'UPDATE_TRACKING',
      payload: {
        tracking: data.tracking,
        currentOrder: data.order,
        orderLordInfo: data.orderLordInfo,
      },
    });
  } catch (e) {
    if (
      e.response &&
      e.response.data &&
      e.response.data.message &&
      e.response.data.message.match(/Order Confirmed/gi)
    ) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  }
};
/**
 *
 * @returns
 * Clears the currently selected tracking from the store.
 */
export const clearTracking = () => async (dispatch: Dispatch) => {
  return dispatch({
    type: 'UPDATE_TRACKING',
    payload: { tracking: null },
  });
};
/**
 *
 * @param user
 * @returns
 * Fetches all OrderGroups for a given user. Pagination will
 * need to be added to this and on the API side.
 */
export const fetchOrderGroups = (user: User) => async (dispatch: Dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/order/orderGroup/user/${user.id}?status=completed`
    );
    return dispatch({
      type: 'FETCH_ORDER_GROUPS',
      payload: { orderGroups: data.orderGroups },
    });
  } catch (e) {
    return dispatch(toggleModal(true, ...parseError(e)) as any);
  }
};
/**
 *
 * @param groupId
 * @param currentGroups
 * @returns
 * Sets a particular groupId as the currently selected OrderGroup. If it is not
 * already fetched, it is fetched from the server.
 */
export const setOrderGroup =
  (groupId: string, currentGroups: OrderGroup[] = []) =>
  async (dispatch: Dispatch) => {
    try {
      // First, check if the OrderGroup is already fetched.
      const foundGroup = currentGroups.find((group) => group.id === groupId);
      if (foundGroup) {
        return dispatch({
          type: 'SET_ORDER_GROUP',
          payload: { orderGroup: foundGroup },
        });
      }
      // If it is not fetched, fetch it.
      const { data } = await axios.get(`/api/order/orderGroup/${groupId}`);
      return dispatch({
        type: 'SET_ORDER_GROUP',
        payload: { orderGroup: data.orderGroup },
      });
    } catch (e) {
      return dispatch(toggleModal(true, ...parseError(e)) as any);
    }
  };
/**
 *
 * @returns
 * Removes the currently-set OrderGroup from the store
 */
export const unsetOrderGroup = () => (dispatch: Dispatch) => {
  return dispatch({
    type: 'SET_ORDER_GROUP',
    payload: { orderGroup: null },
  });
};
/**
 *
 * @param orderType
 * @returns
 * Sets the type of order (delivery, takeaway or other)
 */
export const setOrderType = (orderType: string) => (dispatch: Dispatch) => {
  return dispatch({
    type: 'SET_ORDER_TYPE',
    payload: { orderType: orderType },
  });
};

export const toggleDeliveryScheduler = 
  (
    showDeliveryScheduler: boolean,
  ) => 
  async(dispatch: Dispatch) => {
  return dispatch({
    type: 'TOGGLE_DELIVERY_SCHEDULER',
    payload: { showDeliveryScheduler },
  })
}

export const setDeliveryTime = 
  (
    deliveryTime: DateTime | string | null
  ) => 
  async(dispatch: Dispatch) => {
  return dispatch({
    type: 'SET_DELIVERY_TIME',
    payload: { deliveryTime },
  })
}