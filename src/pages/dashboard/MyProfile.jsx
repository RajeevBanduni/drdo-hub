import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PERSONAS, PROFILE_FIELDS } from '../../config/personas';
import { profileAPI } from '../../services/api';
import { User, Save, Loader2, AlertCircle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const inputStyle = {
  backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', color: '#1a1a1a',
  width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: 13, outline: 'none',
};

function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) { onChange([...value, tag]); setInput(''); }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {(value || []).map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: '#D5AA5B15', color: '#D5AA5B', border: '1px solid #D5AA5B30' }}>
            {t}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}><X size={12} /></button>
          </span>
        ))}
      </div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        placeholder={placeholder} style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#D5AA5B'}
        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; add(); }} />
    </div>
  );
}

function MultiSelect({ options = [], value = [], onChange }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button type="button" key={opt} onClick={() => toggle(opt)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: value.includes(opt) ? '#D5AA5B' : '#f9fafb',
            color: value.includes(opt) ? '#fff' : '#555',
            border: `1px solid ${value.includes(opt) ? '#D5AA5B' : '#e5e7eb'}`,
          }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function FormField({ field, value, onChange }) {
  const { name, label, type, required, options, placeholder, min, max } = field;
  if (type === 'select') {
    return (
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <select value={value || ''} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">Select...</option>
          {(options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>{label}</label>
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => e.target.style.borderColor = '#D5AA5B'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
      </div>
    );
  }
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)}
          style={{ accentColor: '#D5AA5B' }} />
        <span className="text-xs font-medium" style={{ color: '#374151' }}>{label}</span>
      </label>
    );
  }
  if (type === 'tags') {
    return (
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>{label}</label>
        <TagInput value={value || []} onChange={onChange} placeholder={placeholder} />
      </div>
    );
  }
  if (type === 'multiselect') {
    return (
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>{label}</label>
        <MultiSelect options={options || []} value={value || []} onChange={onChange} />
      </div>
    );
  }
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input type={type || 'text'} value={value ?? ''} onChange={e => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        placeholder={placeholder || ''} min={min} max={max} style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#D5AA5B'}
        onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
    </div>
  );
}

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const persona = PERSONAS[user?.role];
  const fields = PROFILE_FIELDS[user?.role] || [];

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileAPI.getMyProfile();
      if (data.profile) {
        setProfileData(data.profile);
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Only send fields that have values
      const payload = {};
      for (const field of fields) {
        const val = profileData[field.name];
        if (val !== undefined && val !== null && val !== '') {
          payload[field.name] = val;
        }
      }
      const data = await profileAPI.updateMyProfile(payload);
      setProfileData(data.profile);
      updateUser({ profile_completed: true });
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (fieldName, value) => {
    setProfileData(prev => ({ ...prev, [fieldName]: value }));
  };

  // Calculate profile completeness
  const filledCount = fields.filter(f => {
    const v = profileData[f.name];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== '';
  }).length;
  const completeness = fields.length ? Math.round((filledCount / fields.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin" style={{ color: '#D5AA5B' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: persona?.color ? `${persona.color}15` : '#D5AA5B15' }}>
            <User size={20} style={{ color: persona?.color || '#D5AA5B' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>My Profile</h1>
            <p className="text-xs" style={{ color: '#6b7280' }}>
              {persona?.label || user?.role} Profile
            </p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: '#D5AA5B', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#c49a4a'}
          onMouseLeave={e => e.currentTarget.style.background = '#D5AA5B'}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Completeness bar */}
      <div className="rounded-xl p-4 mb-6" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: '#374151' }}>Profile Completeness</span>
          <span className="text-xs font-bold" style={{ color: completeness === 100 ? '#16a34a' : '#D5AA5B' }}>
            {completeness}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: '#f3f4f6' }}>
          <div className="h-2 rounded-full transition-all" style={{
            width: `${completeness}%`,
            background: completeness === 100 ? '#16a34a' : '#D5AA5B',
          }} />
        </div>
        {completeness < 100 && (
          <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
            Complete your profile to get discovered by the ecosystem.
          </p>
        )}
      </div>

      {/* Profile form */}
      <div className="rounded-xl p-6" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <div key={field.name} className={field.type === 'textarea' || field.type === 'tags' || field.type === 'multiselect' ? 'md:col-span-2' : ''}>
              <FormField field={field} value={profileData[field.name]}
                onChange={val => updateField(field.name, val)} />
            </div>
          ))}
        </div>

        {/* Bottom save */}
        <div className="flex justify-end mt-6 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#D5AA5B', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = '#c49a4a'}
            onMouseLeave={e => e.currentTarget.style.background = '#D5AA5B'}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
