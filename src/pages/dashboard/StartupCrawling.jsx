import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe, RefreshCw, Play, Pause, CheckCircle2, XCircle, Clock,
  AlertCircle, Search, Filter, ChevronDown, ExternalLink, Plus,
  Download, Eye, ThumbsUp, ThumbsDown, Zap, Database, TrendingUp,
  Activity, AlertTriangle, RotateCcw, Settings, Info, Loader2
} from 'lucide-react';
import { crawlAPI } from '../../services/api';

const STATUS_CONFIG = {
  pending_review: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  approved: { label: 'Approved', color: 'bg-accent-100 text-accent-700', dot: 'bg-accent-500' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
};

const JOB_STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'text-accent-600', icon: CheckCircle2, bg: 'bg-accent-50' },
  running: { label: 'Running', color: 'text-blue-600', icon: Activity, bg: 'bg-blue-50' },
  queued: { label: 'Queued', color: 'text-gray-500', icon: Clock, bg: 'bg-gray-50' },
  failed: { label: 'Failed', color: 'text-red-600', icon: XCircle, bg: 'bg-red-50' },
};

const SOURCE_TYPE_COLOR = {
  Government: 'bg-blue-100 text-blue-700',
  'Industry Body': 'bg-purple-100 text-purple-700',
  Incubator: 'bg-orange-100 text-orange-700',
  Academia: 'bg-green-100 text-green-700',
};

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function JobStatusBadge({ status }) {
  const cfg = JOB_STATUS_CONFIG[status] || JOB_STATUS_CONFIG.queued;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function ConfidenceBadge({ score }) {
  const color = score >= 90 ? 'text-accent-600 bg-accent-50' : score >= 75 ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 bg-gray-100';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}% match
    </span>
  );
}

