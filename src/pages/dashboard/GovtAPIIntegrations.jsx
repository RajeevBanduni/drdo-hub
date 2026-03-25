import { useState } from 'react';
import {
  Globe, Link2, CheckCircle2, AlertCircle, Clock, RefreshCw,
  Shield, Database, Zap, ArrowRight, ExternalLink, Settings,
  Activity, Lock, Key, ChevronRight, Info,
} from 'lucide-react';

const G = '#D5AA5B';
const GH = '#C9983F';

const card = {
  background: '#ffffff',
  border: '1px solid #eeeeee',
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const INTEGRATIONS = [
  {
    id: 1,
    name: 'Startup India (DPIIT)',
    description: 'Verify startup registration, DPIIT recognition status, and fetch startup profile data from the official Startup India portal.',
    status: 'Connected',
    category: 'Startup Verification',
    endpoint: 'https://api.startupindia.gov.in/v1',
    auth: 'OAuth 2.0',
    lastSync: '10 min ago',
    callsToday: 142,
    logo: 'SI',
    color: '#ea580c',
    bg: '#fff7ed',
    dataPoints: ['Registration Status', 'DPIIT Number', 'Sector', 'Stage', 'Recognition Date'],
  },
  {
    id: 2,
    name: 'MCA – Ministry of Corporate Affairs',
    description: 'Validate CIN/LLPIN, director details, shareholding patterns, and financial filings via MCA21 API.',
    status: 'Connected',
    category: 'Corporate Verification',
    endpoint: 'https://api.mca.gov.in/v2',
    auth: 'API Key',
    lastSync: '25 min ago',
    callsToday: 87,
    logo: 'MC',
    color: '#0284c7',
    bg: '#f0f9ff',
    dataPoints: ['CIN/LLPIN', 'Director Details', 'Shareholding', 'Balance Sheet', 'Filing Status'],
  },
  {
    id: 3,
    name: 'GSTN – GST Network',
    description: 'Validate GSTIN, fetch return filing history, and verify business turnover data for financial due diligence.',
    status: 'Connected',
    category: 'Tax Verification',
    endpoint: 'https://api.gst.gov.in/v1',
    auth: 'API Key + OTP',
    lastSync: '1 hr ago',
    callsToday: 53,
    logo: 'GS',
    color: '#16a34a',
    bg: '#f0fdf4',
    dataPoints: ['GSTIN Status', 'Filing History', 'Annual Turnover', 'Business Type', 'Registration Date'],
  },
  {
    id: 4,
    name: 'UDYAM – MSME Registration',
    description: 'Verify MSME/UDYAM registration for SME startups and fetch enterprise classification details.',
    status: 'Pending Setup',
    category: 'MSME Verification',
    endpoint: 'https://udyamregistration.gov.in/api/v1',
    auth: 'API Key',
    lastSync: 'Never',
    callsToday: 0,
    logo: 'UD',
    color: '#9333ea',
    bg: '#fdf4ff',
    dataPoints: ['UDYAM Number', 'Enterprise Category', 'Investment', 'Turnover', 'NIC Code'],
  },
  {
    id: 5,
    name: 'MeitY – Startup Hub',
    description: 'Access MeitY startup programs, track participation in government tech challenges, and sync startup data.',
    status: 'Pending Setup',
    category: 'Government Portal',
    endpoint: 'https://startuphub.meity.gov.in/api/v1',
    auth: 'OAuth 2.0',
    lastSync: 'Never',
    callsToday: 0,
    logo: 'Me',
    color: '#dc2626',
    bg: '#fef2f2',
    dataPoints: ['Program Participation', 'Challenge Results', 'Funding Received', 'Startup Profile'],
  },
  {
    id: 6,
    name: 'DigiLocker API',
    description: 'Allow startups to share verified documents directly from DigiLocker — certificates, registrations, patents.',
    status: 'Connected',
    category: 'Document Verification',
    endpoint: 'https://api.digitallocker.gov.in/public/oauth2/1/token',
    auth: 'OAuth 2.0',
    lastSync: '3 hrs ago',
    callsToday: 29,
    logo: 'DL',
    color: '#0284c7',
    bg: '#f0f9ff',
    dataPoints: ['Aadhaar-linked Documents', 'Certificates', 'Registrations', 'Patents'],
  },
  {
    id: 7,
    name: 'ISRO Tech Transfer',
    description: 'Share spacetech startup intelligence with ISRO for collaborative innovation and national coordination.',
    status: 'Inactive',
    category: 'Inter-agency',
    endpoint: 'Classified',
    auth: 'Mutual TLS',
    lastSync: '7 days ago',
    callsToday: 0,
    logo: 'IS',
    color: '#64748b',
    bg: '#f8fafc',
    dataPoints: ['SpaceTech Startups', 'Technology Profiles', 'Collaboration Flags'],
  },
  {
    id: 8,
    name: 'DAE – Dept. of Atomic Energy',
    description: 'Coordinate dual-use technology startups relevant to atomic energy and nuclear materials research.',
    status: 'Inactive',
    category: 'Inter-agency',
    endpoint: 'Classified',
    auth: 'Mutual TLS',
    lastSync: 'Never',
    callsToday: 0,
    logo: 'DA',
    color: '#64748b',
    bg: '#f8fafc',
    dataPoints: ['Nuclear Material Startups', 'Dual-use Technologies'],
  },
];

const STATUS_STYLE = {
  Connected:       { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0',              icon: CheckCircle2 },
  'Pending Setup': { bg: '#fff8ec', color: G,          border: 'rgba(213,170,91,0.4)', icon: Clock },
  Inactive:        { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0',              icon: AlertCircle },
  Error:           { bg: '#fef2f2', color: '#dc2626', border: '#fecaca',              icon: AlertCircle },
};

export default function GovtAPIIntegrations() {
  const [selected, setSelected] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...new Set(INTEGRATIONS.map(i => i.category))];
  const filtered = INTEGRATIONS.filter(i => categoryFilter === 'All' || i.category === categoryFilter);

  const connected   = INTEGRATIONS.filter(i => i.status === 'Connected').length;
  const totalCalls  = INTEGRATIONS.reduce((s, i) => s + i.callsToday, 0);

  if (selected) return <IntegrationDetail integration={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ padding: 28, maxWidth: 1200, background: '#f5f5f5', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>Government API Integrations</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>Connect with central & state government databases for seamless startup verification</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: '#f5f5f5', color: '#555', border: '1px solid #eee', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <RefreshCw size={12} /> Sync All
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: G, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 8px rgba(213,170,91,0.3)' }}>
            <Link2 size={12} /> Add Integration
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total APIs',    value: INTEGRATIONS.length, icon: Globe,         bg: '#fff8ec', fg: G },
          { label: 'Connected',     value: connected,           icon: CheckCircle2,  bg: '#f0fdf4', fg: '#16a34a' },
          { label: 'Pending Setup', value: INTEGRATIONS.filter(i => i.status === 'Pending Setup').length, icon: Clock, bg: '#fff8ec', fg: '#ea580c' },
          { label: "Today's Calls", value: totalCalls,          icon: Activity,      bg: '#f0f9ff', fg: '#0284c7' },
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

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} style={{
            padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1.5px solid', cursor: 'pointer',
            background: categoryFilter === c ? G : '#fff', color: categoryFilter === c ? '#fff' : '#666', borderColor: categoryFilter === c ? G : '#eee',
          }}>{c}</button>
        ))}
      </div>

      {/* Integration cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map(integ => {
          const ss = STATUS_STYLE[integ.status] || STATUS_STYLE['Inactive'];
          const SIcon = ss.icon;
          return (
            <div key={integ.id}
              onClick={() => setSelected(integ)}
              style={{ ...card, padding: 22, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: integ.bg, color: integ.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, border: `1.5px solid ${integ.color}22`, flexShrink: 0 }}>{integ.logo}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{integ.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{integ.category}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                  <SIcon size={8} />{integ.status}
                </span>
              </div>

              <p style={{ margin: '0 0 14px', color: '#666', fontSize: 12, lineHeight: 1.5 }}>{integ.description}</p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {integ.dataPoints.slice(0, 3).map(dp => (
                  <span key={dp} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#f5f5f5', color: '#888', border: '1px solid #eee' }}>{dp}</span>
                ))}
                {integ.dataPoints.length > 3 && (
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#f5f5f5', color: '#aaa', border: '1px solid #eee' }}>+{integ.dataPoints.length - 3} more</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{integ.callsToday}</div>
                    <div style={{ fontSize: 10, color: '#aaa' }}>calls today</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#555' }}>{integ.auth}</div>
                    <div style={{ fontSize: 10, color: '#aaa' }}>auth method</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#aaa', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <RefreshCw size={10} /> {integ.lastSync}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IntegrationDetail({ integration: integ, onBack }) {
  const ss = STATUS_STYLE[integ.status] || STATUS_STYLE['Inactive'];
  const SIcon = ss.icon;

  return (
    <div style={{ padding: 28, maxWidth: 900, background: '#f5f5f5', minHeight: '100%' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, color: G, fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
        ← Integrations
      </button>

      <div style={{ ...card, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: integ.bg, color: integ.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, border: `2px solid ${integ.color}22`, flexShrink: 0 }}>{integ.logo}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 20, fontWeight: 800 }}>{integ.name}</h1>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <SIcon size={10} />{integ.status}
              </span>
            </div>
            <p style={{ margin: 0, color: '#666', fontSize: 13, lineHeight: 1.6 }}>{integ.description}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {integ.status === 'Pending Setup' && (
              <button style={{ padding: '8px 16px', background: G, color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 8px rgba(213,170,91,0.3)' }}>Connect</button>
            )}
            {integ.status === 'Connected' && (
              <>
                <button style={{ padding: '8px 14px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <RefreshCw size={11} /> Sync Now
                </button>
                <button style={{ padding: '8px 14px', background: '#f5f5f5', color: '#555', border: '1px solid #eee', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Settings size={11} /> Configure
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginTop: 24 }}>
          {[
            { label: 'Auth Method',  value: integ.auth,        icon: Key },
            { label: 'Calls Today',  value: integ.callsToday,  icon: Activity },
            { label: 'Last Synced',  value: integ.lastSync,    icon: RefreshCw },
            { label: 'Category',     value: integ.category,    icon: Globe },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f0' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={12} color={G} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#aaa' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 600 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
        <div style={{ ...card, padding: 22 }}>
          <h3 style={{ margin: '0 0 16px', color: '#1a1a1a', fontSize: 14, fontWeight: 600 }}>Available Data Points</h3>
          {integ.dataPoints.map((dp, i) => (
            <div key={dp} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < integ.dataPoints.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span style={{ fontSize: 13, color: '#555' }}>{dp}</span>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: 20, alignSelf: 'start' }}>
          <h3 style={{ margin: '0 0 14px', color: '#1a1a1a', fontSize: 13, fontWeight: 700 }}>Endpoint</h3>
          <div style={{ padding: '8px 12px', background: '#1a1a1a', borderRadius: 8, marginBottom: 14 }}>
            <code style={{ fontSize: 11, color: '#a3e635', wordBreak: 'break-all' }}>{integ.endpoint}</code>
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Shield size={11} color={G} />
              <span>Compliant with GoI Data Exchange Standards</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={11} color={G} />
              <span>All data encrypted in transit (TLS 1.3)</span>
            </div>
          </div>
          <button style={{ width: '100%', padding: '8px 0', background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <ExternalLink size={11} /> View API Docs
          </button>
        </div>
      </div>
    </div>
  );
}
