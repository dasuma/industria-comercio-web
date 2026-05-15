import { render, screen } from '@testing-library/react';
import { LoginGoogleButton } from './index';

jest.mock('../../hooks/useGoogleSignIn', () => ({
  useGoogleSignIn: () => ({ signIn: jest.fn(), isLoading: false, error: null })
}));

jest.mock('@biaenergy/ui', () => ({
  FancyButton: {
    Root: ({
      children,
      onClick,
      disabled,
      className
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      className?: string;
    }) => (
      <button onClick={onClick} disabled={disabled} className={className}>
        {children}
      </button>
    ),
    Icon: () => <span data-testid="button-icon" />
  }
}));

jest.mock('@biaenergy/ui/icons', () => ({
  RiGoogleFill: () => <span data-testid="google-icon" />
}));

describe('LoginGoogleButton', () => {
  it('renders the spanish label when locale is es', () => {
    render(<LoginGoogleButton locale="es" />);
    expect(screen.getByRole('button')).toHaveTextContent('Continuar con Google');
  });

  it('renders the english label when locale is en', () => {
    render(<LoginGoogleButton locale="en" />);
    expect(screen.getByRole('button')).toHaveTextContent('Continue with Google');
  });
});
