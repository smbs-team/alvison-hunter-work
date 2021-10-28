import { Control } from 'react-hook-form';
import { userFormFields } from './userFormFields';
import { FormFragmentTemplate } from '../../..';

interface IUserForm {
  control: Control<any>;
}

export const UserForm = ({ control }: IUserForm) => {
  return <FormFragmentTemplate control={control} fields={userFormFields} />;
};
