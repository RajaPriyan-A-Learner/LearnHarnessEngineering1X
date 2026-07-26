export interface LoginResponse {
  status: 'mfa_required';
  sessionId: string;
}

export interface User {
  name: string;
  role: 'Advisor' | 'Relationship Manager' | 'Client Service Associate' | 'Compliance Officer' | 'Branch Admin';
  email: string;
}

export interface MfaResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  
  return res.json();
};

export const verifyMfaApi = async (sessionId: string, code: string): Promise<MfaResponse> => {
  const res = await fetch('/api/auth/mfa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, code })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'MFA validation failed');
  }
  
  return res.json();
};

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const refreshApi = async (refreshToken: string): Promise<RefreshResponse> => {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Session refresh failed');
  }
  
  return res.json();
};

