import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Rocket, ClipboardCheck, BookOpen,
  Shield, Settings, LogOut, Menu, X,
  Bell, GraduationCap, ChevronRight, Database,
  Users, Building2, Globe, FileText,
  FolderKanban, MessageSquare, GitBranch, FolderOpen,
  Star, Zap, Calendar, UserCheck, ThumbsUp, Link2,
} from "lucide-react";

// ── OpenI brand tokens (light theme – matches openi.ai) ───────
const C = {
  gold:        "#D5AA5B",   // primary gold (buttons, active)
  goldDark:    "#C9983F",   // hover gold
  goldLight:   "rgba(213,170,91,0.12)",
  goldBorder:  "rgba(213,170,91,0.35)",
  white:       "#ffffff",
  pageBg:      "#f5f5f5",   // light grey page background
  sidebarBg:   "#ffffff",   // white sidebar
  sidebarBorder: "#e8e8e8",
  topbarBg:    "#ffffff",
  topbarBorder: "#eeeeee",
  textPrimary: "#1a1a1a",   // near-black headings
  textSecond:  "#555555",   // body text
  textMuted:   "#888888",   // muted labels
  activeText:  "#D5AA5B",   // active nav item text
  activeBg:    "rgba(213,170,91,0.10)",
  activeBorder:"rgba(213,170,91,0.30)",
  hoverBg:     "#f7f3ec",   // nav hover
};

