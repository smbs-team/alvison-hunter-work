import { StarRate } from '@material-ui/icons';
import { PaymentStore, Card, Action } from '../../interfaces';

const initialState: PaymentStore = {
  cards: [],
  selectedCard: null,
  promo: null,
  showAddPaymentModal: false
};
/**
 *
 * @param state
 * @param action
 * @returns
 * Reducer for the payment state.
 */
export default function paymentReducer(state = initialState, action: Action) {
  const card = action.payload && action.payload.card;
  switch (action.type) {
    case 'FETCH_CARDS':
      const { cards } = action.payload;
      const currentDefaultCardIdx = cards.findIndex((card: { defaultCard: boolean; }) => card.defaultCard === true )
      let initialIdx = 0;
      if (currentDefaultCardIdx > -1) {
        initialIdx = currentDefaultCardIdx
      }
      return {
        ...state,
        cards: cards,
        selectedCard: cards[0] ? cards[initialIdx] : null,
      };
    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.payload.card],
        selectedCard: action.payload.card,
      };
    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: card,
      };
    case 'DELETE_CARD':
      const idx = state.cards.findIndex(
        (card: Card) => card.id === action.payload.id
      );
      const copy = [...state.cards];
      copy.splice(idx, 1);
      return {
        ...state,
        cards: copy,
      };
    case 'SET_PROMO':
      const { promo } = action.payload;
      return {
        ...state,
        promo,
      };
    case 'CLEAR_PAYMENTS':
      return { ...initialState, promo: state.promo };
    case 'TOGGLE_ADD_PAYMENT_MODAL':
      const { newVal } = action.payload
      return { ...state, showAddPaymentModal: newVal };
    default:
      return state;
  }
}
