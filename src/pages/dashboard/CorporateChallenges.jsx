import { useState, useEffect } from 'react';
import { corporateAPI } from '../../services/api';
import {
  Target, Plus, ChevronLeft, Clock, CheckCircle, XCircle,
  Users, Loader2, Calendar, DollarSign, AlertCircle, Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const G = '#D5AA5B';
const card = { background: '#fff', border: '1px solid #eee', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

const STATUS_STYLE = {
  draft:     { bg: '#f3f4f6', color: '#6b7280', label: 'Draft' },
  open:      { bg: '#eff6ff', color: '#2563eb', label: 'Open' },
  reviewing: { bg: '#fefce8', color: '#ca8a04', label: 'Reviewing' },
  closed:    { bg: '#f3f4f6', color: '#6b7280', label: 'Closed' },
  awarded:   { bg: '#f0fdf4', color: '#16a34a', label: 'Awarded' },
};

const APP_STATUS = {
  applied:     { bg: '#eff6ff', color: '#2563eb', label: 'Applied' },
  shortlisted: { bg: '#fefce8', color: '#ca8a04', label: 'Shortlisted' },
  evaluating:  { bg: '#faf5ff', color: '#7c3aed', label: 'Evaluating' },
  selected:    { bg: '#f0fdf4', color: '#16a34a', label: 'Selected' },
  rejected:    { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
};

export default function CorporateChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', budget_range: '', timeline: '', deadline: '', sectors: [], functions: [], technologies: [], usecases: [], requirements: '' });
  const [saving, setSaving] = useState(false);
  const [taxonomy, setTaxonomy] = useState({ sectors: [], functions: [], technologies: [], usecases: [] });

  useEffect(() => { load(); loadTaxonomy(); }, []);

  const load = async () => {
    try { const d = await corporateAPI.listChallenges(); setChallenges(d); }
    catch { toast.error('Failed to load challenges'); }
    finally { setLoading(false); }
  };

  const loadTaxonomy = async () => {
    try { const d = await corporateAPI.getTaxonomy(); setTaxonomy(d); } catch {}
  };

  const loadDetail = async (id) => {
    try { const d = await corporateAPI.getChallenge(id); setDetail(d); setSelected(id); }
    catch { toast.error('Failed to load challenge'); }
  };

  const create = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      await corporateAPI.createChallenge(form);
      toast.success('Challenge created');
      setShowCreate(false);
      setForm({ title: '', description: '', budget_range: '', timeline: '', deadline: '', sectors: [], functions: [], technologies: [], usecases: [], requirements: '' });
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      await corporateAPI.updateApplication(selected, appId, { status });
      toast.success(`Application ${status}`);
      loadDetail(selected);
    } catch (err) { toast.error(err.message); }
  };

  const toggleTag = (field, val) => {
    setForm(p => ({
      ...p,
      [field]: p[field].includes(val) ? p[field].filter(v => v !== val) : [...p[field], val],
    }));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Loader2 size={28} className="animate-spin" style={{ color: G }} /></div>;

  // Detail view
  if (selected && detail) {
    const st = STATUS_STYLE[detail.status] || STATUS_STYLE.open;
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => { setSelected(null); setDetail(null); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
          <ChevronLeft size={16} /> Back to Challenges
        </button>

        <div style={{ ...card, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{detail.title}</h2>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color }}>{st.label}</span>
          </div>
          {detail.description && <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 12 }}>{detail.description}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#666' }}>
            {detail.budget_range && <span><DollarSign size={12} style={{ verticalAlign: -2 }} /> {detail.budget_range}</span>}
            {detail.timeline && <span><Clock size={12} style={{ verticalAlign: -2 }} /> {detail.timeline}</span>}
            {detail.deadline && <span><Calendar size={12} style={{ verticalAlign: -2 }} /> Deadline: {new Date(detail.deadline).toLocaleDateString()}</span>}
          </div>
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
            {(detail.sectors || []).map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#eff6ff', color: '#2563eb' }}>{t}</span>)}
            {(detail.technologies || []).map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#fefce8', color: '#ca8a04' }}>{t}</span>)}
            {(detail.usecases || []).map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a' }}>{t}</span>)}
          </div>
        </div>

        {/* Applications */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
          Applications ({(detail.applications || []).length})
        </h3>
        {(detail.applications || []).length === 0 ? (
          <div style={{ ...card, padding: 30, textAlign: 'center', color: '#999', fontSize: 13 }}>No applications yet</div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {(detail.applications || []).map(app => {
              const as = APP_STATUS[app.status] || APP_STATUS.applied;
              return (
                <div key={app.id} style={{ ...card, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{app.startup_name || app.applicant_name}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{app.applicant_email} {app.sector ? `| ${app.sector}` : ''} {app.stage ? `| ${app.stage}` : ''}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: as.bg, color: as.color }}>{as.label}</span>
                  </div>
                  {app.pitch && <p style={{ fontSize: 12, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>{app.pitch}</p>}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {app.status === 'applied' && (
                      <>
                        <button onClick={() => updateAppStatus(app.id, 'shortlisted')} style={{ padding: '5px 12px', fontSize: 11, fontWeight: 600, borderRadius: 7, background: '#fefce815', color: '#ca8a04', border: '1px solid #fde68a', cursor: 'pointer' }}>
                          <Star size={11} style={{ verticalAlign: -2 }} /> Shortlist
                        </button>
                        <button onClick={() => updateAppStatus(app.id, 'rejected')} style={{ padding: '5px 12px', fontSize: 11, borderRadius: 7, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer' }}>
                          Reject
                        </button>
                      </>
                    )}
                    {app.status === 'shortlisted' && (
                      <button onClick={() => updateAppStatus(app.id, 'selected')} style={{ padding: '5px 12px', fontSize: 11, fontWeight: 600, borderRadius: 7, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', cursor: 'pointer' }}>
                        <CheckCircle size={11} style={{ verticalAlign: -2 }} /> Select
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // List + Create
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          <Target size={20} style={{ verticalAlign: -3, marginRight: 8, color: G }} />Innovation Challenges
        </h1>
        <button onClick={() => setShowCreate(!showCreate)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, borderRadius: 8, background: G, color: '#fff', border: 'none', cursor: 'pointer' }}>
          <Plus size={15} /> New Challenge
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ ...card, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 14 }}>Create Innovation Challenge</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <input placeholder="Challenge title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              style={{ padding: '10px 14px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#f9fafb' }} />
            <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              style={{ padding: '10px 14px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#f9fafb', resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <input placeholder="Budget range" value={form.budget_range} onChange={e => setForm(p => ({ ...p, budget_range: e.target.value }))}
                style={{ padding: '10px 14px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#f9fafb' }} />
              <input placeholder="Timeline" value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
                style={{ padding: '10px 14px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#f9fafb' }} />
              <input type="date" placeholder="Deadline" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                style={{ padding: '10px 14px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#f9fafb' }} />
            </div>
            <textarea placeholder="Detailed requirements" rows={2} value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
              style={{ padding: '10px 14px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#f9fafb', resize: 'vertical' }} />

            {/* Taxonomy selectors */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4, display: 'block' }}>Sectors</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {taxonomy.sectors.map(s => (
                  <button key={s.id} onClick={() => toggleTag('sectors', s.name)} type="button"
                    style={{ padding: '3px 10px', fontSize: 11, borderRadius: 20, border: `1px solid ${form.sectors.includes(s.name) ? '#2563eb' : '#e5e7eb'}`, background: form.sectors.includes(s.name) ? '#eff6ff' : '#fff', color: form.sectors.includes(s.name) ? '#2563eb' : '#666', cursor: 'pointer' }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4, display: 'block' }}>Technologies</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {taxonomy.technologies.filter(t => t.level === 0).map(t => (
                  <button key={t.id} onClick={() => toggleTag('technologies', t.name)} type="button"
                    style={{ padding: '3px 10px', fontSize: 11, borderRadius: 20, border: `1px solid ${form.technologies.includes(t.name) ? '#ca8a04' : '#e5e7eb'}`, background: form.technologies.includes(t.name) ? '#fefce8' : '#fff', color: form.technologies.includes(t.name) ? '#ca8a04' : '#666', cursor: 'pointer' }}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4, display: 'block' }}>Use Cases</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {taxonomy.usecases.map(u => (
                  <button key={u.id} onClick={() => toggleTag('usecases', u.name)} type="button"
                    style={{ padding: '3px 10px', fontSize: 11, borderRadius: 20, border: `1px solid ${form.usecases.includes(u.name) ? '#16a34a' : '#e5e7eb'}`, background: form.usecases.includes(u.name) ? '#f0fdf4' : '#fff', color: form.usecases.includes(u.name) ? '#16a34a' : '#666', cursor: 'pointer' }}>
                    {u.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8, background: '#f3f4f6', color: '#555', border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button onClick={create} disabled={saving} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, borderRadius: 8, background: G, color: '#fff', border: 'none', cursor: 'pointer' }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : 'Create Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge list */}
      {challenges.length === 0 ? (
        <div style={{ ...card, padding: 40, textAlign: 'center' }}>
          <Target size={32} style={{ color: '#ddd', marginBottom: 10 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>No challenges yet</p>
          <p style={{ fontSize: 12, color: '#aaa' }}>Launch your first innovation challenge</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {challenges.map(ch => {
            const st = STATUS_STYLE[ch.status] || STATUS_STYLE.open;
            return (
              <div key={ch.id} style={{ ...card, padding: 16, cursor: 'pointer' }}
                onClick={() => loadDetail(ch.id)}
                onMouseEnter={e => e.currentTarget.style.borderColor = G}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{ch.title}</h3>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color }}>{st.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#888' }}>
                  <span><Users size={11} style={{ verticalAlign: -2 }} /> {parseInt(ch.application_count) || 0} applications</span>
                  {ch.budget_range && <span><DollarSign size={11} style={{ verticalAlign: -2 }} /> {ch.budget_range}</span>}
                  {ch.deadline && <span><Calendar size={11} style={{ verticalAlign: -2 }} /> {new Date(ch.deadline).toLocaleDateString()}</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {(ch.sectors || []).map(t => <span key={t} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: '#eff6ff', color: '#2563eb' }}>{t}</span>)}
                  {(ch.technologies || []).map(t => <span key={t} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: '#fefce8', color: '#ca8a04' }}>{t}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
