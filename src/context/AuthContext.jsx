import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

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

  const login = async (email, password) => {
    const found = DEMO_USERS[email.trim().toLowerCase()];
    if (!found || found.password !== password) throw new Error('Invalid credentials');
    setPendingUser({ email, ...found });
    setMfaStep(true);
    return true;
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyMFA, mfaStep }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
