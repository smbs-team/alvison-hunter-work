import { User } from '../interfaces';

const { REACT_APP_FORCE_ALPACA } = process?.env;

export function createCheckoutFormDefaults(user?: User | null) {
  const isAlpaca =
    window.location.href.indexOf(`alpaca.getreef.com`) > -1 ||
    window.location.href.indexOf(`alpaca-stg.getreef.com`) > -1 ||
    REACT_APP_FORCE_ALPACA;
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    tip: 0,
    marketing: user?.marketing || false,
    smsOptIn: user?.smsOptIn || false,
    isAlpaca,
    floor: '',
    unit: '',
    additionalNotes: 'Desk',
    line2: '',
    orderNote: '',
    isGuestUser: !user,
  };
}
