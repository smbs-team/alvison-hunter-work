import { useMemo } from 'react';
import { useActions, useAddressSearchQueries } from '../../../../hooks';
import { useSelector } from 'react-redux';
import { 
  flattenStore, 
  getDeliveryMessageText,  
} from '../../../../utils';
import { Store } from '../../../../interfaces';
import { ExpandIcon } from '../../../../assets/icons';
import * as rawActions from '../../../../store/actions';

const AddressSelect = () => {

  const { queryChecked } =
    useAddressSearchQueries();

  const {
    orderType,
    searchResults,
    searchLoaded,
    selectedAddress,
  } = useSelector((store: Store) => flattenStore(store));

  const {toggleAddressEntry} =
    useActions(rawActions);

  const deliveryMessage = useMemo(
    () =>
      (selectedAddress || searchResults) &&
      getDeliveryMessageText(orderType, selectedAddress, searchResults),
    [orderType, selectedAddress, searchResults]
  );

  const { orderTypeText, addressPreposition, shortAddress } =
    deliveryMessage || {};

  return (
    <div>
        {queryChecked ? (
          <div
            className={` ${
              orderType === 'pickup' 
              ? 'flex justify-center'
              : ''
              }
              flex justify-center lg:flex-col lg:items-end sm:text-sm lg:text-base text-xs font-sofia`
            }
            onClick={() =>
              searchLoaded && toggleAddressEntry(true)
            }
          >
            {searchLoaded ? (
              searchResults ? (
                <span className="font-sofia">
                  <span className="font-bold">{orderTypeText}</span> {addressPreposition}{' '}
                  <span className="cursor-pointer font-bold">
                    {shortAddress}
                    ... <ExpandIcon />
                  </span>
                </span>
              ) : (
                'Click to Enter Address.'
              )
            ) : (
              <div className={`
                ${orderType === 'delivery' 
                  ? 'delivery '
                  :'pickup'
                }
                loading`
              }>
                Finding location...
              </div>
            )}
          </div>
        ):(
          <div className="lg:flex lg:justify-center lg:flex-col lg:items-end" />
        )}
    </div >
  );
};

export default AddressSelect;
