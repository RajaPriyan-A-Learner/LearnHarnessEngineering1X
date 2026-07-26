import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const clearSessionCaches = async () => {
  localStorage.clear();
  sessionStorage.clear();
  try {
    if (window.indexedDB && window.indexedDB.databases) {
      const dbs = await window.indexedDB.databases();
      dbs.forEach((db) => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });
    }
  } catch (e) {
    console.error('Failed to clear IndexedDB databases', e);
  }
};

export function useSessionTimeout(
  onExtendSession?: () => void,
  idleTimeoutMs: number = 14 * 60 * 1000,
  countdownDurationS: number = 60
) {
  const { accessToken, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(countdownDurationS);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLogout = useCallback(async () => {
    // Clear timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    clearSession();
    await clearSessionCaches();
    navigate('/login', { state: { notice: 'Session expired due to inactivity.' } });
  }, [clearSession, navigate]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    setShowWarning(false);
    setCountdown(countdownDurationS);

    if (accessToken) {
      idleTimerRef.current = setTimeout(() => {
        setShowWarning(true);
      }, idleTimeoutMs);
    }
  }, [accessToken, idleTimeoutMs, countdownDurationS]);

  const keepWorking = useCallback(() => {
    resetIdleTimer();
    if (onExtendSession) {
      onExtendSession();
    }
  }, [resetIdleTimer, onExtendSession]);

  // Track user input to reset idle timer (only when warning is not showing)
  useEffect(() => {
    if (!accessToken || showWarning) return;

    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    const handleActivity = () => {
      resetIdleTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initial trigger to start idle timer
    resetIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [accessToken, showWarning, resetIdleTimer]);

  // Handle countdown when warning is active
  useEffect(() => {
    if (!showWarning) return;

    setCountdown(countdownDurationS);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current!);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [showWarning, countdownDurationS, handleLogout]);

  return {
    showWarning,
    countdown,
    keepWorking,
    logout: handleLogout
  };
}
