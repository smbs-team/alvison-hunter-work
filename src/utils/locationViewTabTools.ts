import { WEWORK_FAVORITES } from '../constants/wework-favorites';
import { Brand } from '../interfaces';

export function getTabs({
  isAddressSelectEnabled,
  showLightspeed,
  resultsLength,
}: {
  isAddressSelectEnabled?: boolean,
  showLightspeed?: boolean;
  resultsLength: number;
}) {
  const tabs = [];
  if (isAddressSelectEnabled) {
    tabs.push('WeWork');
  }
  if (showLightspeed) {
    tabs.push('10 min menu');
  }
  if ((resultsLength === 1 && !showLightspeed) || resultsLength > 1) {
    tabs.push('30 min menu');
  }
  return tabs;
}
export const filtersByTab: { [brandName: string]: (brand: Brand) => boolean } = {
  'WeWork': (brand: Brand) => WEWORK_FAVORITES.has(brand.name),
  '30 min menu': (brand: Brand) => !brand.name.match(/Light Speed/gi),
};
