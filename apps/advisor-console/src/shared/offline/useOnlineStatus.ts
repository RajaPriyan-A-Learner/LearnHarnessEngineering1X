// src/shared/offline/useOnlineStatus.ts
import { useState, useEffect } from 'react';

/**
 * Hook that tracks the browser's online/offline status.
 * Returns true when the browser reports being online.
 */
export const useOnlineStatus = (): boolean => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
};
