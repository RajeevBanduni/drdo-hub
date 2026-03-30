import { useState, useEffect } from 'react';
import { documentAPI } from '../../services/api';
import {
  FolderOpen, Folder, FileText, File, FileImage, FileCode,
  Upload, Download, Search, Filter, Plus, Trash2, Eye,
  ChevronRight, Lock, Globe, Users, Star, Clock,
  MoreHorizontal, Grid, List, ArrowLeft, Share2,
  Shield, CheckCircle2, AlertTriangle,
} from 'lucide-react';

const G = '#D5AA5B';
const GH = '#C9983F';

const card = {
  background: '#ffffff',
  border: '1px solid #eeeeee',
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

// File type configs
const FILE_TYPES = {
  pdf:  { color: '#dc2626', bg: '#fef2f2', icon: FileText, label: 'PDF' },
  docx: { color: '#2563eb', bg: '#eff6ff', icon: FileText, label: 'DOC' },
  xlsx: { color: '#16a34a', bg: '#f0fdf4', icon: File,     label: 'XLS' },
  pptx: { color: '#ea580c', bg: '#fff7ed', icon: File,     label: 'PPT' },
  png:  { color: '#7c3aed', bg: '#f5f3ff', icon: FileImage,label: 'IMG' },
  jpg:  { color: '#7c3aed', bg: '#f5f3ff', icon: FileImage,label: 'IMG' },
  zip:  { color: '#64748b', bg: '#f8fafc', icon: File,     label: 'ZIP' },
  default: { color: '#64748b', bg: '#f8fafc', icon: File,  label: 'FILE' },
};

const getFileType = (name) => {
  const ext = name.split('.').pop().toLowerCase();
  return FILE_TYPES[ext] || FILE_TYPES.default;
};

const FOLDERS = [
  {
    id: 'f1', name: 'Program Documents',    icon: Folder, count: 12, color: G,
    children: [
      { id: 'f1a', name: 'ArmorTech AI',       icon: Folder, count: 5, color: G, children: [] },
      { id: 'f1b', name: 'DroneShield Systems', icon: Folder, count: 4, color: G, children: [] },
      { id: 'f1c', name: 'QuantumDefense',      icon: Folder, count: 3, color: G, children: [] },
    ],
  },
  {
    id: 'f2', name: 'Evaluation Reports',   icon: Folder, count: 8,  color: '#2563eb', children: [],
  },
  {
    id: 'f3', name: 'Contracts & Legal',    icon: Folder, count: 6,  color: '#dc2626', children: [],
  },
  {
    id: 'f4', name: 'Technical Specs',      icon: Folder, count: 15, color: '#7c3aed', children: [],
  },
  {
    id: 'f5', name: 'Financial Records',    icon: Folder, count: 10, color: '#16a34a', children: [],
  },
  {
    id: 'f6', name: 'IPR Documents',        icon: Folder, count: 7,  color: '#ea580c', children: [],
  },
];

// FILES are loaded from API

const ACCESS_STYLE = {
  public:     { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: Globe,   label: 'Public' },
  internal:   { bg: '#fff8ec', color: G,          border: 'rgba(213,170,91,0.4)', icon: Users, label: 'Internal' },
  restricted: { bg: '#fef2f2', color: '#dc2626',  border: '#fecaca', icon: Lock,   label: 'Restricted' },
};

export default function DocumentRepository() {
  const [view, setView]           = useState('list');   // 'list' | 'grid'
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [search, setSearch]       = useState('');
  const [accessFilter, setAccessFilter] = useState('All');
  const [showStarred, setShowStarred] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [files, setFiles]         = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    documentAPI.list()
      .then(data => {
        const docs = data.documents || data || [];
        const normalized = docs.map(d => ({
          id: d.id,
          name: d.name || d.title || '',
          folder: d.folder || d.category || 'Program Documents',
          size: d.size || d.file_size || '—',
          type: d.type || d.file_type || (d.name ? d.name.split('.').pop() : 'pdf'),
          uploaded: d.uploaded_at || d.created_at ? new Date(d.uploaded_at || d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          by: d.uploaded_by || d.author || '',
          access: d.access || 'internal',
          starred: d.starred || false,
          tags: d.tags || [],
        }));
        setFiles(normalized);
      })
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleFolder = (id) => setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) return (
    <div style={{ padding: 28, background: '#f5f5f5', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: 14 }}>Loading documents...</p>
    </div>
  );

  const filteredFiles = files.filter(f => {
    const matchFolder = !selectedFolder || f.folder === selectedFolder;
    const matchSearch = (f.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (f.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchAccess = accessFilter === 'All' || f.access === accessFilter;
    const matchStar = !showStarred || f.starred;
    return matchFolder && matchSearch && matchAccess && matchStar;
  });

  const totalSize = files.reduce((s, f) => s + (parseFloat(f.size) || 0), 0).toFixed(1) + ' MB';
  const totalFiles = files.length;

  return (
    <div style={{ padding: 28, maxWidth: 1200, background: '#f5f5f5', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>Document Repository</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>Centralised storage for all DRDO program documents</p>
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
          <Upload size={14} /> Upload Document
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Documents',  value: totalFiles, icon: FileText,    bg: '#fff8ec', fg: G },
          { label: 'Total Size',       value: totalSize,  icon: FolderOpen,  bg: '#f0fdf4', fg: '#16a34a' },
          { label: 'Restricted Files', value: files.filter(f => f.access === 'restricted').length, icon: Lock, bg: '#fef2f2', fg: '#dc2626' },
          { label: 'Starred',          value: files.filter(f => f.starred).length, icon: Star, bg: '#fdf4ff', fg: '#9333ea' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>

        {/* Sidebar: Folder tree */}
        <div style={{ ...card, padding: 16, alignSelf: 'start' }}>
          <h3 style={{ margin: '0 0 14px', color: '#1a1a1a', fontSize: 13, fontWeight: 700 }}>Folders</h3>
          {/* All files */}
          <div
            onClick={() => setSelectedFolder(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
              background: !selectedFolder ? 'rgba(213,170,91,0.1)' : 'transparent',
              border: !selectedFolder ? '1px solid rgba(213,170,91,0.25)' : '1px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <FolderOpen size={14} color={G} />
            <span style={{ fontSize: 12, fontWeight: !selectedFolder ? 700 : 500, color: !selectedFolder ? G : '#555', flex: 1 }}>All Documents</span>
            <span style={{ fontSize: 10, color: '#aaa' }}>{files.length}</span>
          </div>
          {/* Folder tree */}
          {FOLDERS.map(folder => (
            <div key={folder.id}>
              <div
                onClick={() => {
                  setSelectedFolder(folder.name);
                  if (folder.children?.length > 0) toggleFolder(folder.id);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                  background: selectedFolder === folder.name ? 'rgba(213,170,91,0.1)' : 'transparent',
                  border: selectedFolder === folder.name ? '1px solid rgba(213,170,91,0.25)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (selectedFolder !== folder.name) e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={e => { if (selectedFolder !== folder.name) e.currentTarget.style.background = 'transparent'; }}
              >
                {folder.children?.length > 0 ? (
                  <ChevronRight size={10} color="#aaa" style={{ transform: expandedFolders[folder.id] ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                ) : <div style={{ width: 10 }} />}
                <Folder size={13} color={folder.color} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#555', flex: 1 }}>{folder.name}</span>
                <span style={{ fontSize: 10, color: '#aaa' }}>{folder.count}</span>
              </div>
              {/* Children */}
              {expandedFolders[folder.id] && folder.children?.map(child => (
                <div key={child.id}
                  onClick={() => setSelectedFolder(child.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px 7px 28px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                    background: selectedFolder === child.name ? 'rgba(213,170,91,0.08)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (selectedFolder !== child.name) e.currentTarget.style.background = '#fafafa'; }}
                  onMouseLeave={e => { if (selectedFolder !== child.name) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Folder size={12} color={child.color} />
                  <span style={{ fontSize: 11, color: '#666', flex: 1 }}>{child.name}</span>
                  <span style={{ fontSize: 10, color: '#aaa' }}>{child.count}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 14, paddingTop: 12 }}>
            <button
              onClick={() => setShowStarred(!showStarred)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', width: '100%',
                background: showStarred ? 'rgba(213,170,91,0.1)' : 'transparent',
                border: showStarred ? '1px solid rgba(213,170,91,0.25)' : '1px solid transparent',
              }}
            >
              <Star size={13} color={showStarred ? G : '#aaa'} style={{ fill: showStarred ? G : 'none' }} />
              <span style={{ fontSize: 12, color: showStarred ? G : '#555', fontWeight: showStarred ? 700 : 500 }}>Starred</span>
            </button>
          </div>
        </div>

        {/* Main: file list */}
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input
                placeholder="Search documents, tags…"
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
            {/* Access filter */}
            <div style={{ display: 'flex', gap: 5 }}>
              {['All', 'public', 'internal', 'restricted'].map(f => (
                <button key={f} onClick={() => setAccessFilter(f)} style={{
                  padding: '7px 11px', borderRadius: 8, fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                  border: '1.5px solid', cursor: 'pointer',
                  background: accessFilter === f ? G : '#fff',
                  color: accessFilter === f ? '#fff' : '#666',
                  borderColor: accessFilter === f ? G : '#eee',
                }}>{f}</button>
              ))}
            </div>
            {/* View toggle */}
            <div style={{ display: 'flex', background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 3, gap: 2 }}>
              {[{ v: 'list', Icon: List }, { v: 'grid', Icon: Grid }].map(({ v, Icon }) => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: view === v ? G : 'transparent',
                  color: view === v ? '#fff' : '#888',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>

          {/* Breadcrumb */}
          {selectedFolder && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 12, color: '#888' }}>
              <button onClick={() => setSelectedFolder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G, fontWeight: 600, fontSize: 12, padding: 0 }}>All Documents</button>
              <ChevronRight size={12} />
              <span style={{ color: '#1a1a1a', fontWeight: 600 }}>{selectedFolder}</span>
            </div>
          )}

          {/* Grid view */}
          {view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {filteredFiles.map(f => {
                const ft = getFileType(f.name);
                const FIcon = ft.icon;
                const as = ACCESS_STYLE[f.access];
                const AIcon = as.icon;
                return (
                  <div key={f.id}
                    style={{ ...card, padding: 16, cursor: 'pointer', transition: 'box-shadow 0.15s', position: 'relative' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
                  >
                    {f.starred && <Star size={10} style={{ position: 'absolute', top: 10, right: 10, fill: G, color: G }} />}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: ft.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      <FIcon size={20} color={ft.color} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ft.color, marginBottom: 4 }}>{ft.label}</div>
                    <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 500, marginBottom: 6, wordBreak: 'break-word', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: '#aaa', marginBottom: 6 }}>{f.size} · {f.uploaded}</div>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 20, background: as.bg, color: as.color, border: `1px solid ${as.border}`, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <AIcon size={8} />{as.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List view */
            <div style={{ ...card, overflow: 'hidden' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 90px 100px 80px 80px', gap: 12, padding: '10px 18px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
                {['Name', 'Folder', 'Size', 'Uploaded', 'Access', 'Actions'].map(h => (
                  <span key={h} style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{h}</span>
                ))}
              </div>
              {filteredFiles.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontSize: 13 }}>No documents found</div>
              )}
              {filteredFiles.map((f, i) => {
                const ft = getFileType(f.name);
                const FIcon = ft.icon;
                const as = ACCESS_STYLE[f.access];
                const AIcon = as.icon;
                return (
                  <div key={f.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr 120px 90px 100px 80px 80px', gap: 12,
                    padding: '12px 18px',
                    borderBottom: i < filteredFiles.length - 1 ? '1px solid #f5f5f5' : 'none',
                    alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: ft.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FIcon size={14} color={ft.color} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {f.starred && <Star size={9} style={{ fill: G, color: G, marginRight: 4, verticalAlign: 'middle' }} />}
                          {f.name}
                        </div>
                        <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                          {f.tags.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 20, background: '#f5f5f5', color: '#888', border: '1px solid #eee' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Folder */}
                    <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.folder}</span>
                    {/* Size */}
                    <span style={{ fontSize: 11, color: '#888' }}>{f.size}</span>
                    {/* Date */}
                    <div>
                      <div style={{ fontSize: 11, color: '#555' }}>{f.uploaded}</div>
                      <div style={{ fontSize: 10, color: '#aaa' }}>{f.by}</div>
                    </div>
                    {/* Access */}
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: as.bg, color: as.color, border: `1px solid ${as.border}`, display: 'inline-flex', alignItems: 'center', gap: 3, width: 'fit-content' }}>
                      <AIcon size={8} />{as.label}
                    </span>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[Eye, Download, Share2].map((Icon, idx) => (
                        <button key={idx} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', borderRadius: 6 }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#555'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; }}
                        >
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredFiles.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#aaa', textAlign: 'right' }}>
              Showing {filteredFiles.length} of {files.length} documents
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
