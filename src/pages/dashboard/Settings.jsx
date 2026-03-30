import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  User, Mail, Shield, Lock, Save, Eye, EyeOff,
  CheckCircle2, AlertCircle, Bell, Moon, Sun,
} from 'lucide-react';

const G = '#D5AA5B';
const GH = '#C9983F';

const card = {
  background: '#ffffff',
  border: '1px solid #eeeeee',
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export default function Settings() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('profile');

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Notification prefs (local only)
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const saveProfile = async () => {
    if (!name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ name: name.trim() });
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('drdo_user') || '{}');
      stored.name = res.user?.name || name.trim();
      localStorage.setItem('drdo_user', JSON.stringify(stored));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPw) return toast.error('Enter current password');
    if (newPw.length < 6) return toast.error('New password must be at least 6 characters');
    if (newPw !== confirmPw) return toast.error('Passwords do not match');
    setChangingPw(true);
    try {
      await authAPI.changePassword(currentPw, newPw);
      toast.success('Password changed successfully');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div style={{ padding: 28, maxWidth: 800, background: '#f5f5f5', minHeight: '100%' }}>
      <h1 style={{ margin: '0 0 4px', color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>Settings</h1>
      <p style={{ margin: '0 0 24px', color: '#888', fontSize: 13 }}>Manage your profile, security and preferences</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            background: tab === id ? G : 'transparent',
            color: tab === id ? '#fff' : '#666',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div style={{ ...card, padding: 28 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Profile Information</h2>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(213,170,91,0.12)', color: G,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, border: '2px solid rgba(213,170,91,0.3)',
            }}>
              {(name || user?.email)?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{name || user?.email}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield size={11} color={G} />
                <span style={{ textTransform: 'capitalize' }}>{user?.role || 'User'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{
                width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                background: '#fafafa', border: '1.5px solid #e0e0e0', borderRadius: 9,
                fontSize: 14, outline: 'none', color: '#1a1a1a', transition: 'border-color 0.15s',
              }}
                onFocus={e => e.target.style.borderColor = G}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>Email</label>
              <div style={{
                padding: '10px 14px', background: '#f5f5f5', border: '1.5px solid #e0e0e0',
                borderRadius: 9, fontSize: 14, color: '#888',
              }}>
                {user?.email} <span style={{ fontSize: 11, color: '#aaa' }}>(cannot be changed)</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>Role</label>
              <div style={{
                padding: '10px 14px', background: '#f5f5f5', border: '1.5px solid #e0e0e0',
                borderRadius: 9, fontSize: 14, color: '#888', textTransform: 'capitalize',
              }}>
                {user?.role} <span style={{ fontSize: 11, color: '#aaa' }}>(assigned by admin)</span>
              </div>
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving} style={{
            marginTop: 24, padding: '11px 28px', background: saving ? '#ccc' : G, color: '#fff',
            border: 'none', borderRadius: 9, cursor: saving ? 'default' : 'pointer',
            fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: saving ? 'none' : '0 2px 10px rgba(213,170,91,0.3)',
          }}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div style={{ ...card, padding: 28 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Change Password</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 400 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showCurrent ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '10px 40px 10px 14px',
                    background: '#fafafa', border: '1.5px solid #e0e0e0', borderRadius: 9,
                    fontSize: 14, outline: 'none', color: '#1a1a1a',
                  }}
                />
                <button onClick={() => setShowCurrent(!showCurrent)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4,
                }}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '10px 40px 10px 14px',
                    background: '#fafafa', border: '1.5px solid #e0e0e0', borderRadius: 9,
                    fontSize: 14, outline: 'none', color: '#1a1a1a',
                  }}
                />
                <button onClick={() => setShowNew(!showNew)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4,
                }}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                  background: '#fafafa', border: '1.5px solid #e0e0e0', borderRadius: 9,
                  fontSize: 14, outline: 'none', color: '#1a1a1a',
                }}
              />
              {confirmPw && newPw !== confirmPw && (
                <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={11} /> Passwords do not match
                </div>
              )}
              {confirmPw && newPw === confirmPw && newPw.length >= 6 && (
                <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={11} /> Passwords match
                </div>
              )}
            </div>
          </div>

          <button onClick={changePassword} disabled={changingPw} style={{
            marginTop: 24, padding: '11px 28px',
            background: changingPw ? '#ccc' : '#1a1a1a', color: '#fff',
            border: 'none', borderRadius: 9, cursor: changingPw ? 'default' : 'pointer',
            fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Lock size={14} /> {changingPw ? 'Changing...' : 'Change Password'}
          </button>

          {/* MFA Section */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Multi-Factor Authentication</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>MFA Enabled</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>OTP-based verification is active on your account</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <div style={{ ...card, padding: 28 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Notification Preferences</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Email Notifications', desc: 'Receive updates via email for evaluations, feedback, and events', value: emailNotif, toggle: setEmailNotif },
              { label: 'Push Notifications', desc: 'Browser push notifications for messages and alerts', value: pushNotif, toggle: setPushNotif },
            ].map(({ label, desc, value, toggle }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{desc}</div>
                </div>
                <button onClick={() => toggle(!value)} style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: value ? G : '#e0e0e0', position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3, left: value ? 23 : 3,
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: '14px 18px', background: '#fff8ec', borderRadius: 10, border: '1px solid rgba(213,170,91,0.3)', fontSize: 12, color: '#888' }}>
            <strong style={{ color: G }}>Note:</strong> Notification preferences are stored locally and will be synced to the server in a future update.
          </div>
        </div>
      )}

      {/* Account Info */}
      <div style={{ ...card, padding: 20, marginTop: 20 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Account Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'User ID', value: user?.id || '—' },
            { label: 'Role', value: user?.role || '—' },
            { label: 'Email', value: user?.email || '—' },
            { label: 'Platform', value: 'DRDO Innovation Hub v1.0' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '8px 0' }}>
              <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 500, textTransform: label === 'Role' ? 'capitalize' : 'none' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
