import {
  UserStore,
  CartStore,
  PaymentStore,
  LocationStore,
  OrderStore,
} from './';
/**
 * An interface for redux actions.
 */
export interface Action {
  type: string;
  payload: {
    [key: string]: any;
  };
}

export interface Store {
  userStore: UserStore;
  cartStore: CartStore;
  paymentStore: PaymentStore;
  locationStore: LocationStore;
  orderStore: OrderStore;
}
