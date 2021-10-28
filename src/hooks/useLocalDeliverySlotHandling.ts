import { useState, useMemo, useEffect } from 'react';
import { Store } from '../interfaces';
import { useSelector } from 'react-redux';
import {
  getFirstAvailableSlot,
  getTimeslots,
  flattenStore,
  IDaysWithSlots,
} from '../utils';

/**
 *
 * @param param0
 * This hook handles the local state and all necessary behavior for the DeliveryScheduler modal
 */
export function useLocalDeliverySlotHandling() {
  const { showDeliveryScheduler, selectedAddress } = useSelector(
    (store: Store) => flattenStore(store)
  );
  const [slots, setSlots] = useState<IDaysWithSlots[] | null>(null);

  // If the selectedAddress is updated, get timeslots again
  useEffect(() => {
    if (selectedAddress) {
      setSlots(getTimeslots(selectedAddress));
    }
  }, [selectedAddress]);

  // This is set to the first available slot from the list of slots that
  // was calculated
  const [startDay, startSlot] = useMemo(
    () => (slots ? getFirstAvailableSlot(slots) : []),
    [slots]
  );
  const [selectedDay, setSelectedDay] = useState(startDay);
  const [deliveryType, setDeliveryType] = useState('Select time');
  const [selectedSlot, setSelectedSlot] = useState(startSlot);

  // Select first available slot
  useEffect(() => {
    if (showDeliveryScheduler && startDay) {
      setSelectedDay(startDay);
      setSelectedSlot(startSlot);
    }
  }, [showDeliveryScheduler, startDay, startSlot]);

  useEffect(() => {
    if (deliveryType === 'ASAP') {
      // If someone changes to ASAP, reset slot selection
      setSelectedDay(0);
    } else {
      // If they go back to scheduled time, set first available
      // slot again
      setSelectedDay(startDay);
      setSelectedSlot(startSlot);
    }
  }, [deliveryType, startDay, startSlot, setSelectedDay, setSelectedSlot]);

  // If the selected slot is blocked, unselect it
  useEffect(() => {
    if (slots && slots[selectedDay]?.slots[selectedSlot]?.blocked) {
      setSelectedSlot(-1);
    }
  }, [slots, selectedDay, selectedSlot]);

  return {
    setSelectedDay,
    selectedDay,
    setSelectedSlot,
    selectedSlot,
    setDeliveryType,
    deliveryType,
    slots,
  };
}
