import { useNavigate, Link } from 'react-router-dom';
import { PERSONA_CATEGORIES, PERSONAS, PROVIDER_ROLES, SEEKER_ROLES } from '../../config/personas';
import {
  Rocket, GraduationCap, BookOpen, Building2, Landmark,
  TrendingUp, Users, FlaskConical, Home, Zap, Shield, ArrowRight,
} from 'lucide-react';

const ICON_MAP = {
  Rocket, GraduationCap, BookOpen, Building2, Landmark,
  TrendingUp, Users, FlaskConical, Home, Zap,
};

function PersonaCard({ role, persona, onClick }) {
  const Icon = ICON_MAP[persona.icon] || Rocket;
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all"
      style={{ background: '#fff', border: '1px solid #e5e7eb' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = persona.color; e.currentTarget.style.boxShadow = `0 4px 16px ${persona.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${persona.color}15` }}
        >
          <Icon size={20} style={{ color: persona.color }} />
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{persona.label}</div>
          <div className="text-xs" style={{ color: '#6b7280' }}>{persona.description}</div>
        </div>
        <ArrowRight size={16} className="ml-auto" style={{ color: '#9ca3af' }} />
      </div>
    </button>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ background: '#fff', borderColor: '#e5e7eb' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#D5AA5B' }}>
            <Shield size={20} color="#fff" />
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: '#1a1a1a' }}>OpenI Hub</div>
            <div className="text-xs" style={{ color: '#D5AA5B' }}>Open Innovation Platform</div>
          </div>
        </div>
        <Link
          to="/dashboard/login"
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: '#D5AA5B', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#c49a4a'}
          onMouseLeave={e => e.currentTarget.style.background = '#D5AA5B'}
        >
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <div className="text-center py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
          Join the Open Innovation Ecosystem
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: '#6b7280' }}>
          Connect startups, investors, mentors, corporates, labs, and accelerators on one platform.
          Choose your persona to get started.
        </p>
      </div>

      {/* Two-column persona selector */}
      <div className="max-w-5xl mx-auto w-full px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Innovation Providers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ background: '#D5AA5B' }} />
              <h2 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>
                {PERSONA_CATEGORIES.provider.label}s
              </h2>
            </div>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
              {PERSONA_CATEGORIES.provider.description}
            </p>
            <div className="space-y-3">
              {PROVIDER_ROLES.map(role => (
                <PersonaCard
                  key={role}
                  role={role}
                  persona={PERSONAS[role]}
                  onClick={() => navigate(`/register?type=${role}`)}
                />
              ))}
            </div>
          </div>

          {/* Innovation Seekers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ background: '#3b82f6' }} />
              <h2 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>
                {PERSONA_CATEGORIES.seeker.label}s
              </h2>
            </div>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
              {PERSONA_CATEGORIES.seeker.description}
            </p>
            <div className="space-y-3">
              {SEEKER_ROLES.map(role => (
                <PersonaCard
                  key={role}
                  role={role}
                  persona={PERSONAS[role]}
                  onClick={() => navigate(`/register?type=${role}`)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Already have an account */}
        <div className="text-center mt-10">
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/dashboard/login" className="font-semibold" style={{ color: '#D5AA5B' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-xs" style={{ color: '#9ca3af' }}>
        &copy; 2024 OpenI Hub. All rights reserved.
      </footer>
    </div>
  );
}
