import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Search, Send, Paperclip, MoreHorizontal,
  ChevronDown, Check, CheckCheck, Bell, BellOff, Archive,
  Plus, Users, Lock, Hash, Star, Clock, Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const G = '#D5AA5B';

const card = {
  background: '#ffffff',
  border: '1px solid #eeeeee',
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const CONVERSATIONS = [
  {
    id: 1,
    type: 'direct',
    name: 'Dr. Arjun Kapoor',
    role: 'Evaluator',
    avatar: 'A',
    lastMsg: 'The QKD pilot results look very promising. Can we schedule a review next week?',
    time: '10:32 AM',
    unread: 2,
    online: true,
    messages: [
      { id: 1, from: 'Dr. Arjun Kapoor', self: false, text: 'Hi, I have reviewed the QuantumDefense prototype report.', time: '10:15 AM', read: true },
      { id: 2, from: 'Me', self: true, text: 'Great! What are your initial thoughts?', time: '10:18 AM', read: true },
      { id: 3, from: 'Dr. Arjun Kapoor', self: false, text: 'The QKD pilot results look very promising. Can we schedule a review next week?', time: '10:32 AM', read: false },
    ],
  },
  {
    id: 2,
    type: 'group',
    name: 'ArmorTech AI – Project Team',
    role: 'Project Group',
    avatar: 'A',
    lastMsg: 'Field trial date confirmed: 30 Apr 2025',
    time: 'Yesterday',
    unread: 5,
    online: false,
    messages: [
      { id: 1, from: 'Lt. V. Singh', self: false, text: 'Site survey completed. Location cleared for trials.', time: 'Yesterday 3:00 PM', read: true },
      { id: 2, from: 'Dr. R. Sharma', self: false, text: 'Excellent! Let\'s confirm date with the startup.', time: 'Yesterday 3:05 PM', read: true },
      { id: 3, from: 'ArmorTech AI', self: false, text: 'We can be ready by 30th April.', time: 'Yesterday 4:20 PM', read: false },
      { id: 4, from: 'Dr. R. Sharma', self: false, text: 'Field trial date confirmed: 30 Apr 2025', time: 'Yesterday 4:45 PM', read: false },
    ],
  },
  {
    id: 3,
    type: 'direct',
    name: 'CyberSentinel Team',
    role: 'Startup',
    avatar: 'C',
    lastMsg: 'We have submitted the requirement document for review.',
    time: 'Mon',
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: 'CyberSentinel', self: false, text: 'Hello, we have completed the initial architecture draft.', time: 'Mon 11:00 AM', read: true },
      { id: 2, from: 'Me', self: true, text: 'Please share it via the document repository.', time: 'Mon 11:15 AM', read: true },
      { id: 3, from: 'CyberSentinel', self: false, text: 'We have submitted the requirement document for review.', time: 'Mon 12:30 PM', read: true },
    ],
  },
  {
    id: 4,
    type: 'group',
    name: 'DRDO Lab Directors – AI Cohort',
    role: 'Internal Group',
    avatar: 'D',
    lastMsg: 'Quarterly review scheduled for 15 May',
    time: 'Sun',
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: 'Dr. P. Nair', self: false, text: 'All evaluators please submit Q1 reports by EOD Friday.', time: 'Sun 9:00 AM', read: true },
      { id: 2, from: 'Dr. S. Mehta', self: false, text: 'Noted. Will share the CyberSentinel evaluation by Thursday.', time: 'Sun 9:30 AM', read: true },
      { id: 3, from: 'Dr. A. Kapoor', self: false, text: 'Quarterly review scheduled for 15 May', time: 'Sun 10:00 AM', read: true },
    ],
  },
  {
    id: 5,
    type: 'direct',
    name: 'DroneShield Systems',
    role: 'Startup',
    avatar: 'D',
    lastMsg: 'Hardware procurement approval is still pending.',
    time: 'Fri',
    unread: 1,
    online: true,
    messages: [
      { id: 1, from: 'DroneShield', self: false, text: 'We are waiting on the procurement approval to proceed.', time: 'Fri 2:00 PM', read: true },
      { id: 2, from: 'Me', self: true, text: 'I have escalated it to the admin team.', time: 'Fri 2:10 PM', read: true },
      { id: 3, from: 'DroneShield', self: false, text: 'Hardware procurement approval is still pending.', time: 'Fri 5:30 PM', read: false },
    ],
  },
];

