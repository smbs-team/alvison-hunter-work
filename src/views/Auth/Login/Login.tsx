import { useHistory, Link } from 'react-router-dom';
import { Store, ILoginForm } from '../../../interfaces';
import { useEffect } from 'react';
import { useActions } from '../../../hooks';
import { useSelector } from 'react-redux';
import { flattenStore } from '../../../utils';
import * as rawActions from '../../../store/actions';
import {
  PhoneField,
  PasswordForm,
  FormViewTemplate,
} from '../../../components';

interface PassedState {
  referrer?: string;
}
/**
 * A component for the login view.
 */
export const Login = () => {
  const { selectedAddress } = useSelector((store: Store) =>
    flattenStore(store)
  );
  const { login } = useActions(rawActions);
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_pageview',
      page_title: 'login',
      page_url: window.location.pathname,
    });
  }, []);

  const history = useHistory();
  const passedState = history.location.state
    ? (history.location.state as PassedState)
    : null;
  const referrer =
    passedState && passedState.referrer !== '/signup'
      ? passedState.referrer
      : '/location';

  const onSubmit = async (form: ILoginForm) => {
    await login(
      form,
      history,
      referrer || (selectedAddress ? '/location' : '/')
    );
  };
  return (
    <FormViewTemplate
      submitFunc={onSubmit}
      title="Log in"
      subTitle={
        <span>
          Don’t have an account yet? <Link to="/signup">Sign up</Link>
        </span>
      }
      formFragments={[PhoneField, PasswordForm]}
      buttonText="Log In"
      footerLink={
        <span>
          Forgot password? <Link to="/passwords/request">Reset here</Link>
        </span>
      }
      defaultValues={{ phone: '', password: '' }}
    />
  );
};
