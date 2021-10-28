import { useState, useMemo } from 'react';
import { PhoneField, FormViewTemplate } from '../../../components';
import { IPhoneForm } from '../../../interfaces';
import { useActions } from '../../../hooks';
import * as rawActions from '../../../store/actions';
import '../../../styles/sign-in-forms.scss';
/**
 * A component for requesting password resets.
 */
export const RequestPasswordReset = ({}) => {
  const { requestPasswordReset } = useActions(rawActions);
  const [linkSent, toggleLinkSent] = useState(false);

  const vals = useMemo(
    () =>
      !linkSent
        ? {
            title: 'Forgot Password?',
            subTitle: "We'll text a recovery link to your phone number",
            formFragments: [PhoneField],
            buttonText: 'Send',
          }
        : {
            title: 'Link Sent',
            subTitle:
              'Please check your phone for a link to reset your password. Haven’t received the text?',
            formFragments: [],
            buttonText: 'Resend',
          },
    [linkSent]
  );

  const onSubmit = async ({ phone }: IPhoneForm) => {
    toggleLinkSent(true);
    await requestPasswordReset(phone);
  };
  return (
    <FormViewTemplate
      submitFunc={onSubmit}
      {...vals}
      defaultValues={{ phone: '' }}
    />
  );
};
