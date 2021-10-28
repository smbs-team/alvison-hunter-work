import { IAlpacaLocation } from '../interfaces';
import { ALPACA_NO_TIP_LOCATIONS } from '../constants/alpaca-tip-locations';

export const getFlattenedAlpaca = () => Object.values(ALPACA_NO_TIP_LOCATIONS)
  .reduce<IAlpacaLocation[]>((acc, citySection) => {
    return acc.concat(Object.values(citySection) as IAlpacaLocation[]);
  }, []);
