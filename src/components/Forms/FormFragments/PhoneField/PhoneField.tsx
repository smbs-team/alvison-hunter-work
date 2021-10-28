import { Control } from 'react-hook-form';
import { phoneFormFields } from './phoneFormField';
import { FormFragmentTemplate } from '../../..';

interface IPhoneFieldProps {
  control: Control<any>;
}

export const PhoneField = ({ control }: IPhoneFieldProps) => {
  return <FormFragmentTemplate control={control} fields={phoneFormFields} />;
};
