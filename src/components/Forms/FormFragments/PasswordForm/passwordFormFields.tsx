export const passwordFormFields = [
  {
    name: 'password',
    text: 'Password',
    type: 'password',
    required: true,
  },
];

export const signupPasswordFormFields = [
  {
    name: 'password',
    text: 'Password',
    type: 'password',
    required: true,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$',
    helperText: 'Minimum 8 characters include 1 symbol, 1 lowercase, 1 uppercase'
  },
];