import { Checkbox, FormControlLabel } from '@material-ui/core';
import { Dispatch, SetStateAction } from 'react';
import '../../styles/checkout.scss';

/**
 *
 * A component that displays order preferences.
 * 
 */

 export interface OrderPreferenceProps {
  cutlery: boolean;
  setCutlery: Dispatch<SetStateAction<boolean>>;
  contactlessDelivery: boolean;
  setContactlessDelivery: Dispatch<SetStateAction<boolean>>;
}

export const OrderPreferences= ({ cutlery, setCutlery, contactlessDelivery, setContactlessDelivery}: OrderPreferenceProps) => {
  
  return (
    <div className="section-body pl-1_5 pt-3 flex-grow flex flex-col text-sm">
      <FormControlLabel
        className="font-sofia"
        style={{display:'table'}}
        labelPlacement="end"
        control={
          <div style={{display:'table-cell'}} className="">
            <Checkbox
              style ={{
                color: "green_select",
                width: '0px',
              }}
              checked={cutlery}
              onChange={() => setCutlery(!cutlery)}
            />
          </div>
        }
        label={
          <div className="pl-2">
            <strong>I don't want cutlery</strong><br />
            Opt out of cutlery, to reduce waste and save the world!
          </div>
        }
        />
        <FormControlLabel
          className="font-sofia"
          style={{display:'table'}}
          labelPlacement="end"
          control={
            <div style={{display:'table-cell'}}>
              <Checkbox
              style ={{
                color: "green_select",
                width: '0px' 
              }}
              checked={contactlessDelivery}
              onChange={() => setContactlessDelivery(!contactlessDelivery)}
              />
            </div>
          }
          label={
            <div className="pl-2_5">
              <strong>I don't want contactless delivery</strong><br />
              Stay safe (or just avoid people). We’ll leave your order at the door.
            </div>
          }
        />
    </div>
  );
};
