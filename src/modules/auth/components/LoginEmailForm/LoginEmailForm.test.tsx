import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginEmailForm } from './index';

const signIn = jest.fn();
let hookState: { signIn: jest.Mock; isLoading: boolean; error: string | null } = {
  signIn,
  isLoading: false,
  error: null
};

jest.mock('../../hooks/useEmailSignIn', () => ({
  useEmailSignIn: () => hookState
}));

// En React 19 `ref` es un prop normal, así que los stubs pueden ser funciones
// planas: RHF sigue recibiendo el ref del input real.
jest.mock('@dasuma/pradma-ui', () => ({
  FancyButton: {
    Root: ({
      children,
      type,
      disabled
    }: {
      children: React.ReactNode;
      type?: 'submit' | 'button';
      disabled?: boolean;
    }) => (
      <button type={type} disabled={disabled}>
        {children}
      </button>
    ),
    Icon: () => <span />
  },
  Input: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
    Icon: () => <span />
  },
  Label: {
    Root: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
      <label htmlFor={htmlFor}>{children}</label>
    )
  },
  Hint: {
    Root: ({ children }: { children: React.ReactNode }) => <p role="alert">{children}</p>
  }
}));

jest.mock('@dasuma/pradma-ui/icons', () => ({
  RiEyeLine: () => <span />,
  RiEyeOffLine: () => <span />,
  RiLockLine: () => <span />,
  RiMailLine: () => <span />
}));

describe('LoginEmailForm', () => {
  beforeEach(() => {
    signIn.mockClear();
    hookState = { signIn, isLoading: false, error: null };
  });

  it('calls signIn with the submitted credentials', async () => {
    render(<LoginEmailForm locale="es" />);

    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'admin@pradma.gov');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(signIn).toHaveBeenCalledWith('admin@pradma.gov', 'secret123'));
  });

  it('shows a validation error and does not submit when the email is invalid', async () => {
    render(<LoginEmailForm locale="es" />);

    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'not-an-email');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Ingresá un correo válido')).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  it('translates a firebase error code into a friendly message', () => {
    hookState = { signIn, isLoading: false, error: 'auth/invalid-credential' };
    render(<LoginEmailForm locale="es" />);

    expect(screen.getByText('Correo o contraseña incorrectos')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<LoginEmailForm locale="es" />);

    const password = screen.getByLabelText('Contraseña');
    expect(password).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(password).toHaveAttribute('type', 'text');
  });
});
