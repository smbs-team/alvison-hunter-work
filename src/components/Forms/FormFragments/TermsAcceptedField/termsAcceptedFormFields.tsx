export const termsAcceptedFormFields = [
  {
    name: 'termsAccepted',
    text: 'Marketing',
    labelComp: (
      <div>
        By signing up, you agree to our {' '}
        <a
          href="https://www.getreef.com/termsOfUse"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Use
        </a>{' '}
        and{' '}
        <a
          href="https://www.getreef.com/privacyPolicy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        .
      </div>
    ),
    type: 'checkbox',
    required: true,
  },
];
