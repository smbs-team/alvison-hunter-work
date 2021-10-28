import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormObject, Store, Address } from '../../../interfaces';
import {
  ProfileTop,
  SearchAddress,
  FormViewTemplate,
  AddressForm,
} from '../../../components';
import { useActions } from '../../../hooks';
import { useSelector } from 'react-redux';
import { flattenStore } from '../../../utils';
import * as rawActions from '../../../store/actions';
/**
 *
 * @param param0
 * @returns
 * A view for creating new addresses.
 */
export const NewAddress = () => {
  const { user } = useSelector((store: Store) => flattenStore(store));
  const userId = user?.id;
  const { newAddress } = useActions(rawActions);
  const history = useHistory();
  const [address, setNewAddress] = useState<FormObject | null>(null);
  const onSubmit = async (address: Address) => {
    newAddress({ ...address, userId, placeId: address.placeId });
    history.goBack();
  };
  return (
    <div>
      <ProfileTop onBack={() => history.goBack()} topText={'New Address'} />
      <div>
        {!address ? (
          <div className="flex justify-center mt-8 pt-4">
            <div className="w-72 xs:w-80 sm:w-96">
              <SearchAddress onComplete={(addy) => setNewAddress(addy)} />
            </div>
          </div>
        ) : (
          <FormViewTemplate
            submitFunc={onSubmit}
            formFragments={[AddressForm]}
            buttonText="Save"
            defaultValues={address}
            noPaddingTop
          />
        )}
      </div>
    </div>
  );
};
