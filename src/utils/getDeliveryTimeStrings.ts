import { DateTime } from 'luxon';
/**
 * 
 * @param deliveryTime 
 * @returns 
 * Gets a human-readable string from the deliveryTime object that is used in a number
 * of different places to display the delivery time a user has selected.
 */
export function getDeliveryTimeStrings(deliveryTime: string | DateTime | null) {
  if (!deliveryTime || deliveryTime === 'ASAP') {
    return { short: 'ASAP', long: 'ASAP' };
  }
  if (typeof deliveryTime === 'string') {
    deliveryTime = DateTime.fromISO(deliveryTime, { setZone: true });
  }
  const today = DateTime.fromObject({ zone: deliveryTime.zone });
  const isToday = deliveryTime.day === today.day 
    && deliveryTime.month === today.month;
  const start = isToday ? 'Today' : deliveryTime.toFormat('M/d');
  const end = deliveryTime.toLocaleString(DateTime.TIME_SIMPLE);
  return {
    short: start,
    long: `${start} by ${end}`,
  }
}
