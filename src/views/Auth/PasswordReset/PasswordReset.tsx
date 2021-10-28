import { useParams, useHistory } from 'react-router-dom';
import { IPasswordForm } from '../../../interfaces';
import { FormViewTemplate, PasswordForm } from '../../../components';
import { useActions } from '../../../hooks';
import * as rawActions from '../../../store/actions';
import '../../../styles/sign-in-forms.scss';

interface ParamTypes {
  userId: string;
  token: string;
}
/**
 * A component for requesting password resets.
 */
export const PasswordReset = () => {
  const { resetPassword } = useActions(rawActions);
  const params = useParams<ParamTypes>();
  const history = useHistory();
  const onSubmit = async (form: IPasswordForm) => {
    await resetPassword(params.userId, params.token, form.password, history);
  };
  return (
    <FormViewTemplate
      submitFunc={onSubmit}
      title="Reset Password"
      subTitle="Your password will be changed."
      formFragments={[PasswordForm]}
      buttonText="Reset"
      defaultValues={{ password: '' }}
    />
  );
};
