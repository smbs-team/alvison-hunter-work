import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useActions } from '../../../hooks';
import * as rawActions from '../../../store/actions';
import { ISignupForm } from '../../../interfaces';
import {
  UserForm,
  MarketingField,
  SMSField,
  TermsAcceptedField,
  FormViewTemplate,
  SignupPasswordForm,
} from '../../../components';
import '../../../styles/sign-in-forms.scss';

interface PassedState {
  referrer?: string;
}
/**
 * A view that is a wrapper for the Signup form.
 */
export const Signup = () => {
  const { signup } = useActions(rawActions);
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_pageview',
      page_title: 'signup',
      page_url: window.location.pathname,
    });
  }, []);
  const history = useHistory();
  const passedState = history.location.state
    ? (history.location.state as PassedState)
    : null;
  const referrer = passedState && passedState.referrer;
  const onSubmit = async (form: ISignupForm) => {
    await signup(form, history, referrer);
  };
  return (
    <FormViewTemplate
      submitFunc={onSubmit}
      title="Sign up"
      subTitle={
        <span>
          Already have an account? <Link to="/login">Log in</Link>
        </span>
      }
      formFragments={[
        UserForm,
        SignupPasswordForm,
        TermsAcceptedField,
        MarketingField,
        SMSField,
      ]}
      buttonText="Sign up"
      defaultValues={{
        phone: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        marketing: false,
        smsOptIn: false,
        termsAccepted: false,
      }}
    />
  );
};
