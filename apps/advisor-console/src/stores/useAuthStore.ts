import { create } from 'zustand';
import { User } from '@wma/shared-utils';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  setSession: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user, isAuthenticated: true }),
  clearSession: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
}));
