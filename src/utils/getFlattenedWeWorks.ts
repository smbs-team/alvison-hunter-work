import { IWeWorkLocation } from '../interfaces';
import { WEWORK_LOCATIONS } from '../constants/wework-locations';

export const getFlattenedWeWorks = () => Object.values(WEWORK_LOCATIONS)
  .reduce<IWeWorkLocation[]>((acc, citySection) => {
    return acc.concat(Object.values(citySection) as IWeWorkLocation[]);
  }, []);
