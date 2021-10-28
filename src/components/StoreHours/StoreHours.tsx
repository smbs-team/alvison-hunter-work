import { useState } from 'react';
import { translateStoreHours } from '../../utils/translateStoreHours';
import { Brand } from '../../interfaces/menuInterfaces';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import './store-hours.scss';

interface StoreHoursProps {
  currentBrand: Brand;
  hideDetails?: boolean;
}

export const StoreHours = ({ currentBrand, hideDetails }: StoreHoursProps) => {
  const [showHours, toggleShowHours] = useState(false);
  return (
    <div className="hours-holder">
      {!showHours ? (

        <div>
          {/* More button */}
          <div className="space-bt">
            <div role="button" className="show-hours" onClick={() => toggleShowHours(!showHours)}>
              <div> { `More`}</div>
            </div>
          </div>
        </div>
      ) : (
        //  Popover
        <div className="hours-shown">

          {/* Title */}
          <div className="type bold hours-top">
            <CloseIcon className="cursor-pointer" onClick={() => toggleShowHours(!showHours)} />
            <span className="drawer-title">Store Hours</span>
          </div>

          {/* Content (hours list) */}
          <div className="drawer">
            {currentBrand.hoursOfOperation ? (
              translateStoreHours(
                currentBrand.hoursOfOperation.opening_hours
              ).map(({ day, dayString }, idx) => (
                <div key={idx}>
                  <span className="type s14 bold day">{day}</span>
                  <span className="type s16">{dayString || 'Closed'}</span>
                </div>
              ))
            ) : (
              <div className="type s14 bold">Not Available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
