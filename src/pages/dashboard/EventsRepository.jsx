import { useState } from 'react';
import {
  Calendar, MapPin, Users, Plus, Search, Filter,
  ChevronRight, Clock, Tag, ExternalLink, Download,
  Mic, Trophy, BookOpen, Zap, Globe, Video,
  CheckCircle2, AlertCircle, ArrowRight, X,
} from 'lucide-react';

const G = '#D5AA5B';
const GH = '#C9983F';

const card = {
  background: '#ffffff',
  border: '1px solid #eeeeee',
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const EVENT_TYPES = {
  hackathon:   { label: 'Hackathon',    color: '#7c3aed', bg: '#f5f3ff', icon: Zap },
  workshop:    { label: 'Workshop',     color: '#0284c7', bg: '#f0f9ff', icon: BookOpen },
  conference:  { label: 'Conference',   color: '#16a34a', bg: '#f0fdf4', icon: Mic },
  demo_day:    { label: 'Demo Day',     color: G,          bg: '#fff8ec', icon: Trophy },
  webinar:     { label: 'Webinar',      color: '#ea580c', bg: '#fff7ed', icon: Video },
  networking:  { label: 'Networking',   color: '#dc2626', bg: '#fef2f2', icon: Users },
};

const STATUS_STYLE = {
  Upcoming:   { bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' },
  Live:       { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  Completed:  { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  Cancelled:  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const EVENTS = [
  {
    id: 1,
    title: 'DRDO DeepTech Hackathon 2025',
    type: 'hackathon',
    status: 'Upcoming',
    date: '15 May 2025',
    endDate: '17 May 2025',
    location: 'DRDO Bhawan, New Delhi',
    mode: 'In-Person',
    organiser: 'DRDO Innovation Hub',
    registrations: 142,
    capacity: 200,
    description: 'A 3-day intensive hackathon challenging startups to solve DRDO\'s priority problem statements across AI, cyber defence, quantum, and space tech domains.',
    tags: ['deeptech', 'AI', 'quantum', 'defence'],
    agenda: [
      { time: '09:00 AM', title: 'Inauguration & Problem Statement Release' },
      { time: '10:00 AM', title: 'Team Formation & Ideation' },
      { time: '06:00 PM', title: 'Day 1 Check-in' },
      { time: 'Day 2',   title: 'Build Phase & Mentoring Sessions' },
      { time: 'Day 3',   title: 'Demo Day & Award Ceremony' },
    ],
    speakers: ['Dr. A. Kapoor', 'Dr. R. Sharma', 'Guest – IIT Delhi'],
  },
  {
    id: 2,
    title: 'OpenI Startup Evaluation Workshop',
    type: 'workshop',
    status: 'Upcoming',
    date: '28 Apr 2025',
    endDate: '28 Apr 2025',
    location: 'Virtual (MS Teams)',
    mode: 'Online',
    organiser: 'OpenI Assessment Cell',
    registrations: 34,
    capacity: 50,
    description: 'Training workshop for DRDO evaluators on the OpenI 8-Vector Assessment Framework. Covers scoring methodology, calibration, and report generation.',
    tags: ['training', 'evaluation', 'OpenI'],
    agenda: [
      { time: '10:00 AM', title: 'Introduction to OpenI Framework' },
      { time: '11:30 AM', title: 'Live Scoring Walkthrough' },
      { time: '02:00 PM', title: 'Calibration Exercise' },
      { time: '04:00 PM', title: 'Q&A and Close' },
    ],
    speakers: ['Dr. S. Mehta', 'OpenI Team'],
  },
  {
    id: 3,
    title: 'DRDO–Startup Demo Day Q1 2025',
    type: 'demo_day',
    status: 'Completed',
    date: '15 Mar 2025',
    endDate: '15 Mar 2025',
    location: 'DRDO HQ, New Delhi',
    mode: 'In-Person',
    organiser: 'DRDO Innovation Hub',
    registrations: 68,
    capacity: 80,
    description: 'Quarterly demo day where shortlisted startups present their prototypes and progress updates to DRDO directors and potential partners.',
    tags: ['demo', 'Q1-2025', 'prototype'],
    agenda: [
      { time: '09:30 AM', title: 'Opening Remarks' },
      { time: '10:00 AM', title: 'Startup Demos (ArmorTech AI, DroneShield, QuantumDefense)' },
      { time: '12:30 PM', title: 'Panel Discussion' },
      { time: '02:00 PM', title: 'Networking Lunch' },
    ],
    speakers: ['Dr. P. Nair', 'Director DRDO', 'CTO Panel'],
  },
  {
    id: 4,
    title: 'Cybersecurity Landscape – DRDO Webinar',
    type: 'webinar',
    status: 'Completed',
    date: '10 Mar 2025',
    endDate: '10 Mar 2025',
    location: 'Virtual (Zoom)',
    mode: 'Online',
    organiser: 'DRDO Cyber Cell',
    registrations: 210,
    capacity: 500,
    description: 'A webinar covering the emerging cybersecurity threat landscape for defence systems and the role of startups in building resilient solutions.',
    tags: ['cyber', 'webinar', 'threat-intel'],
    agenda: [
      { time: '11:00 AM', title: 'Keynote: Cyber Threats in 2025' },
      { time: '12:00 PM', title: 'Startup Spotlight: CyberSentinel' },
      { time: '12:30 PM', title: 'Open Q&A' },
    ],
    speakers: ['Dr. S. Mehta', 'CyberSentinel CEO'],
  },
  {
    id: 5,
    title: 'Quantum Technology Conclave 2025',
    type: 'conference',
    status: 'Upcoming',
    date: '20 Jun 2025',
    endDate: '21 Jun 2025',
    location: 'IIT Delhi, New Delhi',
    mode: 'Hybrid',
    organiser: 'DRDO + IIT Delhi + DST',
    registrations: 290,
    capacity: 400,
    description: 'India\'s premier quantum technology conference bringing together DRDO, academia, startups, and international experts to discuss QKD, quantum computing, and quantum sensing for defence.',
    tags: ['quantum', 'conference', 'international'],
    agenda: [
      { time: 'Day 1', title: 'Research Presentations & Panel Discussions' },
      { time: 'Day 2', title: 'Startup Showcase & Policy Roundtable' },
    ],
    speakers: ['Dr. A. Kapoor', 'Prof. IIT Delhi', 'ISRO rep', 'International Expert – MIT'],
  },
  {
    id: 6,
    title: 'DRDO Startup Networking – Bangalore',
    type: 'networking',
    status: 'Upcoming',
    date: '05 May 2025',
    endDate: '05 May 2025',
    location: 'DRDO-CABS, Bangalore',
    mode: 'In-Person',
    organiser: 'DRDO Innovation Hub',
    registrations: 55,
    capacity: 75,
    description: 'An informal networking session connecting DRDO scientists with Bangalore-based defence tech startups. Focus sectors: aerospace, robotics, and AI.',
    tags: ['networking', 'bangalore', 'aerospace'],
    agenda: [
      { time: '06:00 PM', title: 'Welcome & Icebreakers' },
      { time: '07:00 PM', title: 'Speed Pitches (2 min each)' },
      { time: '08:00 PM', title: 'Open Networking' },
    ],
    speakers: ['DRDO-CABS Director'],
  },
];

export default function EventsRepository() {
  const [view, setView]         = useState('grid');   // 'grid' | 'list' | 'calendar'
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = EVENTS.filter(e => {
    const matchType   = typeFilter === 'All' || e.type === typeFilter;
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchStatus && matchSearch;
  });

  if (selected) {
    return <EventDetail event={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div style={{ padding: 28, maxWidth: 1200, background: '#f5f5f5', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>Events Repository</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>Hackathons, workshops, demo days and conferences for the DRDO startup ecosystem</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: G, color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 10px rgba(213,170,91,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.background = GH}
          onMouseLeave={e => e.currentTarget.style.background = G}
        >
          <Plus size={14} /> Create Event
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Events',   value: EVENTS.length, icon: Calendar, bg: '#fff8ec', fg: G },
          { label: 'Upcoming',       value: EVENTS.filter(e => e.status === 'Upcoming').length, icon: Clock, bg: '#f0f9ff', fg: '#0284c7' },
          { label: 'Live Now',       value: EVENTS.filter(e => e.status === 'Live').length, icon: Zap, bg: '#f0fdf4', fg: '#16a34a' },
          { label: 'Total Registered', value: EVENTS.reduce((s, e) => s + e.registrations, 0), icon: Users, bg: '#fdf4ff', fg: '#9333ea' },
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
          <input placeholder="Search events, tags…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 30, paddingRight: 12, paddingTop: 9, paddingBottom: 9, background: '#fff', border: '1.5px solid #eee', borderRadius: 9, fontSize: 13, outline: 'none', color: '#1a1a1a' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['All', ...Object.keys(EVENT_TYPES)].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize', border: '1.5px solid', cursor: 'pointer',
              background: typeFilter === t ? G : '#fff',
              color: typeFilter === t ? '#fff' : '#666',
              borderColor: typeFilter === t ? G : '#eee',
            }}>{t === 'All' ? 'All Types' : EVENT_TYPES[t]?.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {['All', 'Upcoming', 'Live', 'Completed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1.5px solid', cursor: 'pointer',
              background: statusFilter === s ? '#1a1a1a' : '#fff',
              color: statusFilter === s ? '#fff' : '#666',
              borderColor: statusFilter === s ? '#1a1a1a' : '#eee',
            }}>{s}</button>
          ))}
        </div>
        {/* View toggle */}
        <div style={{ display: 'flex', background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 3, gap: 2 }}>
          {[{ v: 'grid', label: '⊞' }, { v: 'list', label: '☰' }].map(({ v, label }) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: view === v ? G : 'transparent', color: view === v ? '#fff' : '#888', fontSize: 13, fontWeight: 700 }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map(ev => <EventCard key={ev.id} ev={ev} onClick={() => setSelected(ev)} />)}
          {filtered.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: '#aaa', fontSize: 13 }}>No events found</div>}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '12px 22px', borderBottom: '1px solid #eee', background: '#fafafa', display: 'grid', gridTemplateColumns: '1fr 120px 140px 90px 80px', gap: 12 }}>
            {['Event', 'Type', 'Date', 'Status', 'Regs'].map(h => <span key={h} style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{h}</span>)}
          </div>
          {filtered.map((ev, i) => {
            const et = EVENT_TYPES[ev.type] || EVENT_TYPES.workshop;
            const ss = STATUS_STYLE[ev.status] || STATUS_STYLE['Upcoming'];
            const EIcon = et.icon;
            return (
              <div key={ev.id} onClick={() => setSelected(ev)} style={{ padding: '13px 22px', borderBottom: i < filtered.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'grid', gridTemplateColumns: '1fr 120px 140px 90px 80px', gap: 12, alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MapPin size={10} />{ev.location}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: et.bg, color: et.color, border: `1px solid ${et.color}22`, display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                  <EIcon size={9} />{et.label}
                </span>
                <span style={{ fontSize: 11, color: '#555' }}>{ev.date}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, width: 'fit-content' }}>{ev.status}</span>
                <span style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 600 }}>{ev.registrations}<span style={{ color: '#aaa', fontWeight: 400 }}>/{ev.capacity}</span></span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EventCard({ ev, onClick }) {
  const et = EVENT_TYPES[ev.type] || EVENT_TYPES.workshop;
  const ss = STATUS_STYLE[ev.status] || STATUS_STYLE['Upcoming'];
  const EIcon = et.icon;
  const regPct = Math.round((ev.registrations / ev.capacity) * 100);

  return (
    <div style={{ ...card, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
    >
      {/* Top colour bar */}
      <div style={{ height: 4, background: et.color }} />
      <div style={{ padding: 20 }}>
        {/* Type & status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: et.bg, color: et.color, border: `1px solid ${et.color}22`, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <EIcon size={10} />{et.label}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{ev.status}</span>
        </div>

        <h3 style={{ margin: '0 0 8px', color: '#1a1a1a', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{ev.title}</h3>
        <p style={{ margin: '0 0 14px', color: '#666', fontSize: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.description}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}>
            <Calendar size={12} color="#aaa" />
            {ev.date}{ev.date !== ev.endDate ? ` – ${ev.endDate}` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}>
            <MapPin size={12} color="#aaa" />{ev.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}>
            <Globe size={12} color="#aaa" />{ev.mode}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {ev.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#f5f5f5', color: '#888', border: '1px solid #eee' }}>{t}</span>)}
        </div>

        {/* Registrations */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}><Users size={10} /> Registrations</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: regPct > 85 ? '#dc2626' : '#1a1a1a' }}>{ev.registrations}/{ev.capacity}</span>
          </div>
          <div style={{ height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${regPct}%`, height: '100%', background: regPct > 85 ? '#dc2626' : G, borderRadius: 3 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetail({ event: ev, onBack }) {
  const et = EVENT_TYPES[ev.type] || EVENT_TYPES.workshop;
  const ss = STATUS_STYLE[ev.status] || STATUS_STYLE['Upcoming'];
  const EIcon = et.icon;
  const regPct = Math.round((ev.registrations / ev.capacity) * 100);

  return (
    <div style={{ padding: 28, maxWidth: 900, background: '#f5f5f5', minHeight: '100%' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, color: G, fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
        ← Events
      </button>

      {/* Header */}
      <div style={{ ...card, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: et.bg, color: et.color, border: `1px solid ${et.color}22`, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <EIcon size={10} />{et.label}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{ev.status}</span>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#f5f3ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}>{ev.mode}</span>
            </div>
            <h1 style={{ margin: '0 0 8px', color: '#1a1a1a', fontSize: 20, fontWeight: 800 }}>{ev.title}</h1>
            <p style={{ margin: 0, color: '#666', fontSize: 14, lineHeight: 1.6 }}>{ev.description}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginTop: 22 }}>
          {[
            { icon: Calendar, label: 'Date',         value: `${ev.date}${ev.date !== ev.endDate ? ` – ${ev.endDate}` : ''}` },
            { icon: MapPin,   label: 'Location',     value: ev.location },
            { icon: Users,    label: 'Organiser',    value: ev.organiser },
            { icon: Users,    label: 'Registrations',value: `${ev.registrations} / ${ev.capacity}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={13} color={G} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 600 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${regPct}%`, height: '100%', background: regPct > 85 ? '#dc2626' : G, borderRadius: 3 }} />
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {ev.status !== 'Completed' && (
            <button style={{ padding: '9px 20px', background: G, color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 10px rgba(213,170,91,0.3)' }}>
              Register Now
            </button>
          )}
          <button style={{ padding: '9px 20px', background: '#f5f5f5', color: '#555', border: '1.5px solid #eee', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={13} /> Download Brochure
          </button>
          <button style={{ padding: '9px 20px', background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={13} /> Add to Calendar
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        {/* Agenda */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>Agenda</h3>
          </div>
          {ev.agenda.map((item, i) => (
            <div key={i} style={{ padding: '14px 22px', borderBottom: i < ev.agenda.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ minWidth: 70, fontSize: 11, fontWeight: 700, color: G }}>{item.time}</div>
              <div style={{ color: '#1a1a1a', fontSize: 13 }}>{item.title}</div>
            </div>
          ))}
        </div>

        {/* Speakers & tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...card, padding: 18 }}>
            <h3 style={{ margin: '0 0 14px', color: '#1a1a1a', fontSize: 13, fontWeight: 700 }}>Speakers</h3>
            {ev.speakers.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < ev.speakers.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(213,170,91,0.12)', color: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: '1.5px solid rgba(213,170,91,0.25)', flexShrink: 0 }}>{s[0]}</div>
                <span style={{ fontSize: 12, color: '#1a1a1a' }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: 18 }}>
            <h3 style={{ margin: '0 0 12px', color: '#1a1a1a', fontSize: 13, fontWeight: 700 }}>Tags</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ev.tags.map(t => (
                <span key={t} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#fff8ec', color: G, border: '1px solid rgba(213,170,91,0.3)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
