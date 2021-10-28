import { useState, FC, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
} from "@material-ui/core";
import CustomDialogTitle from "../../UI/DialogTitle/DialogTitle";
import { SearchAddress } from "../../SearchAddress/SearchAddress";
import { useSelector } from "react-redux";
import { useActions, useFeatureFlag } from "../../../hooks";
import { useHistory } from "react-router";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { ReactComponent as LocationIcon } from "../../../assets/icons/location.svg";
import { ReactComponent as ArrowBackIcon } from "../../../assets/icons/arrow_back.svg";
import { flattenStore } from "../../../utils";
import { Address, Store } from "../../../interfaces";
import * as rawActions from "../../../store/actions";
import "./address-entry-modal.scss";

interface IAddressEntryModal {
  isOpen: boolean;
}

const AddressEntryModal: FC<IAddressEntryModal> = ({ isOpen }) => {
  const history = useHistory();

  const { orderType, searchLoaded, selectedAddress, user } = useSelector(
    (store: Store) => flattenStore(store)
  );
  const { locationSearch, selectAddress, setOrderType, toggleAddressEntry } =
    useActions(rawActions);

  const [step, setStep] = useState<number>(1);
  const [newOrderType, setNewOrderType] = useState<string>(orderType);
  const [newAddress, setNewAddress] = useState<Address | null>(null);
  // const [previousAddress, setPreviousAddress] = useState<string | null>(null);

  // const handlePreviousAddress = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const valueSelected = (event.target as HTMLInputElement).value;
  //   setPreviousAddress(valueSelected);

  //   const oldAddress = user?.addresses.find(
  //     (el) => el.placeId === valueSelected
  //   );
  //   if (oldAddress) {
  //     setNewAddress(oldAddress as Address);
  //   }

  //   setStep((step) => (step += 1));
  // };

  const { isEnabled: isSlotSchedulerEnabled } = useFeatureFlag(
    "slotBasedOrderScheduler"
  );

  const handleClose = () => toggleAddressEntry(false);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setNewOrderType(newValue);
  };

  return (
    <Dialog
      fullWidth
      TransitionProps={{
        onExit: () => {
          setStep(1);
          setNewAddress(null);
          setNewOrderType(orderType);
          // setPreviousAddress(null);
        },
      }}
      maxWidth="xs"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <CustomDialogTitle
        leftButton={
          step !== 1 && (
            <IconButton
              onClick={() => {
                if (step === 3) {
                  setNewAddress(null);
                  // setPreviousAddress(null);
                }
                setStep((step) => (step -= 1));
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )
        }
        onClose={handleClose}
      >
        Edit details
      </CustomDialogTitle>

      <DialogContent dividers className="dialog-content">
        {!isSlotSchedulerEnabled && step === 1 && (
          <>
            <Tabs
              value={newOrderType}
              centered
              TabIndicatorProps={{
                className: "hidden",
              }}
              className={
                "min-h-0 p-0.5 mb-1 border border-solid border-grey_border_dark"
              }
              variant="fullWidth"
              onChange={handleChange}
              aria-label="delivery/pickup tabs"
            >
              <Tab
                classes={{
                  root: "p-0 min-h-0 h-5 font-sofia text-base",
                  selected: "bg-secondary text-white",
                }}
                label="Delivery"
                value="delivery"
              />
              <Tab
                classes={{
                  root: "p-0 min-h-0 h-5 font-sofia text-base",
                  selected: "bg-secondary text-white",
                }}
                label="Pickup"
                value="takeaway"
              />
            </Tabs>
            <Divider className="mb-2" />
          </>
        )}

        {/* the user just opened the modal */}
        {step === 1 && (
          <>
            {/* control if the user is editing the address */}
            <div className="flex justify-between items-center mb-1">
              <Typography variant="body1" className="font-bold">
                Search
              </Typography>
              <Button
                onClick={() => setStep(2)}
                className="underline text-base"
                variant="text"
              >
                Edit
              </Button>
            </div>

            <div className="mb-4">
              <Typography variant="h6">{`${selectedAddress?.line1}, ${
                selectedAddress?.line2 || ""
              }`}</Typography>
              <Typography variant="h6">
                {`${selectedAddress?.city}, ${selectedAddress?.state}`}
              </Typography>
            </div>
          </>
        )}

        {/* the user clicked on edit address */}
        {step === 2 && (
          <div className="mb-2">
            <SearchAddress
              onComplete={(address) => {
                setNewAddress(address);
                setStep((step) => (step += 1));
              }}
              onFail={() => toggleAddressEntry(false)}
            />

            {/* <Divider className="my-2" />

            <FormControl component="fieldset">
              <Typography component="legend" className="font-bold">
                Previous Addresses
              </Typography>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={previousAddress}
                onChange={handlePreviousAddress}
              >
                {user?.addresses.map((address) => {
                  return (
                    <FormControlLabel
                      key={address.id}
                      value={address.placeId}
                      control={<Radio />}
                      label={
                        address.line1 +
                        ", " +
                        address.city +
                        ", " +
                        address.state
                      }
                    />
                  );
                })}
              </RadioGroup>
            </FormControl> */}
          </div>
        )}

        {/* the user is adding details to the addres, apt number and delivery instructions */}
        {step === 3 && (
          <div>
            <div className="flex justify-start items-center mb-3">
              <LocationIcon className="mr-2" />
              <Typography>
                {`${newAddress?.line1}, ${newAddress?.city}, ${newAddress?.state}`}
              </Typography>
            </div>
            <TextField
              fullWidth
              className="mb-2"
              variant="outlined"
              label="Apartment/Suite/Floor"
              value={newAddress?.line2}
              onChange={(e) => {
                let tmpAddress = {
                  ...newAddress,
                  line2: e.target.value,
                };
                setNewAddress(tmpAddress as Address);
              }}
            />
            <TextField
              fullWidth
              value={newAddress?.deliveryInstructions}
              onChange={(e) => {
                let tmpAddress = {
                  ...newAddress,
                  deliveryInstructions: e.target.value,
                };
                setNewAddress(tmpAddress as Address);
              }}
              className="mb-4"
              multiline
              minRows={5}
              maxRows={6}
              variant="outlined"
              label="Delivery instructions"
            />
          </div>
        )}

        {(step === 1 || step === 3) && (
          <Button
            fullWidth
            className="h-12"
            variant="contained"
            color="primary"
            disabled={!newAddress && newOrderType === orderType}
            onClick={() => {
              toggleAddressEntry(false);
              locationSearch(
                newAddress || selectedAddress,
                newOrderType,
                history,
                undefined,
                (resetVals: boolean) => {
                  if (resetVals) {
                    selectAddress(newAddress!);
                    setOrderType(newOrderType)
                    setNewAddress(null);
                  }
                }
              );
            }}
          >
            {!searchLoaded ? <CircularProgress size={24} /> : "Done"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressEntryModal;
