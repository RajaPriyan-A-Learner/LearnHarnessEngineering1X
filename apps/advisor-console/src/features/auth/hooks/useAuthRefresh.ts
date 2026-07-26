import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { refreshApi } from '@wma/shared-utils';
import { useNavigate } from 'react-router-dom';

export function useAuthRefresh(refreshWindowMs: number = 14 * 60 * 1000) {
  const { accessToken, refreshToken, setSession, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshSession = useCallback(async () => {
    if (!refreshToken) return;
    try {
      const res = await refreshApi(refreshToken);
      const user = useAuthStore.getState().user;
      if (user) {
        setSession(res.accessToken, res.refreshToken, user);
      }
    } catch (err: unknown) {
      clearSession();
      navigate('/login', { state: { notice: 'Session expired. Please log in again.' } });
    }
  }, [refreshToken, setSession, clearSession, navigate]);

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      refreshSession();
    }, refreshWindowMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [accessToken, refreshToken, refreshWindowMs, refreshSession]);

  return { refreshSession };
}
