import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionTimeout } from './useSessionTimeout';
import { useAuthStore } from '../../../stores/useAuthStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock IndexedDB databases
const mockDeleteDatabase = vi.fn();
const mockDatabases = vi.fn().mockResolvedValue([{ name: 'test-db' }]);
Object.defineProperty(window, 'indexedDB', {
  value: {
    databases: mockDatabases,
    deleteDatabase: mockDeleteDatabase,
  },
  writable: true,
});

describe('useSessionTimeout Hook', () => {
  const onExtendSession = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not start idle timer if user is not authenticated', () => {
    const { result } = renderHook(() => useSessionTimeout(onExtendSession, 5000, 10));
    
    vi.advanceTimersByTime(5000);
    expect(result.current.showWarning).toBe(false);
  });

  it('triggers warning after idle timeout period', () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com'
    });

    const { result } = renderHook(() => useSessionTimeout(onExtendSession, 5000, 10));
    
    expect(result.current.showWarning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.showWarning).toBe(true);
    expect(result.current.countdown).toBe(10);
  });

  it('resets idle timer on user activity events', () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com'
    });

    const { result } = renderHook(() => useSessionTimeout(onExtendSession, 5000, 10));

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Simulate activity
    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    // Advance another 3000ms. Since it reset, it shouldn't show warning yet
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.showWarning).toBe(false);

    // Advance another 2000ms (total 5000ms since reset) to trigger warning
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.showWarning).toBe(true);
  });

  it('counts down and triggers logout and cache wipe when countdown reaches 0', async () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com'
    });
    localStorage.setItem('key', 'value');

    const { result } = renderHook(() => useSessionTimeout(onExtendSession, 5000, 10));

    // Trigger warning
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.showWarning).toBe(true);

    // Count down to 0
    await act(async () => {
      vi.advanceTimersByTime(10000); // 10 seconds countdown
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem('key')).toBeNull();
    expect(mockDatabases).toHaveBeenCalled();
    expect(mockDeleteDatabase).toHaveBeenCalledWith('test-db');
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { notice: 'Session expired due to inactivity.' }
    });
  });

  it('resets timer and triggers extend callback on keepWorking', () => {
    useAuthStore.getState().setSession('access-token-123', 'refresh-token-123', {
      name: 'Sarah',
      role: 'Advisor',
      email: 'sarah@meridian.com'
    });

    const { result } = renderHook(() => useSessionTimeout(onExtendSession, 5000, 10));

    // Trigger warning
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.showWarning).toBe(true);

    // Click keep working
    act(() => {
      result.current.keepWorking();
    });

    expect(result.current.showWarning).toBe(false);
    expect(onExtendSession).toHaveBeenCalled();

    // Verify timer restarted
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.showWarning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.showWarning).toBe(true);
  });
});
