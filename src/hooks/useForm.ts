import { useState } from 'react';
import { FieldObject, FormObject } from '../interfaces/formInterfaces';

export type UseFormProps = [FormObject, (key: string, val: string) => void];

/**
 *
 * A hook for handling the state of the custom form component.
 */
export function useForm(fields: FieldObject[]): UseFormProps {
  const formObj: FormObject = {};
  for (let field of fields) {
    formObj[field.name] = field.initialValue ? field.initialValue : '';
  }
  const [form, updateState] = useState(formObj);
  const updateField = (key: string, val: string) => {
    updateState({ ...form, [key]: val });
  };
  return [form, updateField];
}
