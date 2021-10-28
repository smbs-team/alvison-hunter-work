import { Modal, Button } from '@material-ui/core';
import { Store } from '../../../interfaces';
import {
  useActions,
  useDeliveryTimeExpirationHandling,
  useLocalDeliverySlotHandling,
} from '../../../hooks';
import { useSelector } from 'react-redux';
import * as rawActions from '../../../store/actions';
import { DateTime } from 'luxon';
import { flattenStore, getFlattenedWeWorks } from '../../../utils';
import { styles } from '../../../styles/sharedTailwindClasses';
import {
  ModalHeader,
  ToggleSelector,
  WeekdaySelector,
  SlotSelector,
} from '../..';
import './delivery-scheduler.scss';

const { horizCenter, vertCenter } = styles;
/**
 *
 * @returns
 * A component for the WeWork timeslot scheduling feature. It appears in a material ui
 * modal.
 */
export const DeliveryScheduler = () => {
  const { showDeliveryScheduler, selectedAddress, deliveryTime } = useSelector(
    (store: Store) => flattenStore(store)
  );
  const { setDeliveryTime, toggleDeliveryScheduler } = useActions(rawActions);

  // This hook handles all of the local state behavior for this component. Please see
  // the file for descriptions of each behavior that it has.
  const {
    setSelectedDay,
    selectedDay,
    setSelectedSlot,
    selectedSlot,
    setDeliveryType,
    deliveryType,
    slots,
  } = useLocalDeliverySlotHandling();

  // If a slot has not been selected or has expired, we need to show the modal
  // and get the user to select a new one. This hook handles that in relation to
  // the deliveryTime stored in redux
  useDeliveryTimeExpirationHandling({
    selectedAddress,
    deliveryTime,
    showDeliveryScheduler,
    toggleDeliveryScheduler,
    setDeliveryType,
  });

  // Remove items set locally when modal is closed
  function onDeliverySchedulerClose() {
    setSelectedDay(0);
    setSelectedSlot(-1);
    toggleDeliveryScheduler(false);
  }

  const currentWeWork = getFlattenedWeWorks().find(
    (location) => location.address1 === selectedAddress?.line1
  );
  const body = (
    <div className={`${horizCenter} h-full outline-none`}>
      <div className={`${horizCenter} delivery-scheduler`}>
        <div className={`${vertCenter} w-full`}>
          <div className="bg-white">
            <ModalHeader
              onClose={() => {
                onDeliverySchedulerClose();
                if (!deliveryTime) {
                  setDeliveryTime('ASAP');
                }
              }}
            />
            {currentWeWork?.enable_asap && (
              <ToggleSelector
                title={
                  <>
                    <b className="mr-2">Delivery time</b>
                    {deliveryType !== 'ASAP' &&
                      '*Please book at least 1 hr 30 minutes ahead of time'}
                  </>
                }
                tabs={['ASAP', 'Select time']}
                selectorFunc={setDeliveryType}
                selected={deliveryType}
              />
            )}
            {deliveryType !== 'ASAP' && slots && (
              <div className="px-2 pt-1">
                <WeekdaySelector
                  title="Select a day for delivery"
                  slots={slots}
                  selectedDayIdx={selectedDay}
                  setSelectedDayIdx={setSelectedDay}
                />
                <SlotSelector
                  options={slots[selectedDay]?.slots.map(
                    ({ blocked, object }) => ({
                      blocked,
                      content: object.toLocaleString(DateTime.TIME_SIMPLE),
                    })
                  )}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                />
              </div>
            )}
            <div className="h-6 p-2">
              <Button
                size="large"
                disabled={deliveryType !== 'ASAP' && selectedSlot < 0}
                className="h-6 w-full font-sofia text-lg"
                variant="contained"
                color="primary"
                onClick={() => {
                  setDeliveryTime(
                    (slots &&
                      slots[selectedDay]?.slots[selectedSlot]?.object) ||
                      'ASAP'
                  );
                  onDeliverySchedulerClose();
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal open={showDeliveryScheduler} onClose={onDeliverySchedulerClose}>
      {body}
    </Modal>
  );
};
