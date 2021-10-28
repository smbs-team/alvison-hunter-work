import { History } from 'history';
import { Button } from '@material-ui/core';

const titleMap: { [key: string]: string } = {
  'Invalid credentials': 'Invalid login or password',
  'Existing account': 'That number’s taken',
  'Order group creation failed': 'Whoops, something’s not right',
  'Not Authorized': 'Authorization required',
  Unauthorized: 'Authorization required',
  'Delivery is not available from this location.': 'Pickup only',
  'Invalid orderId': 'Invalid Order Number',
  'Order not found': 'Invalid Order Number',
  'Order group not found.': 'Invalid Order Number',
  'Failed to fetch order groups': 'Invalid Order Number',
  'Order Confirmed: Your order went through, but order tracking is currently unavailable.':
    'Tracking not yet available',
  'Card not found': 'Card not found',
  'Error charging with stripe': 'Card declined',
  'Error capturing charge': 'Charge not found',
  'Account previously created': 'Existing Account',
};
const fullMessageMap: { [key: string]: string } = {
  'Invalid credentials': '',
  'Existing account': 'If you already have an account, please log in.',
  'Order group creation failed':
    'We’re unable to complete this request. You can try again now or come back later.',
  'Not Authorized':
    'Oops, looks like you don’t have authorization to view this page.',
  Unauthorized:
    'Oops, looks like you don’t have authorization to view this page.',
  'Delivery is not available from this location.':
    'This location isn’t offering delivery. You can either order for pickup, or choose a different restaurant.',
  'Invalid orderId':
    'Hmmm, we can’t find that order. Double check the order ID or try again in a few minutes.',
  'Order not found':
    'Hmmm, we can’t find that order. Double check the order ID or try again in a few minutes.',
  'Order group not found':
    'Hmmm, we can’t find that order. Double check the order ID or try again in a few minutes.',
  'Failed to fetch order groups':
    'Hmmm, we can’t find that order. Double check the order ID or try again in a few minutes.',
  'Order Confirmed: Your order went through, but order tracking is currently unavailable.':
    'Your order is confirmed but we’re still working on a tracking number.',
  'Card not found':
    'We can’t locate that card. Double check those details and try again.',
  'Error charging with stripe':
    'Confirm the card number, expiration date, CVC code, and billing address are correct.',
  'Error capturing charge':
    'We can’t locate that charge. Double check those details and try again.',
  'Account previously created':
    'You have already signed up with this phone number. Please sign in now!',
};

const newPathMap: {
  [key: string]: { newPath: string; btnMessage: string; referrer?: string };
} = {
  'Account previously created': {
    newPath: '/login',
    btnMessage: 'Login Now',
    referrer: '/checkout',
  },
};

/**
 *
 * @param e
 * @returns
 * This function parses errors that are returned by requests to the payment service
 */
export function parseError(e: any, history?: History, closeModal?: () => void) {
  // This block will handle errors that are not thrown by axios or from http requests.
  if (!e.response || (e.response && !e.response.data)) {
    return [
      e.message ? fullMessageMap[e.message] : fullMessageMap[e] || e,
      'Whoops, something’s not right',
    ];
  }
  // This block will handle generic axios rejections
  if (e.response.data && !(e.type === 'stripe')) {
    if (
      e.response.data.error &&
      e.response.data.error.message ===
        'User validation failed: phone: Path `phone` is required.'
    ) {
      return [
        'Please add a phone number to update your profile.',
        'Phone number required',
      ];
    }
    const res: any[] = [
      fullMessageMap[e.response.data.message],
      titleMap[e.response.data.message] || 'Whoops, something’s not right ',
    ];
    if (newPathMap[e.response.data.message] && history && closeModal) {
      const { newPath, btnMessage, referrer } =
        newPathMap[e.response.data.message];
      // This can be used to inject custom button actions into the error modal.
      res.push(
        <Button
          size="large"
          className="w-32 h-12"
          variant="contained"
          color="primary"
          onClick={() => {
            closeModal();
            history.push(newPath, { referrer });
          }}
        >
          {btnMessage}
        </Button>
      );
    }
    return res;
  }
  // This block will handle stripe errors
  if (e.type === 'stripe') {
    const { error } = e.response.data;
    // Each type of stripe error will need to be handled individually
    if (error.code === 'card_declined') {
      return [
        'Confirm the card number, expiration date, CVC code, and billing address are correct.',
        'Card declined',
      ];
      // Or caught below to use the error message that they send through
    } else if (error.code === 'incorrect_cvc') {
      return ['Double check those 3 pesky digits', 'CVC invalid'];
    } else {
      return [
        error.raw.message,
        titleMap[error.raw.message as string] ||
          'Whoops, something’s not right ',
      ];
    }
  }
  return [
    'We’re unable to complete this request. You can try again now or come back later.',
    'Whoops, something’s not right',
  ];
}
