import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { iprAPI } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { Shield, Plus, Search, Filter, CheckCircle2, Clock, AlertCircle, Globe, FileText, Calendar, ChevronRight, Award } from 'lucide-react';

const TYPE_ICONS = { Patent: Shield, Trademark: Award, Copyright: FileText, Design: FileText };
const STATUS_COLORS = {
  Granted: 'bg-accent-100 text-accent-700 border-accent-200',
  Published: 'bg-blue-100 text-blue-700 border-blue-200',
  Filed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Licensed (Exclusive – HAL)': 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function IPRDatabase() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [iprRecords, setIprRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    iprAPI.list()
      .then(data => {
        const records = data.records || data.ipr_records || data || [];
        const normalized = records.map(r => ({
          id: r.id,
          title: r.title || '',
          applicationNo: r.application_no || r.applicationNo || '',
          startup: r.startup_name || r.startup || '',
          type: r.type || 'Patent',
          status: r.status || 'Filed',
          jurisdiction: r.jurisdiction || (r.jurisdictions ? r.jurisdictions : ['IN']),
          drdo_share: r.drdo_share || 0,
          startup_share: r.startup_share || 100,
          filingDate: r.filing_date ? new Date(r.filing_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : r.filingDate || '',
          grantDate: r.grant_date ? new Date(r.grant_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : r.grantDate || null,
          expiryDate: r.expiry_date ? new Date(r.expiry_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : r.expiryDate || '',
          licensing: r.licensing || 'None',
          inventors: r.inventors || [],
        }));
        setIprRecords(normalized);
      })
      .catch(err => { toast.error(err.message || 'Failed to load IPR records'); setIprRecords([]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton type="table" />;

  const filtered = iprRecords.filter(r => {
    const matchSearch = (r.title || '').toLowerCase().includes(search.toLowerCase()) || (r.startup || '').toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'All' || r.type === type;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">IPR Database</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track patents, trademarks, and intellectual property across the DRDO ecosystem</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-dark-950 rounded-lg font-semibold text-sm hover:bg-primary-400">
          <Plus size={16} /> Add IPR Record
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total IPR Records', value: iprRecords.length, color: 'text-gray-800' },
          { label: 'Patents Granted', value: iprRecords.filter(r => r.type === 'Patent' && r.status === 'Granted').length, color: 'text-accent-600' },
          { label: 'Under Review', value: iprRecords.filter(r => ['Filed', 'Published'].includes(r.status)).length, color: 'text-yellow-600' },
          { label: 'DRDO Co-owned', value: iprRecords.filter(r => r.drdo_share > 0).length, color: 'text-primary-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-400 text-sm" placeholder="Search IPR records..." />
        </div>
        {['All', 'Patent', 'Trademark', 'Copyright'].map(t => (
          <button key={t} onClick={() => setType(t)} className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${type === t ? 'bg-primary-500 text-dark-950' : 'bg-white border border-gray-200 text-gray-600'}`}>{t}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">IPR Title</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Startup</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Jurisdiction</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">DRDO Share</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Filed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(record => {
              const Icon = TYPE_ICONS[record.type] || Shield;
              return (
                <tr key={record.id} onClick={() => setSelected(record)} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-start gap-3">
                      <Icon size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{record.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{record.applicationNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{record.startup}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">{record.type}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${STATUS_COLORS[record.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{record.status}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {record.jurisdiction.map(j => <span key={j} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-mono">{j}</span>)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {record.drdo_share > 0 ? (
                      <div className="flex items-center gap-1 text-primary-700 text-sm font-semibold">
                        <Shield size={12} /> {record.drdo_share}%
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-500">{record.filingDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${STATUS_COLORS[selected.status] || 'bg-gray-100 text-gray-600 border-gray-200'} mb-2 inline-block`}>{selected.status}</span>
                <h3 className="font-display font-bold text-gray-900 text-lg leading-tight">{selected.title}</h3>
                <p className="text-xs text-gray-400 font-mono mt-1">{selected.applicationNo}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 text-xl font-bold hover:text-gray-600">×</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                ['Type', selected.type], ['Startup', selected.startup], ['Filing Date', selected.filingDate],
                ['Grant Date', selected.grantDate || 'Pending'], ['Expiry Date', selected.expiryDate],
                ['DRDO Share', selected.drdo_share > 0 ? `${selected.drdo_share}%` : '—'],
                ['Startup Share', `${selected.startup_share}%`], ['Licensing', selected.licensing],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="text-sm font-semibold text-gray-800">{v}</div>
                </div>
              ))}
            </div>
            {selected.inventors.length > 0 && (
              <div className="mb-5">
                <div className="text-sm font-semibold text-gray-700 mb-2">Inventors</div>
                <div className="flex gap-2 flex-wrap">
                  {selected.inventors.map(inv => (
                    <span key={inv} className="px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg text-xs">{inv}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-5">
              <div className="text-sm font-semibold text-gray-700 mb-2">Jurisdictions</div>
              <div className="flex gap-2">
                {selected.jurisdiction.map(j => <span key={j} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-mono">{j}</span>)}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-primary-500 text-dark-950 rounded-lg text-sm font-semibold">View Full Record</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add IPR Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-display font-bold text-gray-900 text-lg mb-5">Add IPR Record</h3>
            <div className="space-y-4">
              {[
                ['Title of IP', 'Full title of the intellectual property'],
                ['Application Number', 'IN2024XXXXXXX or PCT/IN2024/...'],
                ['Filing Date', ''],
                ['Startup / Owner', ''],
              ].map(([label, placeholder]) => (
                <div key={label}>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
                  <input className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder={placeholder} type={label.includes('Date') ? 'date' : 'text'} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">IPR Type</label>
                  <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-400">
                    <option>Patent</option><option>Trademark</option><option>Copyright</option><option>Design</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">DRDO Ownership %</label>
                  <input type="number" min="0" max="100" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-400" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-primary-500 text-dark-950 rounded-lg text-sm font-semibold">Save Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
