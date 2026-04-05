import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Users, Briefcase, Target, Network, Sparkles,
  Search, Calendar, MessageSquare, FileText, Award, Database,
  Zap, TrendingUp, CheckCircle2, Rocket, Building2, Landmark,
  GraduationCap, FlaskConical, Home, BookOpen,
} from 'lucide-react';

// Brand colors
const GOLD = '#D5AA5B';
const GOLD_DARK = '#C9983F';
const GOLD_LIGHT = 'rgba(213, 170, 91, 0.1)';
const BLUE = '#3b82f6';
const DARK = '#1a1a1a';
const GRAY = '#6b7280';
const LIGHT_GRAY = '#f5f5f5';
const BORDER = '#e5e7eb';

// ── Reusable section wrapper ───────────────────────────────────
function Section({ children, bg = '#fff', className = '' }) {
  return (
    <section className={`py-20 px-6 ${className}`} style={{ background: bg }}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

// ── Feature card ───────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      className="p-6 rounded-xl transition-all"
      style={{ background: '#fff', border: `1px solid ${BORDER}` }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = GOLD;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(213,170,91,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
        style={{ background: GOLD_LIGHT }}
      >
        <Icon size={22} style={{ color: GOLD }} />
      </div>
      <h3 className="text-base font-bold mb-2" style={{ color: DARK }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{description}</p>
    </div>
  );
}

// ── Pricing card ───────────────────────────────────────────────
function PricingCard({ name, price, priceNote, features, cta, ctaLink, featured = false }) {
  return (
    <div
      className="rounded-2xl p-8 relative transition-all"
      style={{
        background: '#fff',
        border: featured ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
        boxShadow: featured ? '0 12px 32px rgba(213,170,91,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: featured ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {featured && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: GOLD, color: '#fff' }}
        >
          MOST POPULAR
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: DARK }}>{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold" style={{ color: DARK }}>{price}</span>
          {priceNote && <span className="text-sm" style={{ color: GRAY }}>{priceNote}</span>}
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: GRAY }}>
            <CheckCircle2 size={16} style={{ color: GOLD, marginTop: 2, flexShrink: 0 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to={ctaLink}
        className="block text-center py-3 rounded-lg text-sm font-bold transition-all"
        style={{
          background: featured ? GOLD : '#fff',
          color: featured ? '#fff' : GOLD,
          border: featured ? 'none' : `1.5px solid ${GOLD}`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = featured ? GOLD_DARK : GOLD_LIGHT;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = featured ? GOLD : '#fff';
        }}
      >
        {cta}
      </Link>
    </div>
  );
}

// ── How It Works step ──────────────────────────────────────────
function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
        style={{ background: GOLD_LIGHT, color: GOLD }}
      >
        {number}
      </div>
      <h3 className="text-base font-bold mb-2" style={{ color: DARK }}>{title}</h3>
      <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: GRAY }}>{description}</p>
    </div>
  );
}

// ── Persona list item for provider/seeker cards ───────────────
function PersonaListItem({ icon: Icon, label, color }) {
  return (
    <li className="flex items-center gap-2 text-sm" style={{ color: DARK }}>
      <Icon size={14} style={{ color }} />
      <span>{label}</span>
    </li>
  );
}

