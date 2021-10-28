import { Control } from 'react-hook-form';
import { passwordFormFields, signupPasswordFormFields } from './passwordFormFields';
import { FormFragmentTemplate } from '../../..';

interface IPasswordFormProps {
  control: Control<any>;
}

export const PasswordForm = ({ control }: IPasswordFormProps) => {
  return <FormFragmentTemplate control={control} fields={passwordFormFields} />;
};

export const SignupPasswordForm = ({ control }: IPasswordFormProps) => {
  return <FormFragmentTemplate control={control} fields={signupPasswordFormFields} />;
};