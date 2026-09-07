import type { AuthDictionary } from './es';

export const authDictEn: AuthDictionary = {
  loginWithGoogle: 'Continue with Google',
  loginError: 'Could not sign in',
  logout: 'Sign out',
  signingOut: 'Signing out...',
  emailLabel: 'Email address',
  emailPlaceholder: 'name@email.com',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  submit: 'Sign in',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  googleDivider: 'or',
  errors: {
    emailRequired: 'Enter your email address',
    emailInvalid: 'Enter a valid email address',
    passwordRequired: 'Enter your password',
    invalidCredentials: 'Wrong email or password',
    userNotFound: 'There is no account with that email',
    userDisabled: 'This account is disabled',
    tooManyRequests: 'Too many failed attempts. Wait a few minutes and try again',
    network: 'No connection. Check your network and try again',
    generic: 'Could not sign in. Please try again'
  }
};