export default function Messaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [active, setActive] = useState(CONVERSATIONS[0]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All | Unread | Groups | Direct
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active]);

  const filteredConvs = conversations.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.lastMsg.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' ||
                        (filter === 'Unread' && c.unread > 0) ||
                        (filter === 'Groups' && c.type === 'group') ||
                        (filter === 'Direct' && c.type === 'direct');
    return matchSearch && matchFilter;
  });

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: user?.name || 'Me',
      self: true,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    const updated = conversations.map(c => c.id === active.id
      ? { ...c, messages: [...c.messages, newMsg], lastMsg: newMsg.text, time: newMsg.time }
      : c
    );
    setConversations(updated);
    setActive(prev => ({ ...prev, messages: [...prev.messages, newMsg], lastMsg: newMsg.text }));
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const openConv = (c) => {
    // Mark as read
    const updated = conversations.map(cv => cv.id === c.id ? { ...cv, unread: 0 } : cv);
    setConversations(updated);
    setActive({ ...c, unread: 0 });
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div style={{ padding: 28, maxWidth: 1200, background: '#f5f5f5', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: 22, fontWeight: 700 }}>
            Messaging
            {totalUnread > 0 && (
              <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#dc2626', color: '#fff' }}>{totalUnread}</span>
            )}
          </h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>Internal comms between DRDO, startups & evaluators</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', background: G, color: '#fff',
          border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700,
          boxShadow: '0 2px 10px rgba(213,170,91,0.3)',
        }}>
          <Plus size={14} /> New Conversation
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, height: 'calc(100vh - 220px)', minHeight: 500 }}>

        {/* Sidebar: conversation list */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  paddingLeft: 28, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                  background: '#f8f8f8', border: '1.5px solid #eee', borderRadius: 8,
                  fontSize: 12, outline: 'none', color: '#1a1a1a',
                }}
              />
            </div>
            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {['All', 'Unread', 'Direct', 'Groups'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  border: '1.5px solid', cursor: 'pointer',
                  background: filter === f ? G : '#fff',
                  color: filter === f ? '#fff' : '#888',
                  borderColor: filter === f ? G : '#eee',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConvs.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 12 }}>No conversations</div>
            )}
            {filteredConvs.map(c => (
              <div
                key={c.id}
                onClick={() => openConv(c)}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #f5f5f5',
                  cursor: 'pointer',
                  background: active?.id === c.id ? 'rgba(213,170,91,0.07)' : 'transparent',
                  borderLeft: active?.id === c.id ? `3px solid ${G}` : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (active?.id !== c.id) e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={e => { if (active?.id !== c.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: c.type === 'group' ? 10 : '50%',
                      background: 'rgba(213,170,91,0.12)', color: G,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 15, border: '1.5px solid rgba(213,170,91,0.25)',
                    }}>{c.avatar}</div>
                    {c.online && (
                      <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#16a34a', border: '2px solid #fff' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: c.unread > 0 ? 700 : 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{c.name}</span>
                      <span style={{ fontSize: 10, color: '#bbb', flexShrink: 0 }}>{c.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{c.lastMsg}</span>
                      {c.unread > 0 && (
                        <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: G, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>{c.type === 'group' ? '👥 ' : '👤 '}{c.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        {active ? (
          <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Chat header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: active.type === 'group' ? 10 : '50%',
                  background: 'rgba(213,170,91,0.12)', color: G,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15, border: '1.5px solid rgba(213,170,91,0.25)',
                }}>{active.avatar}</div>
                {active.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#16a34a', border: '2px solid #fff' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#1a1a1a', fontSize: 14, fontWeight: 700 }}>{active.name}</div>
                <div style={{ color: '#888', fontSize: 11 }}>{active.online ? 'Online' : active.role}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[Bell, Archive, MoreHorizontal].map((Icon, i) => (
                  <button key={i} style={{ padding: 7, background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', borderRadius: 7 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {active.messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.self ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
                  {!msg.self && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(213,170,91,0.12)', color: G,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, border: '1.5px solid rgba(213,170,91,0.25)',
                    }}>{msg.from[0]}</div>
                  )}
                  <div style={{ maxWidth: '70%' }}>
                    {!msg.self && (
                      <div style={{ fontSize: 10, color: '#aaa', marginBottom: 3, paddingLeft: 4 }}>{msg.from}</div>
                    )}
                    <div style={{
                      padding: '9px 13px',
                      borderRadius: msg.self ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.self ? G : '#f5f5f5',
                      color: msg.self ? '#fff' : '#1a1a1a',
                      fontSize: 13, lineHeight: 1.5,
                      boxShadow: msg.self ? '0 2px 8px rgba(213,170,91,0.25)' : 'none',
                    }}>{msg.text}</div>
                    <div style={{ fontSize: 10, color: '#bbb', marginTop: 3, textAlign: msg.self ? 'right' : 'left', display: 'flex', alignItems: 'center', gap: 3, justifyContent: msg.self ? 'flex-end' : 'flex-start' }}>
                      {msg.time}
                      {msg.self && <CheckCheck size={10} color={msg.read ? '#16a34a' : '#aaa'} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', borderRadius: 7 }}>
                <Paperclip size={15} />
              </button>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  rows={1}
                  placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '9px 12px', background: '#f8f8f8',
                    border: '1.5px solid #eee', borderRadius: 10,
                    fontSize: 13, outline: 'none', resize: 'none',
                    color: '#1a1a1a', fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = G}
                  onBlur={e => e.target.style.borderColor = '#eee'}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: input.trim() ? G : '#f0f0f0',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (input.trim()) e.currentTarget.style.background = '#C9983F'; }}
                onMouseLeave={e => { if (input.trim()) e.currentTarget.style.background = G; }}
              >
                <Send size={15} color={input.trim() ? '#fff' : '#ccc'} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <MessageSquare size={40} color="#ddd" />
            <p style={{ color: '#aaa', fontSize: 13 }}>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
