import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import { useAuthStore } from '../stores/useAuthStore';
import { useHouseholdStore } from '../stores/useHouseholdStore';
import { useAuthRefresh } from '../features/auth/hooks/useAuthRefresh';
import { useSessionTimeout } from '../features/auth/hooks/useSessionTimeout';

const mockNavigate = vi.fn();
const mockLocation = { pathname: '/dashboard' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock('../features/auth/hooks/useAuthRefresh', () => ({
  useAuthRefresh: vi.fn(),
}));

vi.mock('../features/auth/hooks/useSessionTimeout', () => ({
  useSessionTimeout: vi.fn(),
}));

describe('AuthenticatedLayout Component', () => {
  const mockKeepWorking = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearSession();
    useHouseholdStore.getState().setActiveHousehold({
      name: 'The Miller Family Trust',
      id: 'HH-804-MILLER',
      totalValue: 4850300.75,
      dayChangePercent: 0.0125,
      riskProfile: 'Moderate Growth'
    });

    vi.mocked(useAuthRefresh).mockReturnValue({
      refreshSession: vi.fn(),
    });

    vi.mocked(useSessionTimeout).mockReturnValue({
      showWarning: false,
      countdown: 60,
      keepWorking: mockKeepWorking,
      logout: mockLogout,
    });

    mockLocation.pathname = '/dashboard';
  });

  it('redirects to /login and returns null if user is not authenticated', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(container.firstChild).toBeNull();
  });

  it('renders side navigation and header if authenticated', () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com',
    });

    render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(screen.getByText(/MPW Console/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Household:/i)).toBeInTheDocument();
    expect(screen.getByText(/The Miller Family Trust/i)).toBeInTheDocument();
  });

  it('filters navigation links based on user role', () => {
    // Compliance Officer
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Carl',
      role: 'Compliance Officer',
      email: 'carl@meridian.com',
    });

    render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    // Should render Dashboard and Compliance Review
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Compliance Review/i)).toBeInTheDocument();

    // Should NOT render Book of Business or Sandbox or KYC Onboarding or Admin Console
    expect(screen.queryByText(/Book of Business/i)).toBeNull();
    expect(screen.queryByText(/Rebalancing Sandbox/i)).toBeNull();
    expect(screen.queryByText(/KYC Onboarding/i)).toBeNull();
    expect(screen.queryByText(/Admin Console/i)).toBeNull();
  });

  it('blocks unauthorized route and renders 403 Access Forbidden', () => {
    // Advisor visits /admin path
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com',
    });
    mockLocation.pathname = '/admin';

    render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(screen.getByText(/403 Access Forbidden/i)).toBeInTheDocument();
    expect(screen.getByText(/Your current session role does not have authorization/i)).toBeInTheDocument();
  });

  it('updates dynamic context header when Zustand store changes', () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com',
    });

    render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(screen.getByText(/The Miller Family Trust/i)).toBeInTheDocument();

    // Update store value
    act(() => {
      useHouseholdStore.getState().setActiveHousehold({
        name: 'The Vanderbilt Estate',
        id: 'HH-900-VANDERBILT',
        totalValue: 12000000.50,
        dayChangePercent: -0.005,
        riskProfile: 'Conservative'
      });
    });

    expect(screen.getByText(/The Vanderbilt Estate/i)).toBeInTheDocument();
    expect(screen.getByText(/HH-900-VANDERBILT/i)).toBeInTheDocument();
  });

  it('renders Warning Modal when showWarning is true', () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com',
    });

    vi.mocked(useSessionTimeout).mockReturnValue({
      showWarning: true,
      countdown: 45,
      keepWorking: mockKeepWorking,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Session Expiration Warning/i)).toBeInTheDocument();
    expect(screen.getByText(/expire in/i)).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();

    const keepWorkingBtn = screen.getByRole('button', { name: /Keep Working/i });
    const logoutButtons = screen.getAllByRole('button', { name: /Logout/i });
    const logoutBtn = logoutButtons[logoutButtons.length - 1]; // select the modal's logout button

    fireEvent.click(keepWorkingBtn);
    expect(mockKeepWorking).toHaveBeenCalled();

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });
});
