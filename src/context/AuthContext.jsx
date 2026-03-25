import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [mfaStep, setMfaStep]         = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid credentials');
    // Store token + user, then trigger MFA step
    setPendingUser({ ...data.user, token: data.token });
    setMfaStep(true);
    return true;
  };

  const verifyMFA = async (code) => {
    if (code === '123456') {
      setUser(pendingUser);
      localStorage.setItem('drdo_token', pendingUser.token);
      localStorage.setItem('drdo_user', JSON.stringify(pendingUser));
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
    localStorage.removeItem('drdo_token');
    localStorage.removeItem('drdo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyMFA, mfaStep }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
