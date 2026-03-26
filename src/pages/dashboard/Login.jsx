import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'admin@drdo.gov.in',    password: 'Admin@123',  role: 'Administrator' },
  { email: 'ananya@drdo.gov.in',   password: 'Eval@123',   role: 'Evaluator' },
  { email: 'contact@armortech.in', password: 'Start@123',  role: 'Startup' },
  { email: 'suresh@iitd.ac.in',    password: 'Mentor@123', role: 'Mentor' },
];

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#111E21' }}>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(213,170,91,0.08)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(110,193,228,0.05)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg" style={{ backgroundColor: '#D5AA5B', boxShadow: '0 8px 24px rgba(213,170,91,0.3)' }}>
            <Shield size={26} style={{ color: '#111E21' }} />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">DRDO Innovation Hub</h1>
          <p className="text-sm mt-1" style={{ color: '#6EC1E4' }}>Secure portal for startup ecosystem</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: '#1a2b2f', border: '1px solid rgba(110,193,228,0.15)' }}>
          {!mfaStep ? (
            <>
              <h2 className="text-white font-semibold text-lg mb-6">Sign in to your account</h2>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6EC1E4' }}>Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#D5AA5B' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@drdo.gov.in"
                      required
                      className="w-full text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all"
                      style={{ backgroundColor: '#0f1e21', border: '1px solid rgba(110,193,228,0.2)', color: 'white' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(213,170,91,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(110,193,228,0.2)'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6EC1E4' }}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#D5AA5B' }} />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none transition-all"
                      style={{ backgroundColor: '#0f1e21', border: '1px solid rgba(110,193,228,0.2)', color: 'white' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(213,170,91,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(110,193,228,0.2)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#6EC1E4' }}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm mt-2"
                  style={{ backgroundColor: '#D5AA5B', color: '#111E21' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#CFA745'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D5AA5B'}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(110,193,228,0.1)' }}>
                <p className="text-xs text-center mb-3" style={{ color: 'rgba(110,193,228,0.5)' }}>Quick login (click to fill credentials)</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map(({ email: e, password: p, role }) => (
                    <button
                      key={e}
                      onClick={() => { setEmail(e); setPassword(p); }}
                      className="text-left px-3 py-2 rounded-lg transition-all group"
                      style={{ backgroundColor: '#0f1e21', border: '1px solid rgba(110,193,228,0.15)' }}
                      onMouseEnter={el => { el.currentTarget.style.borderColor = 'rgba(213,170,91,0.4)'; el.currentTarget.style.backgroundColor = '#152428'; }}
                      onMouseLeave={el => { el.currentTarget.style.borderColor = 'rgba(110,193,228,0.15)'; el.currentTarget.style.backgroundColor = '#0f1e21'; }}
                    >
                      <div className="text-xs font-medium" style={{ color: '#D5AA5B' }}>{role}</div>
                      <div className="text-[10px] truncate" style={{ color: 'rgba(110,193,228,0.5)' }}>{e}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white font-semibold text-lg mb-2">Two-Factor Authentication</h2>
              <p className="text-sm mb-6" style={{ color: '#6EC1E4' }}>Enter the 6-digit OTP sent to your registered device.</p>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleMFA} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6EC1E4' }}>OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm text-center tracking-widest text-lg focus:outline-none transition-all"
                    style={{ backgroundColor: '#0f1e21', border: '1px solid rgba(110,193,228,0.2)', color: 'white' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(213,170,91,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(110,193,228,0.2)'}
                  />
                  <p className="text-xs mt-2 text-center" style={{ color: 'rgba(110,193,228,0.5)' }}>Demo OTP: 123456</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                  style={{ backgroundColor: '#D5AA5B', color: '#111E21' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#CFA745'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D5AA5B'}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(110,193,228,0.3)' }}>
          © 2024 DRDO Innovation Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