const NAV = [
  { to: "/dashboard",                label: "Overview",         Icon: LayoutDashboard, end: true },
  { to: "/dashboard/evaluate",       label: "8-Vector Eval",    Icon: ClipboardCheck,  badge: "NEW" },
  { to: "/dashboard/startups",       label: "Startups",         Icon: Rocket },
  { to: "/dashboard/evaluations",    label: "Programs",         Icon: FileText },
  { to: "/dashboard/cohorts",        label: "Cohorts",          Icon: GraduationCap },
  { to: "/dashboard/mentors",        label: "Mentors",          Icon: Users },
  { to: "/dashboard/ipr",            label: "IPR Database",     Icon: Shield },
  { to: "/dashboard/infrastructure", label: "Infrastructure",   Icon: Building2 },
  { to: "/dashboard/knowledge",      label: "Knowledge",        Icon: BookOpen },
  { to: "/dashboard/crawling",       label: "Crawling",         Icon: Globe },
  { to: "/dashboard/register",       label: "Register Startup", Icon: Database },
  { to: "/dashboard/pipeline",       label: "Pipeline",         Icon: GitBranch },
  { to: "/dashboard/projects",       label: "Projects",         Icon: FolderKanban },
  { to: "/dashboard/messaging",      label: "Messaging",        Icon: MessageSquare, badge: "NEW" },
  { to: "/dashboard/documents",      label: "Documents",        Icon: FolderOpen },
  { to: "/dashboard/watchlist",      label: "Watchlists",       Icon: Star },
  { to: "/dashboard/deeptech",       label: "DeepTech Qual.",   Icon: Zap },
  { to: "/dashboard/events",         label: "Events",           Icon: Calendar },
  { to: "/dashboard/sme",            label: "SME Experts",      Icon: UserCheck },
  { to: "/dashboard/feedback",       label: "Feedback",         Icon: ThumbsUp },
  { to: "/dashboard/govt-apis",      label: "Govt. APIs",       Icon: Link2 },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/dashboard/login");
  };

  return (
    <div style={{ display:"flex", height:"100vh", background: C.pageBg, overflow:"hidden" }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:"fixed", inset:0, zIndex:20, background:"rgba(0,0,0,0.4)" }}
          className="lg:hidden"
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        style={{
          width:"240px",
          background: C.sidebarBg,
          borderRight: `1px solid ${C.sidebarBorder}`,
          display:"flex", flexDirection:"column", flexShrink:0,
          position:"relative", zIndex:30,
          boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
        }}
        className={`
          fixed lg:static inset-y-0 left-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div style={{
          display:"flex", alignItems:"center", gap:"10px",
          padding:"18px 20px",
          borderBottom: `1px solid ${C.sidebarBorder}`,
          flexShrink:0,
        }}>
          <img
            src="/openi-logo.png"
            alt="OpenI"
            style={{ height:34, width:"auto", maxWidth:100, objectFit:"contain" }}
            onError={e => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div style={{
            display:"none", width:34, height:34, borderRadius:9,
            background: C.gold, alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Shield size={17} color="#fff" />
          </div>
          <div>
            <div style={{ color: C.textPrimary, fontSize:12, fontWeight:700, lineHeight:"1.3" }}>DRDO Innovation Hub</div>
            <div style={{ color: C.gold, fontSize:10, marginTop:1, fontWeight:500 }}>OpenI Platform</div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
          {NAV.map(({ to, label, Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 12px", borderRadius:8, marginBottom:2,
                fontSize:13, fontWeight: isActive ? 600 : 500,
                textDecoration:"none",
                transition:"all 0.15s",
                background: isActive ? C.activeBg : "transparent",
                color: isActive ? C.activeText : C.textSecond,
                border: isActive ? `1px solid ${C.activeBorder}` : "1px solid transparent",
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.style.background.includes("0.10")) {
                  e.currentTarget.style.background = C.hoverBg;
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.background.includes("0.10")) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon size={15} style={{ flexShrink:0 }} />
              <span style={{ flex:1 }}>{label}</span>
              {badge && (
                <span style={{
                  fontSize:9, fontWeight:700, padding:"2px 6px",
                  background: C.gold, color: "#fff", borderRadius:20,
                }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom – settings + logout */}
        <div style={{ padding:"8px", flexShrink:0, borderTop: `1px solid ${C.sidebarBorder}` }}>
          <NavLink
            to="/dashboard/settings"
            style={({ isActive }) => ({
              display:"flex", alignItems:"center", gap:10,
              padding:"9px 12px", borderRadius:8, marginBottom:2,
              fontSize:13, fontWeight:500, textDecoration:"none",
              color: isActive ? C.activeText : C.textSecond,
              background: isActive ? C.activeBg : "transparent",
            })}
          >
            <Settings size={15} />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"9px 12px", borderRadius:8,
              width:"100%", fontSize:13, fontWeight:500,
              color: C.textMuted, background:"transparent",
              border:"none", cursor:"pointer", transition:"all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color="#e53e3e"; e.currentTarget.style.background="rgba(229,62,62,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.color=C.textMuted; e.currentTarget.style.background="transparent"; }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>

        {/* User pill */}
        {user && (
          <div style={{
            padding:"12px 16px",
            borderTop: `1px solid ${C.sidebarBorder}`,
            display:"flex", alignItems:"center", gap:10,
            flexShrink:0, background:"#fafafa",
          }}>
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background: C.goldLight, color: C.gold,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:700, flexShrink:0,
              border: `1.5px solid ${C.goldBorder}`,
            }}>
              {(user.name || user.email)?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ color: C.textPrimary, fontSize:12, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {user.name || user.email}
              </div>
              <div style={{ color: C.textMuted, fontSize:11, textTransform:"capitalize" }}>
                {user.role || "User"}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        {/* Top bar */}
        <header style={{
          height:54,
          borderBottom: `1px solid ${C.topbarBorder}`,
          background: C.topbarBg,
          display:"flex", alignItems:"center",
          padding:"0 20px", gap:12, flexShrink:0,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="lg:hidden"
            style={{ padding:"6px", color: C.textMuted, background:"transparent", border:"none", cursor:"pointer", borderRadius:8 }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <div style={{ flex:1, fontSize:12, color: C.textMuted, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ color: C.gold, fontWeight:700 }}>DRDO Innovation Hub</span>
            <ChevronRight size={12} />
            <span style={{ color: C.textSecond }}>Dashboard</span>
          </div>

          {/* Right side */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button style={{
              position:"relative", padding:8, color: C.textMuted,
              background:"transparent", border:"none", cursor:"pointer", borderRadius:8,
            }}>
              <Bell size={16} />
              <span style={{
                position:"absolute", top:6, right:6,
                width:6, height:6, borderRadius:"50%",
                background: C.gold,
              }} />
            </button>
            {user && (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%",
                  background: C.goldLight, color: C.gold,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:700, border: `1.5px solid ${C.goldBorder}`,
                }}>
                  {(user.name || user.email)?.[0]?.toUpperCase()}
                </div>
                <span style={{ color: C.textSecond, fontSize:13 }} className="hidden sm:block">
                  {user.name || user.email}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:"auto", background: C.pageBg }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
