import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'admin@drdo.gov.in',     role: 'Administrator' },
  { email: 'evaluator@drdo.gov.in', role: 'Evaluator' },
  { email: 'startup@innovate.in',   role: 'Startup' },
  { email: 'mentor@iit.ac.in',      role: 'Mentor' },
];

const G = '#D5AA5B';
const GH = '#C9983F';

export default function Login() {
  const { login, verifyMFA, mfaStep } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]           = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMFA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyMFA(otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56, height: 56,
            background: G,
            borderRadius: 16,
            marginBottom: 16,
            boxShadow: '0 4px 16px rgba(213,170,91,0.35)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>DRDO Innovation Hub</h1>
          <p style={{ margin: '6px 0 0', color: '#888', fontSize: 14 }}>Secure portal for startup ecosystem</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #eeeeee',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          {!mfaStep ? (
            <>
              <h2 style={{ margin: '0 0 24px', color: '#1a1a1a', fontSize: 18, fontWeight: 600 }}>
                Sign in to your account
              </h2>

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#fff5f5', border: '1px solid #fecaca',
                  color: '#dc2626', fontSize: 13, borderRadius: 10,
                  padding: '10px 14px', marginBottom: 20,
                }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: '#444', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                    Email address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@drdo.gov.in"
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: '#fafafa', border: '1.5px solid #e0e0e0',
                        color: '#1a1a1a', borderRadius: 10,
                        paddingLeft: 38, paddingRight: 14, paddingTop: 11, paddingBottom: 11,
                        fontSize: 14, outline: 'none',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = G}
                      onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#444', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: '#fafafa', border: '1.5px solid #e0e0e0',
                        color: '#1a1a1a', borderRadius: 10,
                        paddingLeft: 38, paddingRight: 42, paddingTop: 11, paddingBottom: 11,
                        fontSize: 14, outline: 'none',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = G}
                      onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0,
                      }}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', background: loading ? '#e8d5a0' : G,
                    color: '#fff', border: 'none', borderRadius: 10,
                    padding: '12px 0', fontSize: 14, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 2px 12px rgba(213,170,91,0.3)',
                    transition: 'background 0.15s',
                    marginTop: 4,
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = GH; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = G; }}
                >
                  {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              {/* Demo accounts */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                <p style={{ color: '#aaa', fontSize: 12, textAlign: 'center', marginBottom: 12 }}>
                  Demo accounts (password: Demo@1234)
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {DEMO_ACCOUNTS.map(({ email: e, role }) => (
                    <button
                      key={e}
                      onClick={() => setEmail(e)}
                      style={{
                        textAlign: 'left', padding: '10px 12px',
                        background: '#fafafa', border: '1.5px solid #eeeeee',
                        borderRadius: 10, cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={el => { el.currentTarget.style.borderColor = G; el.currentTarget.style.background = '#fff8ec'; }}
                      onMouseLeave={el => { el.currentTarget.style.borderColor = '#eeeeee'; el.currentTarget.style.background = '#fafafa'; }}
                    >
                      <div style={{ color: G, fontSize: 12, fontWeight: 600 }}>{role}</div>
                      <div style={{ color: '#aaa', fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ margin: '0 0 8px', color: '#1a1a1a', fontSize: 18, fontWeight: 600 }}>
                Two-Factor Authentication
              </h2>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
                Enter the 6-digit OTP sent to your registered device.
              </p>

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#fff5f5', border: '1px solid #fecaca',
                  color: '#dc2626', fontSize: 13, borderRadius: 10,
                  padding: '10px 14px', marginBottom: 20,
                }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleMFA} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: '#444', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#fafafa', border: '1.5px solid #e0e0e0',
                      color: '#1a1a1a', borderRadius: 10,
                      padding: '12px 14px', fontSize: 20,
                      letterSpacing: 8, textAlign: 'center',
                      outline: 'none', transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = G}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                  <p style={{ color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
                    Demo OTP: 123456
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  style={{
                    width: '100%',
                    background: (loading || otp.length < 6) ? '#e8d5a0' : G,
                    color: '#fff', border: 'none', borderRadius: 10,
                    padding: '12px 0', fontSize: 14, fontWeight: 700,
                    cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 2px 12px rgba(213,170,91,0.3)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!loading && otp.length >= 6) e.currentTarget.style.background = GH; }}
                  onMouseLeave={e => { if (!loading && otp.length >= 6) e.currentTarget.style.background = G; }}
                >
                  {loading && <Loader2 size={16} />}
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 24 }}>
          © 2024 DRDO Innovation Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
