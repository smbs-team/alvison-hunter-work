import { OrderNotes } from '../../components';
import { DropPin, Time } from '../../assets/icons';
import '../../styles/checkout.scss';
import { Brand, Store } from '../../interfaces';
import { flattenStore, getDeliveryTimeStrings } from '../../utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFeatureFlag } from '../../hooks';

/**
 *
 * A component that displays the users pickup or delivery address 
 * and subdomain specific order notes.  
 * 
 */

 export interface LocationSummaryProps {
   currentBrandObj: Brand | undefined;
   formControls: any;
}

export const LocationSummary= ({ currentBrandObj, formControls}: LocationSummaryProps) => {

  const { isEnabled: slotBasedOrderSchedulerEnabled } =
  useFeatureFlag('slotBasedOrderScheduler');
  
  const {
    selectedAddress,
    orderType,
    deliveryTime,
    user
  } = useSelector((store: Store) => flattenStore(store));

  const deliveryTimeStrings = useMemo(() => 
  getDeliveryTimeStrings(deliveryTime)
  , [deliveryTime]); 

  const address = currentBrandObj?.location.address;

  return (
    <div className="section-body flex-grow flex flex-col text-sm">
      <div className="font-sofia text-content_black font-bold pb-2">
        <div className="flex">
          <div className="drop pt-0_5">
            <span className="pr-2"><DropPin /></span>
          </div>
          <div className="address">
            {orderType === 'takeaway' ? (
            <div>
            {address?.split(',')[0]} <br />
            {`${address?.split(',')[1]}, ${address?.split(',')[2]} ${address?.split(',')[3]}`}
              </div>
            ) : (
              <div>
                {`${selectedAddress?.line2 ? `${selectedAddress?.line1} ${selectedAddress?.line2}` : `${selectedAddress?.line1}`}`}<br />
                {`${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip} ${selectedAddress?.country}`}
              </div>
            )}
          </div>
        </div>
        {
          user &&
          <div className="font-sofia text-content_black font-bold pb-3 pt-2">
            <span className="pr-2 pt-0_5"><Time /></span>
            {deliveryTimeStrings.long}
          </div>
        }

      </div>
      
      <div className="font-sofia text-content_black">
      <OrderNotes {...formControls} orderType={orderType}/>
      
      {/* blocked by design but these fields might be needed later - pls adjust margins if used*/}

      {/* {!user?.marketing && (
        <MarketingField control={control} />
      )}
      {!user?.smsOptIn && (
        <SMSField control={control} />
      )} */}

      </div>
    </div>

  );
};
