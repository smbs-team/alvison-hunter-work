import { Control } from 'react-hook-form';
import { smsFormFields } from './smsFormFields';
import { FormFragmentTemplate } from '../../..';

interface ISMSFieldProps {
  control: Control<any>;
}

export const SMSField = ({ control }: ISMSFieldProps) => {
  return <FormFragmentTemplate control={control} fields={smsFormFields} />;
};
