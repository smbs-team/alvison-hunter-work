import { getFlattenedWeWorks } from '.';
import { DateTime } from 'luxon';
import { Address } from '../interfaces';

export interface IDaysWithSlots {
  dayName: string;
  dayOfMonth: number;
  slots: { object: DateTime; blocked: boolean }[];
  blocked: boolean;
}

// Gets the indicies first available slot from the getTimeSlots function
export function getFirstAvailableSlot(slots: IDaysWithSlots[]) {
  for (let i = 0; i < slots.length; i++) {
    for (let j = 0; j < slots[i].slots.length; j++) {
      if (!slots[i].slots[j].blocked) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

// If a wework is already selected, we will use the associated timezone. Otherwise,
// we will just use the user's timezone.
export function getWeWorkTimeZone(selectedAddress: Address) {
  const currentWeWorkLocation = getFlattenedWeWorks().find(
    (location) => location.address1 === selectedAddress?.line1
  );
  return currentWeWorkLocation?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}
// Checks if a timeslot is still valid
export function isSlotBlocked(zone: string, slot: DateTime) {
  if (typeof slot === 'string') {
    slot = DateTime.fromISO(slot);
  }
  const now = DateTime.fromObject({ zone });
  return now.plus({ minutes: 90 }) > slot;
}
// Gets all time slots for the next 7 days
export function getTimeslots(selectedAddress: Address | null) {
  if (!selectedAddress) {
    return [] as IDaysWithSlots[];
  }
  const zone = getWeWorkTimeZone(selectedAddress);
  // Get a list of slot objects to be used for the next 7 days
  const daysInOrder: IDaysWithSlots[] = [];
  for (let i = 0; i <= 6; i++) {
    const slotDate = DateTime.fromObject({ zone }).plus({ days: i });
    const { weekdayShort, day } = slotDate;
    const daySlots = {
      dayName: i > 0 ? weekdayShort : 'Today',
      dayOfMonth: day,
      // For now, Saturday and Sunday must always be excluded for WeWork scheduling.
      // TODO: make a dynamic way for blocking out particular slots
      blocked: ['Sat', 'Sun'].includes(weekdayShort),
      slots: [
        { hour: 12, minute: 0 },
        { hour: 13, minute: 0 },
      ].map(({ hour, minute }) => {
        const object = slotDate.set({ minute, hour });
        const blocked =
          isSlotBlocked(zone, object) || ['Sat', 'Sun'].includes(weekdayShort);
        return {
          object,
          blocked,
        };
      }),
    };
    daysInOrder.push(daySlots);
  }
  return daysInOrder;
}
