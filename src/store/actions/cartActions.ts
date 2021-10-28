import { MenuItem, Brand, User, Address } from '../../interfaces';
import { toggleAddressEntry } from './';
import { Dispatch } from 'redux';
/**
 *
 * @param brandId
 * @param item
 * @param quantity
 * @returns
 * Adds a single item to a cart that corresponds to a particular brand object and
 * puts the item quantity into the quantities object. Each item is given a cartId so
 * that multiple instances of an item can exist in a cart unless the onePerCart option 
 * is used. When this option is used only one instance of an item can be in a cart at a 
 * time. This is currently only used for retail brands.
 */
export const addToCart =
  (
    item: MenuItem,
    quantity: number,
    user: User | null,
    selectedAddress: Address | null,
    orderType: string,
    brand: Brand,
    onePerCart?: boolean
  ) =>
  async (dispatch: Dispatch) => {
    if (selectedAddress?.presetAddressEntry) {
      return dispatch(toggleAddressEntry(true) as any);
    }
    let brandId = brand.id;
    dispatch({
      type: 'ADD_TO_CART',
      payload: { brandId, item, quantity, onePerCart },
    });
    let address = brand?.location?.address;
    if (orderType === 'delivery') {
      address = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
      if (!selectedAddress?.line2) {
        address = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
      }
    }
    let additions = [];
    let addPrice = 0;
    for (let key in item.modifiers) {
      let modGroup = item.modifiers[key];
      for (let key in modGroup) {
        let addition = {
          name: modGroup[key].name,
          price: modGroup[key].price,
        };
        additions.push(addition);
        addPrice = addPrice + modGroup[key].price;
      }
    }
    let user_id = user?.id;
    if (user?.id === undefined) {
      user_id = 'anonymous';
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'add_to_cart',
      date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
      userId: user_id,
      vessel: brand?.location?.name,
      ecommerce: {
        affiliation: orderType,
        currency: brand?.location?.currency || 'USD',
        address: address,
        items: [
          {
            item_id: item.guid,
            item_name: item.name,
            item_list_name: brand?.name,
            item_list_id: brandId,
            item_list_dir: brand?.location?.address,
            item_additions: additions,
            price: Number((item.price + addPrice).toFixed(2)),
            item_price: item.price,
            quantity: quantity,
          },
        ],
      },
    });
  };
/**
 *
 * @param brandId
 * @param item
 * @returns
 * Removes on item of a particular cartId from a cart of a brandId.
 */
export const removeFromCart =
  (
    brand: Brand,
    item: MenuItem,
    user: User | null,
    selectedAddress: Address | null,
    orderType: string
  ) =>
  (dispatch: Dispatch) => {
    let brandId = brand.id;
    dispatch({ type: 'REMOVE_FROM_CART', payload: { brandId, item } });
    let address = brand?.location?.address;
    if (orderType === 'delivery') {
      address = `${selectedAddress?.line1} ${selectedAddress?.line2}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
      if (!selectedAddress?.line2) {
        address = `${selectedAddress?.line1}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`;
      }
    }
    let additions = [];
    let addPrice = 0;
    for (let key in item.modifiers) {
      let modGroup = item.modifiers[key];
      for (let key in modGroup) {
        let addition = {
          name: modGroup[key].name,
          price: modGroup[key].price,
        };
        additions.push(addition);
        addPrice = addPrice + modGroup[key].price;
      }
    }
    let user_id = user?.id;
    if (user?.id === undefined) {
      user_id = 'anonymous';
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'remove_from_cart',
      date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
      userId: user_id,
      vessel: brand?.location?.name,
      ecommerce: {
        affiliation: orderType,
        currency: brand?.location?.currency || 'USD',
        address: address,
        items: [
          {
            item_id: item.guid,
            item_name: item.name,
            item_list_name: brand?.name,
            item_list_id: brand.id,
            item_list_dir: brand?.location?.address,
            item_additions: additions,
            price: Number((item.price + addPrice).toFixed(2)),
            item_price: item.price,
            quantity: 0,
          },
        ],
      },
    });
  };
/**
 *
 * @param brandId
 * @param item
 * @param quantity
 * @returns
 * Updates an item with a cartId in a cart of a brandId.
 */
export const updateItem =
  (brandId: string, item: MenuItem, quantity: number) =>
  (dispatch: Dispatch) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { brandId, item, quantity } });
  };
/**
 *
 * @returns
 * Clears all carts.
 */
export const clearCarts = (brands?: string[]) => async (dispatch: Dispatch) =>
  await dispatch({ type: 'CLEAR_CARTS', payload: { brands } });
/**
 *
 * @param newVal
 * @returns
 * Toggles the cart modal.
 */
export const toggleCart = (newVal: boolean) => (dispatch: Dispatch) =>
  dispatch({ type: 'TOGGLE_CART', payload: { newVal } });
/**
  *
  * @param newValue
  * @returns
  * Toggles the recent item modal.
*/
export const toggleRecentItem = (newValue: boolean) => (dispatch: Dispatch) =>
  dispatch({ type: 'TOGGLE_RECENT_ITEM', payload: { newValue } });


