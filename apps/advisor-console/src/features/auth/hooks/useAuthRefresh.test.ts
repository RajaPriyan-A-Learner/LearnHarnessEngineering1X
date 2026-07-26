import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthRefresh } from './useAuthRefresh';
import { useAuthStore } from '../../../stores/useAuthStore';
import { refreshApi } from '@wma/shared-utils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@wma/shared-utils', () => ({
  refreshApi: vi.fn(),
}));

describe('useAuthRefresh Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    useAuthStore.getState().clearSession();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not schedule refresh if accessToken or refreshToken is missing', () => {
    renderHook(() => useAuthRefresh(5000));
    
    // Fast-forward timers
    vi.advanceTimersByTime(5000);
    expect(refreshApi).not.toHaveBeenCalled();
  });

  it('schedules token refresh and calls refreshApi after specified interval', async () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com'
    });

    vi.mocked(refreshApi).mockResolvedValueOnce({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    });

    renderHook(() => useAuthRefresh(5000));

    // Advance to timer fire
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(refreshApi).toHaveBeenCalledWith('refresh-token-123');
    expect(useAuthStore.getState().accessToken).toBe('new-access-token');
    expect(useAuthStore.getState().refreshToken).toBe('new-refresh-token');
  });

  it('logs out and redirects to login with notice on refresh failure', async () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com'
    });

    vi.mocked(refreshApi).mockRejectedValueOnce(new Error('Expired refresh token'));

    renderHook(() => useAuthRefresh(5000));

    // Advance to timer fire
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(refreshApi).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { notice: 'Session expired. Please log in again.' }
    });
  });
});
