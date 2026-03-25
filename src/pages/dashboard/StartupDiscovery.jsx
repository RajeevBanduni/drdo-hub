import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STARTUPS } from '../../data/mockData';
import { Search, Filter, Star, Cpu, MapPin, Users, DollarSign, Shield, Bookmark, BookmarkCheck, SlidersHorizontal, ChevronDown, BarChart3, Target, Award } from 'lucide-react';

const SECTORS = ['All', 'Defence Electronics', 'Aerospace & Defence', 'Cybersecurity', 'Robotics & Autonomous Systems', 'Life Sciences & CBRN', 'Semiconductors'];
const STAGES = ['All', 'Pre-seed', 'Seed', 'Series A', 'Series B'];
const TRL_OPTIONS = ['All', '1-3', '4-6', '7-9'];

function ScoreBar({ score }) {
  const color = score >= 85 ? 'bg-accent-500' : score >= 70 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-7">{score}</span>
    </div>
  );
}

function StartupCard({ startup, onWatchlist, watchlisted, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-dark-950 font-bold text-sm flex-shrink-0">{startup.logo}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-gray-900 text-sm">{startup.name}</h3>
              {startup.deeptech && <Cpu size={12} className="text-primary-500" />}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> {startup.location}</div>
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); onWatchlist(startup.id); }} className={`p-1.5 rounded-lg transition-all ${watchlisted ? 'text-primary-500 bg-primary-50' : 'text-gray-300 hover:text-primary-400'}`}>
          {watchlisted ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{startup.description}</p>

      <div className="flex gap-1.5 mb-3 flex-wrap">
        <span className="px-2 py-0.5 bg-primary-50 text-primary-700 border border-primary-100 text-xs rounded-full">{startup.sector}</span>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{startup.technology}</span>
        <span className={`px-2 py-0.5 text-xs rounded-full ${startup.stage === 'Series A' || startup.stage === 'Series B' ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600'}`}>{startup.stage}</span>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>DRDO Score</span>
        </div>
        <ScoreBar score={startup.score} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-gray-100">
        {[['TRL', startup.trl], ['Patents', startup.patents], ['Employees', startup.employees]].map(([label, val]) => (
          <div key={label}>
            <div className="text-sm font-bold text-gray-800">{val}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StartupDiscovery() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [stage, setStage] = useState('All');
  const [trl, setTrl] = useState('All');
  const [deeptech, setDeeptech] = useState(false);
  const [watchlist, setWatchlist] = useState(STARTUPS.filter(s => s.watchlisted).map(s => s.id));
  const [sortBy, setSortBy] = useState('score');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('grid');

  const toggleWatchlist = (id) => setWatchlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const filtered = STARTUPS
    .filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.technology.toLowerCase().includes(search.toLowerCase()) && !s.sector.toLowerCase().includes(search.toLowerCase())) return false;
      if (sector !== 'All' && s.sector !== sector) return false;
      if (stage !== 'All' && s.stage !== stage) return false;
      if (deeptech && !s.deeptech) return false;
      if (trl !== 'All') {
        const [min, max] = trl.split('-').map(Number);
        if (s.trl < min || s.trl > max) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'trl') return b.trl - a.trl;
      if (sortBy === 'funding') return b.funding - a.funding;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Startup Discovery</h1>
          <p className="text-gray-500 text-sm mt-0.5">{STARTUPS.length.toLocaleString()} startups · Filter by sector, technology, and DRDO relevance</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <BarChart3 size={15} /> Export Watchlist
          </button>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-400 text-sm shadow-sm" placeholder="Search by name, sector, technology, or problem keyword..." />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-primary-500 text-dark-950 border-primary-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <SlidersHorizontal size={15} /> Filters
        </button>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:border-primary-400">
          <option value="score">Sort: DRDO Score</option>
          <option value="trl">Sort: TRL</option>
          <option value="funding">Sort: Funding</option>
          <option value="name">Sort: A-Z</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Sector</label>
              <div className="space-y-1.5">
                {SECTORS.map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="sector" checked={sector === s} onChange={() => setSector(s)} className="text-primary-500" />
                    <span className="text-sm text-gray-700">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Stage</label>
              <div className="space-y-1.5">
                {STAGES.map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="stage" checked={stage === s} onChange={() => setStage(s)} className="text-primary-500" />
                    <span className="text-sm text-gray-700">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">TRL Range</label>
              <div className="space-y-1.5">
                {TRL_OPTIONS.map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trl" checked={trl === t} onChange={() => setTrl(t)} className="text-primary-500" />
                    <span className="text-sm text-gray-700">{t === 'All' ? 'All TRLs' : `TRL ${t}`}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Special Filters</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={deeptech} onChange={e => setDeeptech(e.target.checked)} className="rounded text-primary-500" />
                  <span className="text-sm text-gray-700 flex items-center gap-1"><Cpu size={12} className="text-primary-500" /> DeepTech Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-500" />
                  <span className="text-sm text-gray-700">DPIIT Recognised</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-500" />
                  <span className="text-sm text-gray-700">Has Active Patent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-500" />
                  <span className="text-sm text-gray-700">Academia Founded</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-500" />
                  <span className="text-sm text-gray-700">Ex-Defence Founders</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button onClick={() => { setSector('All'); setStage('All'); setTrl('All'); setDeeptech(false); }} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm">Reset Filters</button>
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">{filtered.length}</span> startups found · <span className="font-semibold text-primary-600">{watchlist.length}</span> in watchlist</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(startup => (
          <StartupCard
            key={startup.id}
            startup={startup}
            watchlisted={watchlist.includes(startup.id)}
            onWatchlist={toggleWatchlist}
            onClick={() => navigate(`/dashboard/startup-profile/${startup.id}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto text-gray-200 mb-4" />
          <h3 className="font-semibold text-gray-600">No startups match your filters</h3>
          <p className="text-gray-400 text-sm mt-1">Try adjusting the search or filters</p>
        </div>
      )}
    </div>
  );
}
