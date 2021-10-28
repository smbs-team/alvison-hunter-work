import { combineReducers } from 'redux';
import userReducer from './userReducer';
import cartReducer from './cartReducer';
import paymentReducer from './paymentReducer';
import locationReducer from './locationReducer';
import orderReducer from './orderReducer';

export default combineReducers({
  userStore: userReducer,
  cartStore: cartReducer,
  paymentStore: paymentReducer,
  locationStore: locationReducer,
  orderStore: orderReducer,
});
