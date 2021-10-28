import { Store } from '../../../interfaces';
import {
  ProfileTop,
  FormViewTemplate,
  UserForm,
} from '../../../components';
import { IUserForm } from '../../../interfaces';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { flattenStore } from '../../../utils';
import { useActions } from '../../../hooks/useActions';
import * as rawActions from '../../../store/actions';

/**
 * View for user account info editing. Does not currently have password update.
 */
export const AccountDetails = () => {
  const { user } = useSelector((store: Store) => flattenStore(store));
  const { update } = useActions(rawActions);
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_pageview',
      page_title: 'profile:accountDetails',
      page_url: window.location.pathname,
    });
  }, []);
  const history = useHistory();
  const onSubmit = async (form: IUserForm) => {
    update({ id: user?.id, ...form });
  };
  const { firstName, lastName, phone, email } = user || {};
  if (user) {
    return (
      <div>
        <ProfileTop
          onBack={() => history.goBack()}
          topText={'Account Details'}
        />
        <FormViewTemplate
          submitFunc={onSubmit}
          formFragments={[UserForm]}
          buttonText="Update"
          defaultValues={{ firstName, lastName, phone, email }}
          noPaddingTop
        />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};
