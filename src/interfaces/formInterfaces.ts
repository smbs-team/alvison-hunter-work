import { ReactNode } from "react";
import { ModifierOption } from ".";
/**
 * The object that is fed into the Form component representing a single field.
 */
export interface FieldObject {
  name: string;
  type: string;
  placeholder: string;
  initialValue?: string;
  validCaption?: string;
  invalidCaption?: string;
}
/**
 * The object that is used to store data in our form component.
 */
export interface FormObject {
  [name: string]: any;
}

/**
 * An interface that should contain all values in the checkout form
 */
export interface ICheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  tip: number;
  marketing?: boolean;
  isAlpaca?: boolean;
  floor?: string;
  unit?: string;
  additionalNotes?: string;
  line2?: string;
  orderNote?: string;
  isGuestUser: boolean;
}

export interface IField {
  name: string;
  text: string;
  required: boolean;
  type?: string;
  labelComp?: ReactNode;
  pattern?: string;
  helperText?: string;
}

export interface IPasswordForm {
  password: string;
}

export interface ILoginForm extends IPasswordForm {
  phone: string;
}

export interface IUserForm extends ILoginForm {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ISignupForm extends IUserForm {
  marketing: boolean;
  smsOptIn: boolean;
  termsAccepted: boolean;
}

export interface IPhoneForm {
  phone: string;
}

export interface IItemExpansionForm {
  [key: string]: { [key: string]: ModifierOption };
}
