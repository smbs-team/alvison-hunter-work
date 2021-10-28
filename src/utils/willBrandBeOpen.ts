import { Brand } from '../interfaces';
import { DateTime, Interval } from 'luxon';
/**
 * 
 * @param brand 
 * @param deliveryTime 
 * @returns 
 * Checks if a given brand object will be open at a particular deliveryTime timestamp.
 */
export function willBrandBeOpen(
  brand?: Brand | null,
  deliveryTime?: DateTime | string | null
) {
  if (!brand?.hoursOfOperation?.opening_hours) {
    return false;
  }
  const hours = brand.hoursOfOperation.opening_hours;
  // Return false if deliveryTime has not been set. Then the normal openCheck will be used
  if (deliveryTime === 'ASAP' || !deliveryTime) {
    return false;
  }
  if (typeof deliveryTime === 'string') {
    deliveryTime = DateTime.fromISO(deliveryTime, { setZone: true });
  }
  const prevDay = deliveryTime.minus({ days: 1 });
  const nextDay = deliveryTime.plus({ days: 1 });
  const intervals = [
    ...(hours[prevDay.weekdayLong.toLocaleLowerCase()] || []).map((interval) =>
      createLuxonInterval(interval, prevDay)
    ),
    ...(hours[deliveryTime.weekdayLong.toLocaleLowerCase()] || []).map((interval) =>
      createLuxonInterval(interval, deliveryTime as DateTime)
    ),
    ...(hours[nextDay.weekdayLong.toLocaleLowerCase()] || []).map((interval) =>
      createLuxonInterval(interval, nextDay)
    ),
  ];
  for (const interval of intervals) {
    if (interval.contains(deliveryTime)) {
      return true;
    }
  }
  return false;
}

interface OLInterval {
  start_time: string;
  end_time: string;
}

// Creates a usable luxon interval from what orderLord provides.
function createLuxonInterval(
  olInterval: OLInterval,
  fromDate: DateTime,
) {
  const endIsNextDay =
    parseInt(olInterval.end_time.split(':')[0], 10) <
    parseInt(olInterval.start_time.split(':')[0], 10);
  const start = fromDate
    .set({
      hour: parseInt(olInterval.start_time.split(':')[0], 10),
      minute: parseInt(olInterval.start_time.split(':')[1], 10),
    })
  let end = fromDate
    .set({
      hour: parseInt(olInterval.end_time.split(':')[0], 10),
      minute: parseInt(olInterval.end_time.split(':')[1], 10),
    })
  if (endIsNextDay) {
    end = end.plus({ days: 1 });
  }
  return Interval.fromDateTimes(start, end);
}
