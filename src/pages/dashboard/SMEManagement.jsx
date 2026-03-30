import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Users, Plus, Search, Star, Mail, Phone, Briefcase,
  ChevronRight, Filter, Award, Globe, BookOpen,
  CheckCircle2, Clock, Tag, MessageSquare, Calendar,
  Building2, GraduationCap, X, Linkedin,
} from 'lucide-react';
import { smeAPI } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const G = '#D5AA5B';
const GH = '#C9983F';

const card = {
  background: '#ffffff',
  border: '1px solid #eeeeee',
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const DOMAINS = ['AI / ML', 'Quantum Tech', 'Cybersecurity', 'UAV / Drones', 'Biodefence', 'Nanotechnology', 'Space Tech', 'Electronics', 'Materials Science', 'Robotics'];

const normalizeAvailability = (a) => {
  if (!a) return 'Available';
  const map = { available: 'Available', busy: 'Busy', on_leave: 'Inactive', inactive: 'Inactive' };
  return map[a.toLowerCase()] || a.charAt(0).toUpperCase() + a.slice(1);
};

const AVAIL_STYLE = {
  Available: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  Busy:      { bg: '#fff8ec', color: G,          border: 'rgba(213,170,91,0.4)' },
  Inactive:  { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

const TYPE_STYLE = {
  Academic:        { bg: '#f0f9ff', color: '#0284c7' },
  'DRDO Scientist':{ bg: '#fdf4ff', color: '#9333ea' },
  Industry:        { bg: '#fff8ec', color: G },
  'Defence Veteran':{ bg: '#fef2f2', color: '#dc2626' },
};

export default function SMEManagement() {
  const [experts, setExperts]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [typeFilter, setTypeFilter]     = useState('All');
  const [availFilter, setAvailFilter]   = useState('All');

  useEffect(() => {
    smeAPI.list()
      .then(data => {
        const raw = data.experts || data || [];
        setExperts(raw.map(e => ({
          ...e,
          title: e.designation || e.title || '—',
          domain: (e.domains && e.domains[0]) || e.domain || '—',
          subDomains: (e.domains || []).slice(1),
          org: e.organisation || e.org || '—',
          type: e.type || 'Academic',
          availability: normalizeAvailability(e.availability),
          rating: Number(e.rating) || 0,
          reviewsCount: 0,
          engagements: Number(e.engagements) || 0,
          publications: Number(e.publications) || 0,
          bio: e.bio || '',
          assignedTo: e.assignedTo || [],
          expertise: (e.domains || []),
        })));
      })
      .catch(err => toast.error(err.message || 'Failed to load experts'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = experts.filter(e => {
    const matchSearch = (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (e.domain || '').toLowerCase().includes(search.toLowerCase()) ||
                        (e.expertise || []).some(x => x.toLowerCase().includes(search.toLowerCase()));
    const matchDomain = domainFilter === 'All' || e.domain === domainFilter;
    const matchType   = typeFilter === 'All' || e.type === typeFilter;
    const matchAvail  = availFilter === 'All' || e.availability === availFilter;
    return matchSearch && matchDomain && matchType && matchAvail;
  });

  if (loading) return <LoadingSkeleton type="card" />;

  if (selected) return <ExpertDetail expert={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ padding: 28, maxWidth: 1200, background: '#f5f5f5', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>Subject Matter Experts</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>Ecosystem collaboration — academics, industry leaders and defence veterans mentoring DRDO startups</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: G, color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 10px rgba(213,170,91,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.background = GH}
          onMouseLeave={e => e.currentTarget.style.background = G}
        >
          <Plus size={14} /> Add Expert
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Experts',  value: experts.length, icon: Users, bg: '#fff8ec', fg: G },
          { label: 'Available',      value: experts.filter(e => e.availability === 'Available').length, icon: CheckCircle2, bg: '#f0fdf4', fg: '#16a34a' },
          { label: 'Engagements',    value: experts.reduce((s, e) => s + e.engagements, 0), icon: Briefcase, bg: '#f0f9ff', fg: '#0284c7' },
          { label: 'Avg Rating',     value: experts.length > 0 ? (experts.reduce((s, e) => s + e.rating, 0) / experts.length).toFixed(1) : '0.0', icon: Star, bg: '#fdf4ff', fg: '#9333ea' },
        ].map(({ label, value, icon: Icon, bg, fg }) => (
          <div key={label} style={{ ...card, padding: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon size={15} color={fg} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input placeholder="Search by name, domain, expertise…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 30, paddingRight: 12, paddingTop: 9, paddingBottom: 9, background: '#fff', border: '1.5px solid #eee', borderRadius: 9, fontSize: 13, outline: 'none', color: '#1a1a1a' }}
          />
        </div>
        <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)}
          style={{ padding: '8px 12px', background: '#fff', border: '1.5px solid #eee', borderRadius: 9, fontSize: 12, color: '#555', outline: 'none', cursor: 'pointer' }}
        >
          <option value="All">All Domains</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '8px 12px', background: '#fff', border: '1.5px solid #eee', borderRadius: 9, fontSize: 12, color: '#555', outline: 'none', cursor: 'pointer' }}
        >
          <option value="All">All Types</option>
          {['Academic', 'DRDO Scientist', 'Industry', 'Defence Veteran'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {['All', 'Available', 'Busy'].map(a => (
          <button key={a} onClick={() => setAvailFilter(a)} style={{
            padding: '7px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1.5px solid', cursor: 'pointer',
            background: availFilter === a ? G : '#fff', color: availFilter === a ? '#fff' : '#666', borderColor: availFilter === a ? G : '#eee',
          }}>{a}</button>
        ))}
      </div>

      {/* Expert cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map(expert => {
          const av = AVAIL_STYLE[expert.availability] || AVAIL_STYLE['Inactive'];
          const tv = TYPE_STYLE[expert.type] || TYPE_STYLE['Industry'];
          return (
            <div key={expert.id}
              onClick={() => setSelected(expert)}
              style={{ ...card, padding: 22, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
            >
              <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(213,170,91,0.12)', color: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, border: '2px solid rgba(213,170,91,0.25)', flexShrink: 0 }}>
                  {expert.name.split(' ').slice(-1)[0][0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>{expert.name}</div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{expert.title}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 20, background: tv.bg, color: tv.color, border: `1px solid ${tv.color}22` }}>{expert.type}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 20, background: av.bg, color: av.color, border: `1px solid ${av.border}` }}>{expert.availability}</span>
                  </div>
                </div>
              </div>

              {/* Domain & org */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555', marginBottom: 6 }}>
                <Tag size={11} color="#aaa" /><strong>{expert.domain}</strong> · {expert.org}
              </div>

              {/* Expertise tags */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                {expert.expertise.slice(0, 3).map(e => (
                  <span key={e} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#f5f5f5', color: '#888', border: '1px solid #eee' }}>{e}</span>
                ))}
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: G, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={11} style={{ fill: G, color: G }} />{expert.rating}
                  </div>
                  <div style={{ fontSize: 10, color: '#aaa' }}>{expert.reviewsCount} reviews</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{expert.engagements}</div>
                  <div style={{ fontSize: 10, color: '#aaa' }}>Engagements</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{expert.publications}</div>
                  <div style={{ fontSize: 10, color: '#aaa' }}>Publications</div>
                </div>
                {expert.assignedTo.length > 0 && (
                  <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: 10, color: '#aaa', marginBottom: 3 }}>Mentoring</div>
                    {expert.assignedTo.slice(0, 2).map(s => (
                      <span key={s} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 20, background: '#fff8ec', color: G, border: '1px solid rgba(213,170,91,0.3)', marginBottom: 2 }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', ...card, padding: 48, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
            No experts found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}

function ExpertDetail({ expert: e, onBack }) {
  const av = AVAIL_STYLE[e.availability] || AVAIL_STYLE['Inactive'];
  const tv = TYPE_STYLE[e.type] || TYPE_STYLE['Industry'];

  return (
    <div style={{ padding: 28, maxWidth: 900, background: '#f5f5f5', minHeight: '100%' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, color: G, fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
        ← Experts
      </button>

      {/* Profile header */}
      <div style={{ ...card, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(213,170,91,0.12)', color: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26, border: '2.5px solid rgba(213,170,91,0.3)', flexShrink: 0 }}>
            {e.name.split(' ').slice(-1)[0][0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: '0 0 4px', color: '#1a1a1a', fontSize: 20, fontWeight: 800 }}>{e.name}</h1>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>{e.title} · {e.org}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: tv.bg, color: tv.color, border: `1px solid ${tv.color}22` }}>{e.type}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: av.bg, color: av.color, border: `1px solid ${av.border}` }}>{e.availability}</span>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#fff8ec', color: G, border: '1px solid rgba(213,170,91,0.3)' }}>{e.domain}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px 16px', background: G, color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MessageSquare size={12} /> Message
            </button>
            <button style={{ padding: '8px 16px', background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} /> Schedule
            </button>
          </div>
        </div>

        <p style={{ margin: '18px 0 0', color: '#555', fontSize: 13, lineHeight: 1.7 }}>{e.bio}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginTop: 22 }}>
          {[
            { label: 'Rating',       value: `${e.rating}/5`, sub: `${e.reviewsCount} reviews` },
            { label: 'Engagements',  value: e.engagements,   sub: 'total sessions' },
            { label: 'Publications', value: e.publications,  sub: 'papers/articles' },
            { label: 'Mentoring',    value: e.assignedTo.length, sub: 'startups' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ textAlign: 'center', padding: '14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Expertise */}
          <div style={{ ...card, padding: 22 }}>
            <h3 style={{ margin: '0 0 14px', color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>Areas of Expertise</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[...e.expertise, ...e.subDomains].map(ex => (
                <span key={ex} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#fff8ec', color: G, border: '1px solid rgba(213,170,91,0.3)' }}>{ex}</span>
              ))}
            </div>
          </div>
          {/* Current assignments */}
          <div style={{ ...card, padding: 22 }}>
            <h3 style={{ margin: '0 0 14px', color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>Currently Mentoring</h3>
            {e.assignedTo.length === 0
              ? <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>Not currently assigned to any startup.</p>
              : e.assignedTo.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(213,170,91,0.12)', color: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, border: '1px solid rgba(213,170,91,0.2)', flexShrink: 0 }}>{s[0]}</div>
                  <span style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{s}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Active</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Contact */}
        <div style={{ ...card, padding: 20, alignSelf: 'start' }}>
          <h3 style={{ margin: '0 0 14px', color: '#1a1a1a', fontSize: 13, fontWeight: 700 }}>Contact</h3>
          {[
            { icon: Mail,     label: 'Email',  value: e.email },
            { icon: Phone,    label: 'Phone',  value: e.phone },
            { icon: Building2,label: 'Org',   value: e.org },
            { icon: Globe,    label: 'Domain', value: e.domain },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={12} color={G} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#aaa' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 500 }}>{value}</div>
              </div>
            </div>
          ))}
          <button style={{ width: '100%', marginTop: 14, padding: '9px 0', background: G, color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <MessageSquare size={13} /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

