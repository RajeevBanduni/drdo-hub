import { useState, useEffect } from 'react';
import { corporateAPI } from '../../services/api';
import { Handshake, Loader2, ChevronRight, Clock, Rocket, Plus, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';

const G = '#D5AA5B';
const card = { background: '#fff', border: '1px solid #eee', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

const STAGES = [
  { key: 'exploring', label: 'Exploring', color: '#3b82f6', bg: '#eff6ff' },
  { key: 'poc',       label: 'PoC',       color: '#f59e0b', bg: '#fefce8' },
  { key: 'pilot',     label: 'Pilot',     color: '#8b5cf6', bg: '#faf5ff' },
  { key: 'scaling',   label: 'Scaling',   color: '#16a34a', bg: '#f0fdf4' },
  { key: 'completed', label: 'Completed', color: '#6b7280', bg: '#f3f4f6' },
];

export default function CorporateCollaborations() {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const d = await corporateAPI.listCollabs(); setCollabs(d); }
    catch { toast.error('Failed to load collaborations'); }
    finally { setLoading(false); }
  };

  const moveToStage = async (id, newStatus) => {
    try {
      await corporateAPI.updateCollab(id, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const saveNotes = async (id) => {
    try {
      await corporateAPI.updateCollab(id, { notes: editNotes });
      toast.success('Notes saved');
      setEditing(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Loader2 size={28} className="animate-spin" style={{ color: G }} /></div>;

  const grouped = {};
  STAGES.forEach(s => { grouped[s.key] = collabs.filter(c => c.status === s.key); });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          <Handshake size={20} style={{ verticalAlign: -3, marginRight: 8, color: G }} />Collaborations
        </h1>
        <span style={{ fontSize: 12, color: '#888' }}>{collabs.length} total</span>
      </div>

      {collabs.length === 0 ? (
        <div style={{ ...card, padding: 40, textAlign: 'center' }}>
          <Handshake size={32} style={{ color: '#ddd', marginBottom: 10 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>No collaborations yet</p>
          <p style={{ fontSize: 12, color: '#aaa' }}>Start a collaboration from the Startup Search page</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 12, overflowX: 'auto' }}>
          {STAGES.map(stage => (
            <div key={stage.key}>
              {/* Column header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '8px 12px', borderRadius: 10, background: stage.bg }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>{stage.label}</span>
                <span style={{ fontSize: 11, color: '#999', marginLeft: 'auto' }}>{grouped[stage.key]?.length || 0}</span>
              </div>

              {/* Cards */}
              <div style={{ display: 'grid', gap: 8 }}>
                {(grouped[stage.key] || []).map(co => (
                  <div key={co.id} style={{ ...card, padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${G}12`, color: G, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {(co.startup_name || co.title || '?')[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {co.startup_name || 'Unknown Startup'}
                        </div>
                        {co.title && <div style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{co.title}</div>}
                      </div>
                    </div>

                    {co.sector && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: '#eff6ff', color: '#2563eb' }}>{co.sector}</span>}

                    {/* Notes */}
                    {editing === co.id ? (
                      <div style={{ marginTop: 8 }}>
                        <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2}
                          style={{ width: '100%', padding: 8, fontSize: 11, border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none', resize: 'vertical' }} />
                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                          <button onClick={() => saveNotes(co.id)} style={{ flex: 1, padding: '4px', fontSize: 10, borderRadius: 6, background: G, color: '#fff', border: 'none', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditing(null)} style={{ padding: '4px 8px', fontSize: 10, borderRadius: 6, background: '#f3f4f6', color: '#666', border: 'none', cursor: 'pointer' }}><X size={10} /></button>
                        </div>
                      </div>
                    ) : (
                      co.notes && <p style={{ fontSize: 10, color: '#888', marginTop: 6, lineHeight: 1.4 }}>{co.notes}</p>
                    )}

                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 6 }}>
                      <Clock size={10} style={{ verticalAlign: -1 }} /> {new Date(co.started_at || co.updated_at).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      <button onClick={() => { setEditing(co.id); setEditNotes(co.notes || ''); }}
                        style={{ padding: '3px 8px', fontSize: 10, borderRadius: 6, background: '#f9fafb', color: '#666', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                        <Edit3 size={10} /> Notes
                      </button>
                      {/* Move forward button */}
                      {stage.key !== 'completed' && (
                        <button onClick={() => {
                          const idx = STAGES.findIndex(s => s.key === stage.key);
                          if (idx < STAGES.length - 1) moveToStage(co.id, STAGES[idx + 1].key);
                        }}
                          style={{ flex: 1, padding: '3px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6, background: `${STAGES[STAGES.findIndex(s => s.key === stage.key) + 1]?.bg || '#f3f4f6'}`, color: STAGES[STAGES.findIndex(s => s.key === stage.key) + 1]?.color || '#666', border: 'none', cursor: 'pointer' }}>
                          Move to {STAGES[STAGES.findIndex(s => s.key === stage.key) + 1]?.label} <ChevronRight size={10} style={{ verticalAlign: -1 }} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
