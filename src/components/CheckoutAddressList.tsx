import { Store } from '../interfaces';
import { useSelector } from 'react-redux';
import { flattenStore } from '../utils';
import '../styles/address.scss';

/**
 * Component for allowing users to select from their added addresses
 * or store new ones
 */
export const AddressList = () => {
  const { selectedAddress } = useSelector((store: Store) =>
    flattenStore(store)
  );
  return selectedAddress ? (
    <div>
      <div className="checkout-address-list type s13">
        <div className="line-1">{selectedAddress.line1}</div>
        <div className="line-1">{selectedAddress.line2}</div>
        <div className="arrow-holder"></div>
      </div>
    </div>
  ) : null;
};
