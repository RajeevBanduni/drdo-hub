import { useState } from 'react';
import {
  FolderKanban, Plus, ChevronRight, CheckCircle2, Clock, AlertTriangle,
  Users, Calendar, DollarSign, TrendingUp, BarChart3, Target,
  MessageSquare, Paperclip, MoreHorizontal, Filter, Search,
  ArrowUpRight, CheckSquare, Circle, PlayCircle, PauseCircle,
} from 'lucide-react';

const G = '#D5AA5B';
const GH = '#C9983F';

const card = {
  background: '#ffffff',
  border: '1px solid #eeeeee',
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const PROJECTS = [
  {
    id: 1,
    name: 'ArmorTech AI – Phase 1',
    startup: 'ArmorTech AI',
    sector: 'AI / ML',
    status: 'Active',
    priority: 'High',
    progress: 68,
    budget: '₹2.4 Cr',
    spent: '₹1.6 Cr',
    start: '01 Jan 2025',
    end: '30 Jun 2025',
    pm: 'Dr. R. Sharma',
    team: 4,
    tasks: { total: 24, done: 16, pending: 5, blocked: 3 },
    milestones: [
      { name: 'Prototype Delivery',   date: '15 Feb 2025', done: true },
      { name: 'Lab Evaluation',       date: '31 Mar 2025', done: true },
      { name: 'Field Trial – Phase A', date: '30 Apr 2025', done: false },
      { name: 'Final Report',         date: '30 Jun 2025', done: false },
    ],
  },
  {
    id: 2,
    name: 'DroneShield – UAV Detection',
    startup: 'DroneShield Systems',
    sector: 'UAV',
    status: 'On Hold',
    priority: 'Medium',
    progress: 35,
    budget: '₹1.8 Cr',
    spent: '₹0.63 Cr',
    start: '15 Feb 2025',
    end: '15 Aug 2025',
    pm: 'Dr. P. Nair',
    team: 3,
    tasks: { total: 18, done: 6, pending: 10, blocked: 2 },
    milestones: [
      { name: 'Design Freeze',        date: '28 Feb 2025', done: true },
      { name: 'Hardware Procurement', date: '30 Mar 2025', done: false },
      { name: 'Integration Test',     date: '30 Jun 2025', done: false },
    ],
  },
  {
    id: 3,
    name: 'QuantumDefense – QKD Pilot',
    startup: 'QuantumDefense',
    sector: 'Quantum Tech',
    status: 'Active',
    priority: 'Critical',
    progress: 82,
    budget: '₹5.2 Cr',
    spent: '₹4.26 Cr',
    start: '01 Oct 2024',
    end: '30 Sep 2025',
    pm: 'Dr. A. Kapoor',
    team: 6,
    tasks: { total: 36, done: 30, pending: 4, blocked: 2 },
    milestones: [
      { name: 'Lab Setup',            date: '01 Dec 2024', done: true },
      { name: 'Protocol Validation',  date: '28 Feb 2025', done: true },
      { name: 'Pilot Deployment',     date: '30 Jun 2025', done: false },
      { name: 'Security Audit',       date: '31 Aug 2025', done: false },
      { name: 'Final Handover',       date: '30 Sep 2025', done: false },
    ],
  },
  {
    id: 4,
    name: 'CyberSentinel – SOC Platform',
    startup: 'CyberSentinel',
    sector: 'Cybersecurity',
    status: 'Planning',
    priority: 'High',
    progress: 12,
    budget: '₹3.1 Cr',
    spent: '₹0.37 Cr',
    start: '01 Apr 2025',
    end: '31 Mar 2026',
    pm: 'Dr. S. Mehta',
    team: 5,
    tasks: { total: 28, done: 3, pending: 22, blocked: 3 },
    milestones: [
      { name: 'Requirement Sign-off', date: '15 Apr 2025', done: false },
      { name: 'Architecture Review',  date: '30 Apr 2025', done: false },
    ],
  },
];

const STATUS_STYLE = {
  Active:   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'On Hold':{ bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  Planning: { bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' },
  Completed:{ bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
};

const PRIORITY_STYLE = {
  Critical: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  High:     { bg: '#fff8ec', color: '#D5AA5B', border: 'rgba(213,170,91,0.4)' },
  Medium:   { bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' },
  Low:      { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

const TASKS_MOCK = [
  { id: 1, title: 'Prototype delivery documentation', project: 'ArmorTech AI – Phase 1', assignee: 'Dr. R. Sharma', due: '20 Apr 2025', status: 'Done',        priority: 'High' },
  { id: 2, title: 'Field trial site preparation',     project: 'ArmorTech AI – Phase 1', assignee: 'Lt. V. Singh',  due: '25 Apr 2025', status: 'In Progress', priority: 'High' },
  { id: 3, title: 'Hardware procurement approval',    project: 'DroneShield – UAV',      assignee: 'Dr. P. Nair',   due: '30 Apr 2025', status: 'Blocked',     priority: 'Medium' },
  { id: 4, title: 'QKD protocol test report',         project: 'QuantumDefense – QKD',   assignee: 'Dr. A. Kapoor', due: '15 May 2025', status: 'In Progress', priority: 'Critical' },
  { id: 5, title: 'Requirement sign-off meeting',     project: 'CyberSentinel – SOC',    assignee: 'Dr. S. Mehta',  due: '15 Apr 2025', status: 'Todo',        priority: 'High' },
  { id: 6, title: 'Architecture review document',     project: 'CyberSentinel – SOC',    assignee: 'Dr. S. Mehta',  due: '30 Apr 2025', status: 'Todo',        priority: 'Medium' },
];

const TASK_STATUS = {
  'Done':        { icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'In Progress': { icon: PlayCircle,   color: '#D5AA5B', bg: '#fff8ec', border: 'rgba(213,170,91,0.4)' },
  'Blocked':     { icon: AlertTriangle,color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  'Todo':        { icon: Circle,       color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
};

export default function ProjectManagement() {
  const [view, setView]             = useState('projects'); // 'projects' | 'tasks' | 'detail'
  const [selected, setSelected]     = useState(null);
  const [taskFilter, setTaskFilter] = useState('All');
  const [search, setSearch]         = useState('');

  const filteredTasks = TASKS_MOCK.filter(t => {
    const matchFilter = taskFilter === 'All' || t.status === taskFilter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.project.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (view === 'detail' && selected) {
    return <ProjectDetail project={selected} onBack={() => setView('projects')} />;
  }

  return (
    <div style={{ padding: 28, maxWidth: 1200, background: '#f5f5f5', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>Project Management</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>Track milestones, tasks, collaboration & financial health</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #eee', borderRadius: 9, padding: 3, gap: 2 }}>
            {['projects', 'tasks'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                  border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                  background: view === v ? G : 'transparent',
                  color: view === v ? '#fff' : '#666',
                }}
              >{v}</button>
            ))}
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', background: G, color: '#fff',
            border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700,
            boxShadow: '0 2px 10px rgba(213,170,91,0.3)',
          }}
            onMouseEnter={e => e.currentTarget.style.background = GH}
            onMouseLeave={e => e.currentTarget.style.background = G}
          >
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Projects', value: PROJECTS.length, icon: FolderKanban, bg: '#fff8ec', fg: G },
          { label: 'Active',         value: PROJECTS.filter(p => p.status === 'Active').length, icon: PlayCircle, bg: '#f0fdf4', fg: '#16a34a' },
          { label: 'Tasks Pending',  value: TASKS_MOCK.filter(t => t.status !== 'Done').length, icon: Clock, bg: '#f0f9ff', fg: '#0284c7' },
          { label: 'Blocked Tasks',  value: TASKS_MOCK.filter(t => t.status === 'Blocked').length, icon: AlertTriangle, bg: '#fef2f2', fg: '#dc2626' },
          { label: 'Total Budget',   value: '₹12.5 Cr', icon: DollarSign, bg: '#fdf4ff', fg: '#9333ea' },
        ].map(({ label, value, icon: Icon, bg, fg }) => (
          <div key={label} style={{ ...card, padding: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon size={16} color={fg} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Projects view */}
      {view === 'projects' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {PROJECTS.map(p => {
            const ss = STATUS_STYLE[p.status] || STATUS_STYLE['Planning'];
            const ps = PRIORITY_STYLE[p.priority] || PRIORITY_STYLE['Medium'];
            const pctSpent = Math.round((parseFloat(p.spent.replace(/[₹\sCr]/g, '')) / parseFloat(p.budget.replace(/[₹\sCr]/g, ''))) * 100);
            return (
              <div key={p.id} style={{ ...card, padding: 22, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onClick={() => { setSelected(p); setView('detail'); }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  {/* Left: info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ color: '#1a1a1a', fontSize: 15, fontWeight: 700 }}>{p.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{p.status}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>{p.priority}</span>
                    </div>
                    <div style={{ color: '#666', fontSize: 12, marginBottom: 10 }}>{p.sector} · PM: {p.pm} · Team: {p.team} members</div>
                    {/* Progress bar */}
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#888' }}>Overall Progress</span>
                        <span style={{ fontSize: 11, color: '#1a1a1a', fontWeight: 600 }}>{p.progress}%</span>
                      </div>
                      <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: p.progress > 70 ? '#16a34a' : p.progress > 40 ? G : '#ef4444', borderRadius: 3, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  </div>

                  {/* Middle: tasks */}
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Done',    value: p.tasks.done,    color: '#16a34a' },
                      { label: 'Pending', value: p.tasks.pending, color: G },
                      { label: 'Blocked', value: p.tasks.blocked, color: '#dc2626' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Right: budget */}
                  <div style={{ minWidth: 160 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#888' }}>Budget Used</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: pctSpent > 85 ? '#dc2626' : '#1a1a1a' }}>{pctSpent}%</span>
                    </div>
                    <div style={{ height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                      <div style={{ width: `${pctSpent}%`, height: '100%', background: pctSpent > 85 ? '#dc2626' : '#16a34a', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#888' }}>{p.spent} of {p.budget}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{p.start} → {p.end}</div>
                  </div>

                  <ChevronRight size={16} color="#ccc" style={{ alignSelf: 'center' }} />
                </div>

                {/* Milestones */}
                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {p.milestones.map((m, i) => (
                    <span key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 11, padding: '3px 9px', borderRadius: 20,
                      background: m.done ? '#f0fdf4' : '#f8fafc',
                      color: m.done ? '#16a34a' : '#64748b',
                      border: `1px solid ${m.done ? '#bbf7d0' : '#e2e8f0'}`,
                    }}>
                      <CheckCircle2 size={10} />
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tasks view */}
      {view === 'tasks' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input
                placeholder="Search tasks…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  paddingLeft: 30, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                  background: '#fff', border: '1.5px solid #eee', borderRadius: 9,
                  fontSize: 13, outline: 'none', color: '#1a1a1a',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Todo', 'In Progress', 'Blocked', 'Done'].map(f => (
                <button key={f} onClick={() => setTaskFilter(f)} style={{
                  padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: '1.5px solid', cursor: 'pointer',
                  background: taskFilter === f ? G : '#fff',
                  color: taskFilter === f ? '#fff' : '#666',
                  borderColor: taskFilter === f ? G : '#eee',
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ ...card, overflow: 'hidden' }}>
            {filteredTasks.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontSize: 13 }}>No tasks found</div>
            ) : filteredTasks.map((t, i) => {
              const ts = TASK_STATUS[t.status] || TASK_STATUS['Todo'];
              const StatusIcon = ts.icon;
              const pp = PRIORITY_STYLE[t.priority] || PRIORITY_STYLE['Medium'];
              return (
                <div key={t.id} style={{
                  padding: '13px 20px',
                  borderBottom: i < filteredTasks.length - 1 ? '1px solid #f5f5f5' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
                }}>
                  <StatusIcon size={16} color={ts.color} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#1a1a1a', fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                    <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>{t.project}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: pp.bg, color: pp.color, border: `1px solid ${pp.border}`, whiteSpace: 'nowrap' }}>{t.priority}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`, whiteSpace: 'nowrap' }}>{t.status}</span>
                  <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={11} /> {t.assignee}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={11} /> {t.due}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project: p, onBack }) {
  const [tab, setTab] = useState('overview');
  const ss = STATUS_STYLE[p.status] || STATUS_STYLE['Planning'];
  const pctSpent = Math.round((parseFloat(p.spent.replace(/[₹\sCr]/g, '')) / parseFloat(p.budget.replace(/[₹\sCr]/g, ''))) * 100);

  const TABS = ['overview', 'tasks', 'milestones', 'financials', 'team'];

  return (
    <div style={{ padding: 28, maxWidth: 1200, background: '#f5f5f5', minHeight: '100%' }}>
      {/* Back */}
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, color: G, fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
        ← Projects
      </button>

      {/* Project header */}
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 20, fontWeight: 700 }}>{p.name}</h1>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{p.status}</span>
            </div>
            <p style={{ margin: 0, color: '#666', fontSize: 13 }}>{p.sector} · {p.start} → {p.end} · PM: {p.pm}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{p.progress}%</div>
            <div style={{ fontSize: 12, color: '#888' }}>Overall Progress</div>
          </div>
        </div>
        <div style={{ marginTop: 16, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${p.progress}%`, height: '100%', background: p.progress > 70 ? '#16a34a' : G, borderRadius: 4, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
            border: 'none', cursor: 'pointer',
            background: tab === t ? G : 'transparent',
            color: tab === t ? '#fff' : '#666',
          }}>{t}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { label: 'Tasks Done',     value: `${p.tasks.done}/${p.tasks.total}`, color: '#16a34a' },
            { label: 'Tasks Pending',  value: p.tasks.pending,  color: G },
            { label: 'Tasks Blocked',  value: p.tasks.blocked,  color: '#dc2626' },
            { label: 'Budget Used',    value: `${pctSpent}%`,   color: pctSpent > 85 ? '#dc2626' : '#16a34a' },
            { label: 'Budget Spent',   value: p.spent,          color: '#1a1a1a' },
            { label: 'Remaining',      value: `₹${(parseFloat(p.budget.replace(/[₹\sCr]/g,'')) - parseFloat(p.spent.replace(/[₹\sCr]/g,''))).toFixed(2)} Cr`, color: '#1a1a1a' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ ...card, padding: 18 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones */}
      {tab === 'milestones' && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>Milestones</h3>
          </div>
          {p.milestones.map((m, i) => (
            <div key={i} style={{
              padding: '14px 22px', borderBottom: i < p.milestones.length - 1 ? '1px solid #f5f5f5' : 'none',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: m.done ? '#f0fdf4' : '#f8fafc',
                border: `2px solid ${m.done ? '#16a34a' : '#e2e8f0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle2 size={14} color={m.done ? '#16a34a' : '#ccc'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#1a1a1a', fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>{m.date}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                background: m.done ? '#f0fdf4' : '#f8fafc',
                color: m.done ? '#16a34a' : '#64748b',
                border: `1px solid ${m.done ? '#bbf7d0' : '#e2e8f0'}`,
              }}>{m.done ? 'Completed' : 'Upcoming'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Financials */}
      {tab === 'financials' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ ...card, padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>Budget Overview</h3>
            {[
              { label: 'Total Budget',  value: p.budget,  color: '#1a1a1a' },
              { label: 'Spent to Date', value: p.spent,   color: pctSpent > 85 ? '#dc2626' : '#16a34a' },
              { label: 'Remaining',     value: `₹${(parseFloat(p.budget.replace(/[₹\sCr]/g,'')) - parseFloat(p.spent.replace(/[₹\sCr]/g,''))).toFixed(2)} Cr`, color: '#1a1a1a' },
              { label: '% Utilized',    value: `${pctSpent}%`, color: pctSpent > 85 ? '#dc2626' : G },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${pctSpent}%`, height: '100%', background: pctSpent > 85 ? '#dc2626' : '#16a34a', borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ ...card, padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>Monthly Burn Rate</h3>
            {['Jan', 'Feb', 'Mar', 'Apr'].map((m, i) => {
              const vals = [18, 22, 15, 25];
              return (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: '#888', width: 28 }}>{m}</span>
                  <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${vals[i]}%`, height: '100%', background: G, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#888', width: 40, textAlign: 'right' }}>₹{vals[i]}L</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team / Tasks tabs — simplified list */}
      {(tab === 'tasks' || tab === 'team') && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>
              {tab === 'tasks' ? 'Project Tasks' : 'Team Members'}
            </h3>
          </div>
          {tab === 'tasks' && TASKS_MOCK.filter(t => t.project.includes(p.startup?.split(' ')[0] || '')).map((t, i, arr) => {
            const ts = TASK_STATUS[t.status] || TASK_STATUS['Todo'];
            const StatusIcon = ts.icon;
            return (
              <div key={t.id} style={{ padding: '13px 22px', borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <StatusIcon size={15} color={ts.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#1a1a1a', fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>{t.assignee} · Due {t.due}</div>
                </div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{t.status}</span>
              </div>
            );
          })}
          {tab === 'team' && (
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(213,170,91,0.12)', color: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, border: '1.5px solid rgba(213,170,91,0.3)' }}>
                  {p.pm[0]}
                </div>
                <div>
                  <div style={{ color: '#1a1a1a', fontSize: 13, fontWeight: 600 }}>{p.pm}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>Project Manager</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Lead</span>
              </div>
              <div style={{ color: '#888', fontSize: 12, padding: '12px 0' }}>+ {p.team - 1} more team members</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
