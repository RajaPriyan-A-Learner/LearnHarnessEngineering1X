import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { loginApi, verifyMfaApi } from '@wma/shared-utils';
import { useAuthStore } from '../../../stores/useAuthStore';

// Mock routing navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('@wma/shared-utils', () => ({
  loginApi: vi.fn(),
  verifyMfaApi: vi.fn()
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearSession();
  });

  it('renders login credentials form by default', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Corporate Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Console Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Request Verification Code/i })).toBeInTheDocument();
  });

  it('displays validation error if email format is invalid', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Corporate Email/i);
    const passwordInput = screen.getByLabelText(/Console Password/i);
    const submitBtn = screen.getByRole('button', { name: /Request Verification Code/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter a valid security email address/i)).toBeInTheDocument();
  });

  it('displays validation error if password is less than 8 characters', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Corporate Email/i);
    const passwordInput = screen.getByLabelText(/Console Password/i);
    const submitBtn = screen.getByRole('button', { name: /Request Verification Code/i });

    fireEvent.change(emailInput, { target: { value: 'advisor@meridian.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Password must contain at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows MFA card step upon successful login credentials check', async () => {
    vi.mocked(loginApi).mockResolvedValueOnce({
      status: 'mfa_required',
      sessionId: 'test-session-id'
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Corporate Email/i), { target: { value: 'advisor@meridian.com' } });
    fireEvent.change(screen.getByLabelText(/Console Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Request Verification Code/i }));

    await waitFor(() => {
      expect(loginApi).toHaveBeenCalledWith('advisor@meridian.com', 'password123');
    });

    expect(await screen.findByText(/Multi-Factor Verification/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Verification Code/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid MFA code structure', async () => {
    vi.mocked(loginApi).mockResolvedValueOnce({
      status: 'mfa_required',
      sessionId: 'test-session-id'
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Get to MFA step
    fireEvent.change(screen.getByLabelText(/Corporate Email/i), { target: { value: 'advisor@meridian.com' } });
    fireEvent.change(screen.getByLabelText(/Console Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Request Verification Code/i }));

    const mfaInput = await screen.findByLabelText(/Verification Code/i);
    fireEvent.change(mfaInput, { target: { value: '123' } }); // too short
    fireEvent.click(screen.getByRole('button', { name: /Authorize Session/i }));

    expect(await screen.findByText(/MFA challenge code must be exactly 6 numeric digits/i)).toBeInTheDocument();
  });

  it('completes session validation and redirects to dashboard on valid MFA code input', async () => {
    vi.mocked(loginApi).mockResolvedValueOnce({
      status: 'mfa_required',
      sessionId: 'test-session-id'
    });

    vi.mocked(verifyMfaApi).mockResolvedValueOnce({
      accessToken: 'token-abc',
      refreshToken: 'token-xyz',
      user: {
        name: 'Sarah Jenkins',
        role: 'Advisor',
        email: 'advisor@meridian.com'
      }
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Get to MFA step
    fireEvent.change(screen.getByLabelText(/Corporate Email/i), { target: { value: 'advisor@meridian.com' } });
    fireEvent.change(screen.getByLabelText(/Console Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Request Verification Code/i }));

    const mfaInput = await screen.findByLabelText(/Verification Code/i);
    fireEvent.change(mfaInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize Session/i }));

    await waitFor(() => {
      expect(verifyMfaApi).toHaveBeenCalledWith('test-session-id', '123456');
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.name).toBe('Sarah Jenkins');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
