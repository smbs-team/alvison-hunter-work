import { Control } from 'react-hook-form';
import { orderSearchFormFields } from './orderSearchFormFields';
import { FormFragmentTemplate } from '../../..';

interface IOrderSearchForm {
  control: Control<any>;
}

export const OrderSearchForm = ({ control }: IOrderSearchForm) => {
  return <FormFragmentTemplate control={control} fields={orderSearchFormFields} />;
};
