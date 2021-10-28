import { Action, OrderStore } from '../../interfaces';

const initialState: OrderStore = {
  currentOrder: null,
  currentTracking: null,
  orderGroups: null,
  currentGroup: null,
  groupsFetched: false,
  orderType: localStorage.getItem('orderType') || 'delivery',
  showDeliveryScheduler: false,
  deliveryTime: localStorage.getItem('deliveryTime') 
    ? JSON.parse(localStorage.getItem('deliveryTime')!) 
    : null,
};

/**
 *
 * @param state
 * @param action
 * @returns
 * Reducer for the order state.
 */
export default function orderReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'UPDATE_TRACKING':
      const { orderLordInfo, currentOrder, tracking } = action.payload;
      const type = currentOrder && currentOrder.order.type;
      const isTakeawayFinished = orderLordInfo
        ? orderLordInfo.readyAt || tracking.state === 5
        : null;
      return {
        ...state,
        currentTracking: tracking
          ? {
              ...action.payload.tracking,
              state:
                type !== 'takeaway'
                  ? tracking.state
                  : !isTakeawayFinished
                  ? 1
                  : 5,
            }
          : null,
        currentOrder: action.payload.currentOrder,
      };
    case 'FETCH_ORDER_GROUPS':
      const { orderGroups } = action.payload;
      return {
        ...state,
        orderGroups,
        groupsFetched: true,
      };
    case 'SET_ORDER_GROUP':
      const { orderGroup } = action.payload;
      return {
        ...state,
        currentGroup: orderGroup,
      };
    case 'SET_ORDER_TYPE':
      const { orderType } = action.payload;
      localStorage.setItem('orderType', orderType);
      return {
        ...state,
        orderType,
      };
    case 'TOGGLE_DELIVERY_SCHEDULER':
      const { showDeliveryScheduler } = action.payload;
      return {
        ...state,
        showDeliveryScheduler,
      }
    case 'SET_DELIVERY_TIME':
      const { deliveryTime } = action.payload;
      localStorage.setItem('deliveryTime', JSON.stringify(deliveryTime));
      return {
        ...state,
        deliveryTime,
      }
    default:
      return state;
  }
}
