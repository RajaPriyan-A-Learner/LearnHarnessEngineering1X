import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginApi, verifyMfaApi } from '@wma/shared-utils';
import { useAuthStore } from '../../../stores/useAuthStore';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'login' | 'mfa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
      // Clear location state so the notice doesn't persist
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid security email address.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(email, password);
      setSessionId(res.sessionId);
      setStep('mfa');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected login error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mfaCode.length !== 6 || isNaN(Number(mfaCode))) {
      setError('MFA challenge code must be exactly 6 numeric digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyMfaApi(sessionId, mfaCode);
      setSession(res.accessToken, res.refreshToken, res.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('MFA verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {step === 'login' ? (
        <form onSubmit={handleLoginSubmit} className={styles.form} noValidate>
          <h2 className={styles.title}>Advisor Portal Access</h2>
          <p className={styles.subtitle}>Enter credentials to request secondary verification.</p>

          {notice && <div className={styles.noticeBanner} role="alert">{notice}</div>}
          {error && <div className={styles.errorBanner} role="alert">{error}</div>}

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>Corporate Email</label>
            <input
              id="email"
              type="email"
              placeholder="advisor@meridian.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>Console Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Validating...' : 'Request Verification Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit} className={styles.form} noValidate>
          <h2 className={styles.title}>Multi-Factor Verification</h2>
          <p className={styles.subtitle}>Enter the 6-digit code dispatched to your security device.</p>

          {error && <div className={styles.errorBanner} role="alert">{error}</div>}

          <div className={styles.fieldGroup}>
            <label htmlFor="mfaCode" className={styles.label}>Verification Code (starts with 12)</label>
            <input
              id="mfaCode"
              type="text"
              maxLength={6}
              placeholder="123456"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              className={styles.input}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          <div className={styles.mfaActions}>
            <button 
              type="button" 
              onClick={() => { setStep('login'); setError(null); }} 
              className={styles.backBtn}
              disabled={loading}
            >
              Back to Login
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Authorizing...' : 'Authorize Session'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
