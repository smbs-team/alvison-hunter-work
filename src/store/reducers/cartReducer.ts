import { CartStore, Carts, Quantities, Action } from '../../interfaces';
/**
 * Represents the initial state for the cart reducer.
 */
export const initialState: CartStore = {
  carts: getFromStorage('carts'),
  quantities: getFromStorage('quantities'),
  showCart: false,
  showRecentItem: false,
  recentItem: null,
};
/**
 *
 * @param storageName
 * @returns
 * Gets a particular item from localStorage and then calls JSON.parse
 * on it if it is found.
 */
export function getFromStorage(storageName: string) {
  const storedCarts = localStorage.getItem(storageName);
  return storedCarts ? JSON.parse(storedCarts) : {};
}
/**
 *
 * @param storageName
 * @param obj
 * Stores a particular stringified object in localStorage.
 */
export function addToStorage(storageName: string, obj: Carts | Quantities) {
  localStorage.setItem(storageName, JSON.stringify(obj));
}
/**
 *
 * @param state
 * Handles storing of both the carts object and quantities object
 */
export function handleStorage(state: { carts: Carts; quantities: Quantities }) {
  addToStorage('carts', state.carts);
  addToStorage('quantities', state.quantities);
}
/**
 *
 * @returns
 * Creates a unique id that can be used to keep track of items in the quantities object.
 * It can also be used to update an instance of an item in a cart.
 */
export const createCartId = () => `id-${new Date().getTime()}`;
/**
 *
 * @param state
 * @param action
 * @returns
 * Reducer for the cart state.
 */
export default function cartReducer(state = initialState, action: Action) {
  if (action.payload) {

    const { brandId, item, brands, quantity, onePerCart } = action.payload;

    const cart = state.carts![brandId] || [];

    //element index
    let idx = cart && !onePerCart
        ? cart.findIndex((currentItem) => item?.cartId === currentItem?.cartId)
        : cart.findIndex((currentItem) => item?.guid === currentItem?.guid);


    switch (action.type) {


      case 'ADD_TO_CART':
        let cartId: string;

        if ((onePerCart && idx < 0) || !onePerCart) {
          item.cartId = createCartId();
          cartId = item.cartId;
          cart.push(item);
        } else {
          cartId = cart[idx].cartId!;
        }

        const stateWithAdded = {
          ...state,
          carts: {
            ...state.carts,
            [brandId]: [...cart],
          },
          quantities: {
            ...state.quantities,
            [cartId]: quantity,
          },
          showRecentItem: true, 
          recentItem: item
        };
        handleStorage(stateWithAdded);
        return stateWithAdded;


      case 'REMOVE_FROM_CART':
        cart.splice(idx, 1);
        const stateWithRemoved: CartStore = {
          ...state,
          showRecentItem: false,
          recentItem: null,
          carts: {
            ...state.carts,
            [brandId]: [...cart],
          },
        };
        if (!cart.length) {
          delete stateWithRemoved.carts[brandId];
        }
        delete stateWithRemoved.quantities[item.cartId];
        handleStorage(stateWithRemoved);
        return stateWithRemoved;


      case 'UPDATE_ITEM':

        //get current cart
        const tempCart = [...state.carts[brandId]];


        tempCart[idx] = item;

        const stateWithUpdated = {
          ...state,
          carts: {
            ...state.carts,
            [brandId]: tempCart,
          },
          quantities: {
            ...state.quantities,
            //Note: cartId is really: idOfItemInsideACart
            [item.cartId]: quantity,
          },
        };

        handleStorage(stateWithUpdated);
        return stateWithUpdated;


      case 'CLEAR_CARTS':
        if (!brands) {
          handleStorage({ carts: {}, quantities: {} });
          return {
            ...state,
            carts: {},
            quantities: {},
          };
        } else {
          const filteredCarts = { ...state.carts };
          const filteredQuantities = { ...state.quantities };
          brands.forEach((brand: string) => {
            filteredCarts[brand] &&
              filteredCarts[brand].forEach((item) => {
                delete filteredQuantities[item.cartId!];
              });
            delete filteredCarts[brand];
          });
          return {
            ...state,
            carts: filteredCarts,
            quantities: filteredQuantities,
          };
        }


      case 'TOGGLE_CART':
        const { newVal } = action.payload;
        return { ...state, showCart: newVal };


      case 'TOGGLE_RECENT_ITEM':
        const { newValue } = action.payload;
        return { ...state, showRecentItem: newValue };

      default:
        return state;
    }
  }
  return state;
}
