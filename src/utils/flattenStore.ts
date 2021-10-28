import {
  UserStore,
  CartStore,
  PaymentStore,
  LocationStore,
  OrderStore,
  Store,
} from '../interfaces';

interface FlatStore
  extends UserStore,
  CartStore,
  PaymentStore,
  LocationStore,
  OrderStore {}

export const flattenStore = (state: Store): FlatStore =>
  Object.values(state).reduce((acc, reducer) => ({ ...acc, ...reducer }), {});
