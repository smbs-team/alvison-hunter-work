import {
  User,
  Address,
  Carts,
  Quantities,
  SearchResults,
  Card,
  Promo,
  ICheckoutForm,
  Brand,
} from './';
import { History } from 'history';
import { DateTime } from 'luxon';

export interface OrderStore {
  currentOrder: Order | null;
  currentTracking: Tracking | null;
  orderGroups: OrderGroup[] | null;
  groupsFetched: boolean;
  currentGroup: OrderGroup | null;
  orderType: string;
  showDeliveryScheduler: boolean;
  deliveryTime: DateTime | string | null;
}
/**
 * The OrderGroup object in our database.
 */
export interface OrderGroup {
  chargeId: string;
  grandTotal: number;
  id: string;
  orders: Order[];
  subtotal: number;
  tax: number;
  tips: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  number: number;
  discountTotal: number;
}
/**
 * The order object in our database.
 */
export interface Order {
  brand: Brand;
  brandId?: string;
  chargeId: string;
  id: string;
  order: OrderLordOrder;
  orderLordId: string;
  totalCost: number;
  trackerHash: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  userId: string;
  status: string;
  number: number;
  refunds: Refund[];
}

export interface Refund {
  amount: number;
  reason: string;
}
/**
 * The object that is sent back by OrderLord after an order is placed.
 */
export interface OrderLordOrder {
  address: Address;
  brandId: string;
  brandName: string;
  chargeId: string;
  expectedDeliveryAt: string;
  note: string;
  type?: string;
  price: {
    deliveryFee: number;
    subTotal: number;
    grandTotal: number;
    actualGrandTotal: number;
    tips: number;
    taxAmount: number;
  };
  products: OrderItem[];
  timedOrder: '1' | '0';
  user: User;
  venue: { name: 'DSP Order' };
}
/**
 * Items as they are returned by OrderLord when orders are placed.
 */
export interface OrderItem {
  additions: OrderAddition[];
  name: string;
  orderingSystemId: string;
  priceTotal: number;
  priceUnit: number;
  quantity: number;
}

export interface OrderAddition {
  name: string;
  orderingSystemId: string;
  price: number;
  quantity: number;
}

/**
 * The object that is returned when requesting tracking from OrderLord.
 */
export interface Tracking {
  arrivalTime: string;
  customer: {
    lat: number;
    lng: number;
    name: string;
  };
  deliverDuration: string | null;
  driver: any;
  driverImage: string | null;
  error: string;
  estimatedTime: number | string;
  ordersBefore: number | string;
  position: {
    lat: number;
    lng: number;
  };
  ratingSubmitted: boolean;
  state: number;
  timedOrder: boolean;
  venue: { lat: number; lng: number; name: string };
}

export interface IAlpacaPayload {
  isAlpaca: boolean;
  placeId?: string;
  googleResponse?: any;
  extra: {
    floor?: string;
    unit?: string;
    photo?: string;
    additionalNotes?: string;
  };
  venueName: string;
  venueAddress: {
    street?: string;
    street_number?: string;
    city?: string;
    region?: string;
    zip?: string;
    lat: number;
    lng: number;
  };
}
export interface IAlpacaNoteState {
  floor?: string;
  unit?: string;
  additionalNotes?: string;
}

/**
 * An interface for the object that is given to the placeOrder function
 */
export interface IPlaceOrderData extends ICheckoutForm {
  carts: Carts;
  quantities: Quantities;
  address: Address;
  history: History;
  searchResults: SearchResults;
  user: User;
  tip: number;
  orderType: string;
  marketing: boolean;
  smsOptIn: boolean;
  selectedCard?: Card;
  note?: string;
  setLoading?: (val: boolean) => void;
  promo?: Promo | null;
  alpacaData?: IAlpacaPayload;
  subTotal: number;
  deliveryTime?: string | DateTime | null;
}
