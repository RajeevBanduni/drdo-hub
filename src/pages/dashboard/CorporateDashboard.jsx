import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { corporateAPI } from '../../services/api';
import {
  Building2, FolderKanban, Target, Link2, Star, Users,
  Search, Plus, ArrowRight, Loader2, TrendingUp, Clock,
  CheckCircle, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const G = '#D5AA5B';
const card = { background: '#fff', border: '1px solid #eee', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

const STATUS_COLORS = {
  applied: { bg: '#eff6ff', color: '#2563eb', label: 'Applied' },
  shortlisted: { bg: '#fefce8', color: '#ca8a04', label: 'Shortlisted' },
  selected: { bg: '#f0fdf4', color: '#16a34a', label: 'Selected' },
  rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
  evaluating: { bg: '#faf5ff', color: '#7c3aed', label: 'Evaluating' },
};

const COLLAB_COLORS = {
  exploring: '#3b82f6', poc: '#f59e0b', pilot: '#8b5cf6', scaling: '#16a34a', completed: '#6b7280',
};

export default function CorporateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const d = await corporateAPI.dashboard();
      setData(d);
    } catch (err) { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Loader2 size={28} className="animate-spin" style={{ color: G }} /></div>;

  const collabs = data?.collaborations || {};
  const stats = [
    { label: 'My Projects', value: data?.projects || 0, icon: FolderKanban, color: '#3b82f6', to: '/dashboard/projects' },
    { label: 'Active Challenges', value: data?.challenges?.active || 0, icon: Target, color: G, to: '/dashboard/corporate/challenges' },
    { label: 'Collaborations', value: parseInt(collabs.total) || 0, icon: Link2, color: '#16a34a', to: '/dashboard/corporate/collabs' },
    { label: 'Watchlists', value: data?.watchlists || 0, icon: Star, color: '#f59e0b', to: '/dashboard/watchlist' },
    { label: 'Applications', value: data?.recent_applications?.length || 0, icon: Users, color: '#8b5cf6', to: '/dashboard/corporate/challenges' },
  ];

  const quickActions = [
    { label: 'Find Startups', desc: 'Search by sector, technology, use case', icon: Search, to: '/dashboard/corporate/search', color: G },
    { label: 'Launch Challenge', desc: 'Post innovation requirements', icon: Plus, to: '/dashboard/corporate/challenges', color: '#16a34a' },
    { label: 'View Collaborations', desc: 'Track startup partnerships', icon: Link2, to: '/dashboard/corporate/collabs', color: '#3b82f6' },
    { label: 'My Watchlist', desc: 'Curated startup lists', icon: Star, to: '/dashboard/watchlist', color: '#f59e0b' },
  ];

  // Collaboration pipeline data
  const pipeline = [
    { label: 'Exploring', count: parseInt(collabs.exploring) || 0, color: COLLAB_COLORS.exploring },
    { label: 'PoC', count: parseInt(collabs.poc) || 0, color: COLLAB_COLORS.poc },
    { label: 'Pilot', count: parseInt(collabs.pilot) || 0, color: COLLAB_COLORS.pilot },
    { label: 'Scaling', count: parseInt(collabs.scaling) || 0, color: COLLAB_COLORS.scaling },
    { label: 'Completed', count: parseInt(collabs.completed) || 0, color: COLLAB_COLORS.completed },
  ];
  const pipelineMax = Math.max(...pipeline.map(p => p.count), 1);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome */}
      <div style={{ ...card, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#16a34a15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building2 size={22} style={{ color: '#16a34a' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
            Welcome, {user?.organization_name || user?.name}
          </h1>
          <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Corporate Innovation Dashboard</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: 18, cursor: 'pointer' }} onClick={() => navigate(s.to)}
            onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Quick Actions */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {quickActions.map(a => (
              <div key={a.label} style={{ ...card, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                onClick={() => navigate(a.to)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.background = '#fff'; }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <a.icon size={17} style={{ color: a.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{a.desc}</div>
                </div>
                <ArrowRight size={14} style={{ color: '#ccc' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Pipeline */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Collaboration Pipeline</h2>
          <div style={{ ...card, padding: 18 }}>
            {pipeline.map(p => (
              <div key={p.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>{p.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.count}</span>
                </div>
                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                  <div style={{ height: 8, borderRadius: 4, background: p.color, width: `${(p.count / pipelineMax) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Applications */}
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 12, marginTop: 20 }}>Recent Applications</h2>
          <div style={{ ...card, padding: 0 }}>
            {(data?.recent_applications || []).length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>No applications yet</div>
            ) : (
              (data?.recent_applications || []).slice(0, 5).map((app, i) => (
                <div key={app.id} style={{ padding: '12px 16px', borderBottom: i < 4 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${(STATUS_COLORS[app.status] || STATUS_COLORS.applied).bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {app.status === 'selected' ? <CheckCircle size={13} style={{ color: '#16a34a' }} /> : <Clock size={13} style={{ color: '#888' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.applicant_name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.challenge_title}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: (STATUS_COLORS[app.status] || STATUS_COLORS.applied).bg, color: (STATUS_COLORS[app.status] || STATUS_COLORS.applied).color }}>
                    {(STATUS_COLORS[app.status] || STATUS_COLORS.applied).label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
