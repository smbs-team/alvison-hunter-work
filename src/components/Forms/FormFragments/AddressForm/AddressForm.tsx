import { Control } from 'react-hook-form';
import { addressFormFields } from './addressFormFields';
import { FormFragmentTemplate } from '../../..';

interface IAddressForm {
  control: Control<any>;
}

export const AddressForm = ({ control }: IAddressForm) => {
  return <FormFragmentTemplate control={control} fields={addressFormFields} />;
};
