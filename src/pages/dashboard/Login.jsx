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
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/30">
            <Shield size={26} className="text-dark-950" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">DRDO Innovation Hub</h1>
          <p className="text-dark-400 text-sm mt-1">Secure portal for startup ecosystem</p>
        </div>

        {/* Card */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 shadow-2xl">
          {!mfaStep ? (
            <>
              <h2 className="text-white font-semibold text-lg mb-6">Sign in to your account</h2>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@drdo.gov.in"
                      required
                      className="w-full bg-dark-800 border border-dark-700 text-white placeholder-dark-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-dark-800 border border-dark-700 text-white placeholder-dark-500 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-dark-950 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm mt-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-6 pt-5 border-t border-dark-800">
                <p className="text-dark-500 text-xs text-center mb-3">Quick login (click to fill credentials)</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map(({ email: e, password: p, role }) => (
                    <button
                      key={e}
                      onClick={() => { setEmail(e); setPassword(p); }}
                      className="text-left px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/30 transition-all group"
                    >
                      <div className="text-primary-400 text-xs font-medium group-hover:text-primary-300">{role}</div>
                      <div className="text-dark-500 text-[10px] truncate">{e}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white font-semibold text-lg mb-2">Two-Factor Authentication</h2>
              <p className="text-dark-400 text-sm mb-6">Enter the 6-digit OTP sent to your registered device.</p>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleMFA} className="space-y-4">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full bg-dark-800 border border-dark-700 text-white placeholder-dark-500 rounded-xl px-4 py-3 text-sm text-center tracking-widest text-lg focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                  <p className="text-dark-500 text-xs mt-2 text-center">Demo OTP: 123456</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-dark-950 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-dark-600 text-xs mt-6">
          © 2024 DRDO Innovation Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
