import {
  CardNumberElementComponent,
  CardExpiryElementComponent,
  CardCvcElementComponent,
} from '@stripe/react-stripe-js';
/**
 * An interface for a single payment card.
 */
export interface Card {
  userId: string;
  stripeId: string;
  expMonth: number;
  expYear: number;
  last4: string;
  type: string;
  id: string;
  defaultCard?: boolean; 
  source?: string;
}
/**
 * Interface for the paymentStore.
 */
export interface PaymentStore {
  cards: Card[];
  selectedCard: Card | null;
  promo: Promo | null;
  showAddPaymentModal: boolean;
}
/**
 * Interface for the Promo object
 */
export interface Promo {
  code: string;
  percentageOff?: number;
  amountOff?: number;
}

export interface PricesObj {
  currentCartSubTotal: number;
  currentCartGrandTotal: number;
  tips: number;
  tax: number;
  discounts: number;
}
/**
 * Type for stripe element components
 */
export type StripeElementComp =
  | CardNumberElementComponent
  | CardExpiryElementComponent
  | CardCvcElementComponent;
