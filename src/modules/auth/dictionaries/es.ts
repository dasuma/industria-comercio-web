export const authDictEs = {
  loginWithGoogle: 'Continuar con Google',
  loginError: 'No se pudo iniciar sesión',
  logout: 'Cerrar sesión',
  signingOut: 'Cerrando sesión...',
  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'nombre@correo.com',
  passwordLabel: 'Contraseña',
  passwordPlaceholder: '••••••••',
  submit: 'Ingresar',
  showPassword: 'Mostrar contraseña',
  hidePassword: 'Ocultar contraseña',
  googleDivider: 'o',
  errors: {
    emailRequired: 'Ingresá tu correo electrónico',
    emailInvalid: 'Ingresá un correo válido',
    passwordRequired: 'Ingresá tu contraseña',
    invalidCredentials: 'Correo o contraseña incorrectos',
    userNotFound: 'No existe una cuenta con ese correo',
    userDisabled: 'Esta cuenta está deshabilitada',
    tooManyRequests: 'Demasiados intentos fallidos. Esperá unos minutos e intentá de nuevo',
    network: 'Sin conexión. Revisá tu red e intentá de nuevo',
    generic: 'No se pudo iniciar sesión. Intentá de nuevo'
  }
};

export type AuthDictionary = typeof authDictEs;
