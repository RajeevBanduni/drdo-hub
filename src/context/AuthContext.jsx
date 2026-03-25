import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken, setToken, removeToken } from '../services/api';

const AuthContext = createContext(null);

// ── Demo fallback (used when backend is not running) ────────
const DEMO_USERS = {
  'admin@drdo.gov.in':      { password: 'Demo@1234', name: 'Admin User',       role: 'admin' },
  'labadmin@drdo.gov.in':   { password: 'Demo@1234', name: 'Lab Admin',        role: 'labadmin' },
  'evaluator@drdo.gov.in':  { password: 'Demo@1234', name: 'Evaluator',        role: 'evaluator' },
  'startup@innovate.in':    { password: 'Demo@1234', name: 'Startup Founder',  role: 'startup' },
  'mentor@iit.ac.in':       { password: 'Demo@1234', name: 'Mentor',           role: 'mentor' },
};

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [mfaStep, setMfaStep]         = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  // Restore session from stored token on page refresh
  useEffect(() => {
    const token = getToken();
    if (token) {
      authAPI.me()
        .then(({ user: u }) => setUser(u))
        .catch(() => removeToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // ── Try real backend first ──────────────────────────
      const { token, user: u } = await authAPI.login(email, password);
      setToken(token);
      setUser(u);
      return true;
    } catch {
      // ── Fallback to demo mode if backend is unavailable ─
      const found = DEMO_USERS[email.trim().toLowerCase()];
      if (!found || found.password !== password) throw new Error('Invalid credentials');
      setPendingUser({ email, ...found });
      setMfaStep(true);
      return true;
    }
  };

  const verifyMFA = async (code) => {
    if (code === '123456') {
      setUser(pendingUser);
      setMfaStep(false);
      setPendingUser(null);
      return true;
    }
    throw new Error('Invalid OTP. Demo code: 123456');
  };

  const logout = () => {
    setUser(null);
    setMfaStep(false);
    setPendingUser(null);
    removeToken();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #D5AA5B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: 12, color: '#666' }}>Loading…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyMFA, mfaStep }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
