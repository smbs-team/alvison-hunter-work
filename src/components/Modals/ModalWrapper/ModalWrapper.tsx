import { Modal } from "../../";
import { Button } from "@material-ui/core";
import { Store } from "../../../interfaces";
import { useEffect } from "react";
import { useActions, useFeatureFlag } from "../../../hooks";
import { useSelector } from "react-redux";
import { flattenStore } from "../../../utils";
import { DeliveryScheduler } from "../DeliveryScheduler/DeliveryScheduler";
import * as rawActions from "../../../store/actions";
import { AddressEntryModal } from "../../";

export interface ModalWrapProps {
  showModal: boolean;
  toggleModal: (val: boolean) => void;
  modalTitle?: string | null;
  modalText?: string | null;
  modalBtn?: any | null;
}
/**
 *
 * A generalized wrapper that is used for the alert modal that is used for
 * any types of modals that are outside of specific use cases. It is used
 * in App.tsx and should be accessible and usable anywhere that the redux
 * store is usable using the toggleModal action. It can also be use for
 * other modals that may need to be accessible globally.
 */
export const ModalWrapper = () => {
  const {
    showModal,
    modalText,
    modalBtn,
    modalTitle,
    showAddressEntry,
    deliveryTime,
  } = useSelector((store: Store) => flattenStore(store));
  const { toggleModal, setDeliveryTime } = useActions(rawActions);

  const {
    isEnabled: slotBasedOrderSchedulerEnabled,
    loading: loadingScheduler,
  } = useFeatureFlag("slotBasedOrderScheduler");
  // The following effect should only be necessary in development. It will remove any
  // set delivery time if the instance of the app currently being used is unable
  // to use the delivery scheduler feature.
  useEffect(() => {
    if (!slotBasedOrderSchedulerEnabled && !loadingScheduler) {
      setDeliveryTime("ASAP");
    }
  }, [
    slotBasedOrderSchedulerEnabled,
    deliveryTime,
    loadingScheduler,
    setDeliveryTime,
  ]);
  return showModal ? (
    <div>
      <Modal
        onClose={() => toggleModal(false)}
        content={
          <div>
            <div className="small-modal-title type s20 bold">
              {modalTitle || "Error"}
            </div>
            <div className="small-modal-text type s14">{modalText}</div>
            <div className="modal-btn-holder">
              {modalBtn ? (
                modalBtn
              ) : (
                <Button
                  size="large"
                  className="w-32 h-12"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    toggleModal(false);
                  }}
                >
                  Ok
                </Button>
              )}
            </div>
          </div>
        }
        type={"small-modal error-modal"}
      />
    </div>
  ) : (
    <>
      {<AddressEntryModal isOpen={showAddressEntry} />}
      {/* When the slot scheduler is enabled show it here. */}
      {slotBasedOrderSchedulerEnabled &&
        !loadingScheduler &&
        !window.location.href.includes("tracking") && <DeliveryScheduler />}
    </>
  );
};
