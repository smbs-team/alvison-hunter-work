import { Control } from 'react-hook-form';
import { termsAcceptedFormFields } from './termsAcceptedFormFields';
import { FormFragmentTemplate } from '../../..';

interface ITermsAcceptedFieldProps {
  control: Control<any>;
}

export const TermsAcceptedField = ({ control }: ITermsAcceptedFieldProps) => {
  return <FormFragmentTemplate control={control} fields={termsAcceptedFormFields} />;
};