// ── Landing Page ───────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fff' }}>
      {/* ═══════════════════════════════════════════════════════════
          HEADER (sticky)
          ═══════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 px-6 py-4 border-b backdrop-blur"
        style={{ background: 'rgba(255,255,255,0.92)', borderColor: BORDER }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/openi-logo.png"
              alt="OpenI"
              style={{ height: 38, width: 'auto', maxWidth: 140, objectFit: 'contain' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ background: GOLD, display: 'none' }}
            >
              <Shield size={20} color="#fff" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: GRAY }}>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/login"
              className="hidden sm:inline text-sm font-semibold px-4 py-2 transition-colors"
              style={{ color: DARK }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: GOLD, color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative px-6 pt-20 pb-24 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${LIGHT_GRAY} 0%, #fff 100%)`,
        }}
      >
        {/* Decorative gradient orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Eyebrow tag */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-wide"
            style={{ background: GOLD_LIGHT, color: GOLD_DARK }}
          >
            <Sparkles size={14} />
            INDIA&apos;S OPEN INNOVATION PLATFORM
          </div>

          {/* Big headline */}
          <h1
            className="font-bold tracking-tight mb-6"
            style={{
              color: DARK,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.05,
              fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
            }}
          >
            Partner. Source. <span style={{ color: GOLD }}>Invest.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed"
            style={{ color: GRAY }}
          >
            OpenI is the open innovation platform where corporates, investors, and governments
            connect with India&apos;s most promising startups — discover, evaluate, and collaborate on one platform.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-bold transition-all shadow-lg"
              style={{ background: GOLD, color: '#fff', boxShadow: '0 8px 24px rgba(213,170,91,0.3)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = GOLD_DARK;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started — It&apos;s Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/dashboard/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-bold transition-all"
              style={{ background: '#fff', color: DARK, border: `1.5px solid ${BORDER}` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
              onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
            >
              Sign In
            </Link>
          </div>

          {/* Micro trust line */}
          <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: GRAY }}>
            Built for Deep-Tech · AI · Quantum · Defence · Cybersecurity
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <Section bg="#fff">
        <div id="how-it-works" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
            How OpenI Works
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: GRAY }}>
            Three simple steps to join the open innovation ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Step
            number="1"
            title="Register Your Persona"
            description="Pick from 10 persona types — startup, corporate, investor, government, mentor, lab, and more. Each persona has a tailored profile and dashboard."
          />
          <Step
            number="2"
            title="Discover & Connect"
            description="Browse the directory, explore challenges, and use the 8-vector evaluation framework to find the right partners, investments, or innovations."
          />
          <Step
            number="3"
            title="Collaborate & Grow"
            description="Schedule meetings, submit proposals, track projects, and manage the full innovation lifecycle from first contact to successful pilot."
          />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          FOR PROVIDERS / FOR SEEKERS
          ═══════════════════════════════════════════════════════════ */}
      <Section bg={LIGHT_GRAY}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
            Built for Every Stakeholder
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: GRAY }}>
            Whether you have innovation to offer or innovation to find, OpenI connects you to the right people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Innovation Providers */}
          <div
            className="rounded-2xl p-8 transition-all"
            style={{ background: '#fff', border: `1px solid ${BORDER}` }}
            onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
            onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: GOLD_LIGHT }}
              >
                <Rocket size={22} style={{ color: GOLD }} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: DARK }}>Innovation Providers</h3>
                <p className="text-xs font-semibold" style={{ color: GOLD }}>GET DISCOVERED</p>
              </div>
            </div>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: GRAY }}>
              Showcase your startup, research, or technology. Get funded, mentored, and connected to corporates looking for your innovation.
            </p>
            <ul className="space-y-2 mb-6">
              <PersonaListItem icon={Rocket} label="Startups — Deep-tech, SaaS, healthtech, defence tech" color={GOLD} />
              <PersonaListItem icon={GraduationCap} label="Students — Research projects, theses, internships" color={GOLD} />
              <PersonaListItem icon={BookOpen} label="Academia — University labs, research centres, IP licensing" color={GOLD} />
            </ul>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-bold transition-all"
              style={{ color: GOLD }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD_DARK}
              onMouseLeave={e => e.currentTarget.style.color = GOLD}
            >
              Join as Provider
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Innovation Seekers */}
          <div
            className="rounded-2xl p-8 transition-all"
            style={{ background: '#fff', border: `1px solid ${BORDER}` }}
            onMouseEnter={e => e.currentTarget.style.borderColor = BLUE}
            onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59, 130, 246, 0.1)' }}
              >
                <Target size={22} style={{ color: BLUE }} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: DARK }}>Innovation Seekers</h3>
                <p className="text-xs font-semibold" style={{ color: BLUE }}>FIND THE RIGHT STARTUP</p>
              </div>
            </div>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: GRAY }}>
              Source, evaluate, and partner with high-potential startups. Solve strategic challenges with the next generation of innovators.
            </p>
            <ul className="space-y-2 mb-6">
              <PersonaListItem icon={Building2} label="Corporates — Find startups for PoCs, pilots, acquisitions" color={BLUE} />
              <PersonaListItem icon={Landmark} label="Government — iDEX, defence, e-governance tech providers" color={BLUE} />
              <PersonaListItem icon={TrendingUp} label="Investors — Pre-seed to Series C deeptech opportunities" color={BLUE} />
              <PersonaListItem icon={Users} label="Mentors · Labs · Incubators · Accelerators" color={BLUE} />
            </ul>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-bold transition-all"
              style={{ color: BLUE }}
              onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.color = BLUE}
            >
              Join as Seeker
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════════════════════ */}
      <Section bg="#fff">
        <div id="features" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
            Everything You Need in One Platform
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: GRAY }}>
            From startup discovery to deal closure — purpose-built tools for every stage of the innovation lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            icon={Briefcase}
            title="Challenge Marketplace"
            description="Post open innovation challenges, receive structured applications, evaluate and award solutions."
          />
          <FeatureCard
            icon={Search}
            title="Directory Search"
            description="Browse 10 persona types with filters for sector, city, skills, and technology stack."
          />
          <FeatureCard
            icon={Award}
            title="8-Vector Evaluation"
            description="Score startups across 103 criteria in 8 vectors — the gold standard for deep-tech evaluation."
          />
          <FeatureCard
            icon={Calendar}
            title="Meetings & RSVPs"
            description="Schedule 1:1, group, demo, and review meetings with auto-confirmation and calendar invites."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Real-time Messaging"
            description="Cross-persona conversations with direct and group chat, polling-based live updates."
          />
          <FeatureCard
            icon={Zap}
            title="DeepTech Assessment"
            description="16-question framework to qualify if a startup is truly deep-tech across 5 dimensions."
          />
          <FeatureCard
            icon={FileText}
            title="IPR Database"
            description="Track patents, trademarks, copyrights, and designs across the startup ecosystem."
          />
          <FeatureCard
            icon={Database}
            title="Document Repository"
            description="Centralised document storage with public, internal, and restricted access controls."
          />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          PRICING
          ═══════════════════════════════════════════════════════════ */}
      <Section bg={LIGHT_GRAY}>
        <div id="pricing" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: GRAY }}>
            Start free. Upgrade when you need more. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PricingCard
            name="Free"
            price="₹0"
            priceNote="/forever"
            features={[
              '1 challenge per month',
              '3 applications per month',
              '5 meetings per month',
              '5 file uploads per month',
              'Basic directory access',
              'All 10 persona types',
            ]}
            cta="Get Started"
            ctaLink="/register"
          />
          <PricingCard
            name="Pro"
            price="₹999"
            priceNote="/month"
            features={[
              '5 challenges per month',
              '20 applications per month',
              '50 meetings per month',
              '100 file uploads per month',
              'Advanced search & filters',
              'Priority email support',
              'Recommendation engine',
            ]}
            cta="Upgrade to Pro"
            ctaLink="/register"
            featured
          />
          <PricingCard
            name="Enterprise"
            price="₹4,999"
            priceNote="/month"
            features={[
              'Unlimited challenges',
              'Unlimited applications',
              'Unlimited meetings',
              'Unlimited uploads',
              'Dedicated account manager',
              'Custom integrations',
              'SSO + audit logs',
            ]}
            cta="Contact Sales"
            ctaLink="/register"
          />
        </div>

        <p className="text-center text-sm mt-8" style={{ color: GRAY }}>
          All plans include SSL, data encryption, and daily backups. Annual billing saves 17%.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-6"
        style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <Network size={40} color="#fff" className="mx-auto mb-5 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Join the Ecosystem?
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Join thousands of innovators, investors, and enterprises building the future of deep-tech in India.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-base font-bold transition-all shadow-lg"
            style={{ background: '#fff', color: GOLD_DARK }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Get Started — It&apos;s Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="px-6 py-12" style={{ background: DARK, color: '#9ca3af' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Logo & tagline */}
            <div className="col-span-2">
              <img
                src="/openi-logo.png"
                alt="OpenI"
                style={{ height: 36, width: 'auto', maxWidth: 120, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-sm mt-4 max-w-xs leading-relaxed">
                The open innovation platform connecting India&apos;s deep-tech ecosystem. Partner. Source. Invest.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="mailto:contact@openi.tech" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: '#333' }}>
            <p className="text-xs">
              © 2026 OpenI Hub · Built for India&apos;s deep-tech ecosystem
            </p>
            <p className="text-xs">
              <span style={{ color: GOLD }}>openi.tech</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
