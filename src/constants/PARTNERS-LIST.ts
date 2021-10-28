interface PartnerObj {
  name: string;
  bgColor: string;
  logo?: string;
}

export const PARTNER_LIST: { [partnerName: string]: PartnerObj } = {
  /* This is commented out right now because we do not want to show a default banner
  default: {
    name: 'Get 40% off your first order with code GET40',
    bgColor: '#fed35f',
  },
  */
  fetch: { name: 'Fetch', bgColor: '#80A3FE', logo: 'fetch-icon.png' },
  // 'wework': {name: "WeWork", bgColor: '#bbb9b9', logo: 'WeWork.png'},
};
