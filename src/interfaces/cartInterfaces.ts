import { MenuItem } from './menuInterfaces';
/**
 * Interface for what is stored in the cart state.
 */
export interface CartStore {
  carts: Carts;
  quantities: Quantities;
  showCart: boolean;
  showRecentItem: boolean;
  recentItem: MenuItem | null;
}
/**
 * An object for storing arrays of menuItems that are the carts for
 * each brandId.
 */
export interface Carts {
  [brandId: string]: MenuItem[];
}
/**
 * Interface for storing quantities of items. Each item is assigned a
 * cartId when it is added to carts so that other instances of the same item
 * can be added as unique items in them.
 */
export interface Quantities {
  [cartId: string]: number;
}

/**
 * Used to match Skus to quantities for displaying quantities above items on menu pages
 */
export interface SkuToQuantity {
  [sku: string]: number;
}
/**
 * An interface for the items in the cart. It currently only includes the props that we are
 * actually accessing
 */
export interface CartItem {
  orderingSystemId: string;
  additions: any[];
  name: string;
}
