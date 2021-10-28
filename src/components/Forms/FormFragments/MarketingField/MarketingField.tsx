import { Control } from 'react-hook-form';
import { marketingFormFields } from './marketingFormFields';
import { FormFragmentTemplate } from '../../..';

interface IMarketingFieldProps {
  control: Control<any>;
}

export const MarketingField = ({ control }: IMarketingFieldProps) => {
  return <FormFragmentTemplate control={control} fields={marketingFormFields} />;
};
