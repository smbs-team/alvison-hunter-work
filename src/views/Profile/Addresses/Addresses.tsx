import { useHistory } from 'react-router-dom';
import {
  ProfileTop,
  Address,
  FormViewTemplate,
  AddressForm,
} from '../../../components';
import { useEffect, useState } from 'react';
import { RealEstate } from '../../../assets/icons';
import { useSelector } from 'react-redux';
import { flattenStore } from '../../../utils';
import { useActions } from '../../../hooks';
import * as rawActions from '../../../store/actions';
import { Store, Address as IAddress } from '../../../interfaces';
import '../../../styles/address.scss';

export interface EditorState {
  currentEditing: IAddress | null;
  showEditor: boolean;
}

/**
 *
 * @param param0
 * A component for the address list view.
 */
export const Addresses = () => {
  const { user } = useSelector((store: Store) => flattenStore(store));
  const { updateAddress, deleteAddress } = useActions(rawActions);
  const history = useHistory();
  const [{ showEditor, currentEditing }, setEditorState] =
    useState<EditorState>({
      showEditor: false,
      currentEditing: null,
    });
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_pageview',
      page_title: 'profile:addresses',
      page_url: window.location.pathname,
    });
  }, []);
  const onSubmit = async (address: IAddress) => {
    updateAddress({ ...address, id: currentEditing!.id });
    setEditorState({
      showEditor: false,
      currentEditing: null,
    });
  };
  return (
    <div className="address-view">
      <ProfileTop
        onBack={() =>
          !showEditor
            ? history.goBack()
            : setEditorState({
                showEditor: false,
                currentEditing: null,
              })
        }
        hasNew={true}
        onNew={() => history.push('/profile/addresses/new')}
        topText={'Addresses'}
        newText={'Add new'}
      />
      {!showEditor && !currentEditing ? (
        <div>
          {user?.addresses!.length === 0 && (
            <div className="addresses-center">
              <RealEstate />
              <br />
              <div className="type s16 addresses-msg">No saved addresses</div>
            </div>
          )}
          <div className="address-list">
            {user?.addresses!.map((addy, idx) => (
              <Address
                key={idx}
                address={addy}
                onEdit={() =>
                  setEditorState({
                    showEditor: true,
                    currentEditing: addy,
                  })
                }
                onDelete={() => deleteAddress(addy.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {currentEditing && <FormViewTemplate
            submitFunc={onSubmit}
            formFragments={[AddressForm]}
            buttonText="Update"
            defaultValues={currentEditing}
            noPaddingTop
          />}
        </>
      )}
    </div>
  );
};