export default function StartupCrawling() {
  const [activeTab, setActiveTab] = useState('discovered');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [selectedStartup, setSelectedStartup] = useState(null);

  // Data from API
  const [sources, setSources] = useState([]);
  const [crawledStartups, setCrawledStartups] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total_indexed: 0, new_today: 0, pending_review: 0, approved: 0, active_sources: 0, total_sources: 0 });

  const [loading, setLoading] = useState(true);
  const [triggerSource, setTriggerSource] = useState(null);

  // ── Fetch data on mount ────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [srcRes, startupRes, jobRes, statsRes] = await Promise.all([
        crawlAPI.listSources(),
        crawlAPI.listStartups(),
        crawlAPI.listJobs(),
        crawlAPI.stats(),
      ]);
      setSources(srcRes);
      setCrawledStartups(startupRes);
      setJobs(jobRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load crawl data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived ────────────────────────────────────────────────
  const sectors = [...new Set(crawledStartups.map(s => s.sector).filter(Boolean))];

  const filteredStartups = crawledStartups.filter(s => {
    const q = search.toLowerCase();
    const tags = s.tags || [];
    const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.sector || '').toLowerCase().includes(q) || (s.technology || '').toLowerCase().includes(q) || tags.some(t => t.toLowerCase().includes(q));
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchSector = filterSector === 'all' || s.sector === filterSector;
    return matchSearch && matchStatus && matchSector;
  });

  const pendingCount = stats.pending_review;
  const approvedCount = stats.approved;

  // ── Handlers ───────────────────────────────────────────────
  const handleApprove = async (id) => {
    try {
      const updated = await crawlAPI.approveStartup(id);
      setCrawledStartups(prev => prev.map(s => s.id === id ? updated : s));
      setStats(prev => ({ ...prev, pending_review: Math.max(0, prev.pending_review - 1), approved: prev.approved + 1 }));
      if (selectedStartup?.id === id) setSelectedStartup(updated);
    } catch (err) { console.error('Approve failed:', err); }
  };

  const handleReject = async (id) => {
    try {
      const updated = await crawlAPI.rejectStartup(id);
      setCrawledStartups(prev => prev.map(s => s.id === id ? updated : s));
      setStats(prev => ({ ...prev, pending_review: Math.max(0, prev.pending_review - 1) }));
      if (selectedStartup?.id === id) setSelectedStartup(updated);
    } catch (err) { console.error('Reject failed:', err); }
  };

  const handleToggleSource = async (id) => {
    try {
      const updated = await crawlAPI.toggleSource(id);
      setSources(prev => prev.map(s => s.id === id ? updated : s));
    } catch (err) { console.error('Toggle failed:', err); }
  };

  const handleCrawlNow = async (source) => {
    setTriggerSource(source.id);
    try {
      const newJob = await crawlAPI.triggerCrawl(source.id);
      setJobs(prev => [newJob, ...prev]);
      // Poll for completion after 4 seconds
      setTimeout(async () => {
        try {
          const [updatedJobs, updatedSources, updatedStats] = await Promise.all([
            crawlAPI.listJobs(),
            crawlAPI.listSources(),
            crawlAPI.stats(),
          ]);
          setJobs(updatedJobs);
          setSources(updatedSources);
          setStats(updatedStats);
        } catch (_) {}
        setTriggerSource(null);
      }, 4000);
    } catch (err) {
      console.error('Crawl trigger failed:', err);
      setTriggerSource(null);
    }
  };

  const tabs = [
    { id: 'discovered', label: 'Discovered Startups', count: crawledStartups.length },
    { id: 'sources', label: 'Crawl Sources', count: sources.length },
    { id: 'jobs', label: 'Crawl Jobs', count: jobs.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={20} className="text-primary-500" />
              <h1 className="text-xl font-display font-bold text-gray-900">Startup Crawling</h1>
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                {stats.new_today} new today
              </span>
            </div>
            <p className="text-sm text-gray-500">Automatically discover and ingest startups from government databases and innovation portals</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={15} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
              <Plus size={15} />
              Add Source
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Indexed" value={stats.total_indexed.toLocaleString()} sub="Across all sources" icon={Database} color="bg-primary-500" />
          <StatCard label="Pending Review" value={pendingCount} sub="Needs your attention" icon={AlertCircle} color="bg-yellow-400" />
          <StatCard label="Approved" value={approvedCount} sub="Added to database" icon={CheckCircle2} color="bg-accent-500" />
          <StatCard label="Active Sources" value={stats.active_sources} sub={`of ${stats.total_sources} configured`} icon={Globe} color="bg-blue-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── Discovered Startups Tab ── */}
        {activeTab === 'discovered' && (
          <div className="flex gap-5">
            {/* List */}
            <div className="flex-1 min-w-0">
              {/* Filters */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, sector, technology, tags..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-primary-400 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={filterSector}
                  onChange={e => setFilterSector(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-primary-400 bg-white"
                >
                  <option value="all">All Sectors</option>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Pending review banner */}
              {pendingCount > 0 && filterStatus === 'all' && (
                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-4">
                  <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    <span className="font-semibold">{pendingCount} startups</span> are awaiting review. Approve to add them to the main database.
                  </p>
                  <button
                    onClick={() => setFilterStatus('pending_review')}
                    className="ml-auto text-xs font-semibold text-yellow-700 underline"
                  >
                    View all
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {filteredStartups.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Globe size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No startups match your filters</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                ) : filteredStartups.map(startup => {
                  const statusCfg = STATUS_CONFIG[startup.status];
                  const isSelected = selectedStartup?.id === startup.id;
                  return (
                    <div
                      key={startup.id}
                      onClick={() => setSelectedStartup(isSelected ? null : startup)}
                      className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'border-primary-400 ring-1 ring-primary-200' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold text-primary-600">
                            {startup.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{startup.name}</h3>
                              {startup.deeptech && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                  <Zap size={10} /> DeepTech
                                </span>
                              )}
                              <ConfidenceBadge score={startup.confidence} />
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{startup.sector} · {startup.technology} · {startup.location}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{startup.description}</p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <span className="text-xs text-gray-400">via {startup.source}</span>
                              <span className="text-xs text-gray-400">TRL {startup.trl}</span>
                              <span className="text-xs text-gray-400">{startup.stage}</span>
                              <span className="text-xs text-primary-600 font-medium">{startup.matched_thrust}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusCfg?.color || 'bg-gray-100 text-gray-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg?.dot || 'bg-gray-400'}`} />
                            {statusCfg?.label || startup.status}
                          </span>
                          {startup.status === 'pending_review' && (
                            <div className="flex gap-1">
                              <button
                                onClick={e => { e.stopPropagation(); handleApprove(startup.id); }}
                                className="flex items-center gap-1 px-2.5 py-1 bg-accent-50 text-accent-700 rounded-lg text-xs font-semibold hover:bg-accent-100 transition-colors"
                              >
                                <ThumbsUp size={11} /> Approve
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); handleReject(startup.id); }}
                                className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                              >
                                <ThumbsDown size={11} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Panel */}
            {selectedStartup && (
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-gray-900">Details</h3>
                    <button onClick={() => setSelectedStartup(null)} className="text-gray-400 hover:text-gray-600">
                      <XCircle size={16} />
                    </button>
                  </div>

                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-xl font-bold text-primary-600 mb-3">
                    {selectedStartup.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-gray-900">{selectedStartup.name}</h4>
                  <p className="text-sm text-gray-500 mb-4">{selectedStartup.location}</p>

                  <p className="text-sm text-gray-600 mb-4">{selectedStartup.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    {[
                      { label: 'Sector', value: selectedStartup.sector },
                      { label: 'Technology', value: selectedStartup.technology },
                      { label: 'Stage', value: selectedStartup.stage },
                      { label: 'TRL', value: selectedStartup.trl },
                      { label: 'Employees', value: selectedStartup.employees },
                      { label: 'Founded', value: selectedStartup.founded },
                      { label: 'DPIIT No.', value: selectedStartup.dpiit || 'Not registered' },
                      { label: 'CIN', value: selectedStartup.cin },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-2">
                        <span className="text-gray-400 flex-shrink-0">{label}</span>
                        <span className="text-gray-700 text-right text-xs">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">DRDO Thrust Area</p>
                    <p className="text-sm text-primary-600 font-medium">{selectedStartup.matched_thrust}</p>
                    <ConfidenceBadge score={selectedStartup.confidence} />
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {(selectedStartup.tags || []).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {selectedStartup.rejection_reason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                      <p className="text-xs text-red-600"><span className="font-semibold">Rejection reason:</span> {selectedStartup.rejection_reason}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <Globe size={12} />
                    <a href={`https://${selectedStartup.website}`} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline flex items-center gap-1">
                      {selectedStartup.website} <ExternalLink size={10} />
                    </a>
                  </div>

                  {selectedStartup.status === 'pending_review' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(selectedStartup.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors"
                      >
                        <ThumbsUp size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(selectedStartup.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                      >
                        <ThumbsDown size={14} /> Reject
                      </button>
                    </div>
                  )}
                  {selectedStartup.status === 'approved' && (
                    <div className="flex items-center gap-2 bg-accent-50 text-accent-700 rounded-xl px-3 py-2 text-sm font-medium">
                      <CheckCircle2 size={14} /> Added to startup database
                    </div>
                  )}
                  {selectedStartup.status === 'rejected' && (
                    <button
                      onClick={() => handleApprove(selectedStartup.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <RotateCcw size={14} /> Undo Rejection
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Sources Tab ── */}
        {activeTab === 'sources' && (
          <div className="space-y-3">
            {sources.map(source => (
              <div key={source.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="text-2xl w-10 text-center flex-shrink-0">{source.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{source.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${SOURCE_TYPE_COLOR[source.type] || 'bg-gray-100 text-gray-600'}`}>
                      {source.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${source.status === 'active' ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-500'}`}>
                      {source.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{source.url}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span><span className="font-semibold text-gray-700">{(source.total_indexed || 0).toLocaleString()}</span> total indexed</span>
                    <span><span className="font-semibold text-accent-600">+{source.new_today || 0}</span> today</span>
                    <span>Last crawled {source.last_crawled ? new Date(source.last_crawled).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Never'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCrawlNow(source)}
                    disabled={triggerSource === source.id || source.status === 'paused'}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {triggerSource === source.id ? (
                      <><RefreshCw size={12} className="animate-spin" /> Crawling...</>
                    ) : (
                      <><Play size={12} /> Crawl Now</>
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleSource(source.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {source.status === 'active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
                  </button>
                  <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                    <Settings size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Crawl Jobs Tab ── */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            {jobs.map(job => {
              const cfg = JOB_STATUS_CONFIG[job.status] || JOB_STATUS_CONFIG.queued;
              const Icon = cfg.icon;
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                        <Icon size={15} className={cfg.color} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{job.source_name}</h3>
                          <JobStatusBadge status={job.status} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {job.started_at ? `Started ${new Date(job.started_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Not started yet'}
                          {job.completed_at && ` · Completed ${new Date(job.completed_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                      </div>
                    </div>
                    {job.status === 'completed' && (
                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-center">
                          <p className="font-bold text-gray-900">{job.found}</p>
                          <p className="text-gray-400">Found</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-accent-600">{job.added}</p>
                          <p className="text-gray-400">Added</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-yellow-500">{job.duplicates}</p>
                          <p className="text-gray-400">Dupes</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-red-400">{job.rejected}</p>
                          <p className="text-gray-400">Rejected</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {job.status === 'running' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>In progress — {job.found} found so far</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {job.status === 'failed' && job.error && (
                    <div className="mt-3 flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-3 py-2 text-xs">
                      <AlertTriangle size={12} />
                      {job.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
