export const smsFormFields = [
  {
    name: 'smsOptIn',
    text: 'SMS Opt In',
    labelComp: (
      <div>
        <div >
          I agree to receive SMS promotional messages from GetREEF.com. Text STOP to cancel at any time. Text HELP for info. Up to 5 Messages/Month. Message and data rates may apply.
        </div>
      </div>
    ),
    type: 'checkbox',
    required: false,
  },
];
