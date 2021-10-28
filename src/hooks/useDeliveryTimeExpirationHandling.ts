import { 
  useEffect, 
  useRef 
} from 'react';
import { Address } from '../interfaces';
import { DateTime } from 'luxon';
import { 
  getWeWorkTimeZone, 
  isSlotBlocked,
  getFlattenedWeWorks, 
} from '../utils';
/**
 * 
 * @param param0 ]
 * @returns 
 * If a slot has not been selected or has expired, we need to show the modal
 * and get the user to select a new one. This hook should handle all this
 * behavior
 */
export function useDeliveryTimeExpirationHandling({
  selectedAddress,
  deliveryTime,
  showDeliveryScheduler,
  toggleDeliveryScheduler,
  setDeliveryType,
}: {
  selectedAddress: Address | null;
  deliveryTime: DateTime | string | null;
  showDeliveryScheduler: boolean;
  toggleDeliveryScheduler: (newVal: boolean) => void;
  setDeliveryType: React.Dispatch<React.SetStateAction<string>>;
}) {
  // Use a ref for the interval 
  const interval = useRef<null | NodeJS.Timer>(null);

  useEffect(() => {
    function _checkTimeslots() {
      const currentWeWork = getFlattenedWeWorks().find(
        (location) => location.address1 === selectedAddress?.line1
      );
      const blockAsapOrders = 
        (!currentWeWork?.enable_asap && (!deliveryTime || deliveryTime === 'ASAP')); 
      if (selectedAddress && !showDeliveryScheduler) {
        const tz = getWeWorkTimeZone(selectedAddress);
        if (
          !deliveryTime || blockAsapOrders || 
          (deliveryTime !== 'ASAP' &&
            isSlotBlocked(tz, deliveryTime as DateTime))
        ) {
          toggleDeliveryScheduler(true);
          setDeliveryType('Select time');
          if(interval.current) {
            clearInterval(interval.current);
          }
        }
      }
    }
    // Starts the interval that checks for changes in timeslot validity
    function _initInterval() {
      if (interval.current) {
        // Clear the old interval that will be associated with the old 
        // selectedAddress + deliveryTime
        clearInterval(interval.current);
      }
      _checkTimeslots();
      // Recheck at an interval in case slots expire while looking at the page
      interval.current = setInterval(() => {
        _checkTimeslots();
      }, 30 * 1000);
    }
    // If the selectedAddress or deliveryTime changes, we need to re-initialize
    // the interval
    if (selectedAddress || deliveryTime) {
      _initInterval();
    }
  }, [
    selectedAddress, 
    setDeliveryType,
    deliveryTime, 
    showDeliveryScheduler, 
    toggleDeliveryScheduler
  ]);
}
