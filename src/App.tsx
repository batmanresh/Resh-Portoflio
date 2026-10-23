import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './supabase';
import {
  ArrowUpRight,
  Copy,
  Check,
  ArrowDown,
  Play,
  Film,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  RotateCcw,
  Sliders,
  Briefcase,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
export type Metric = { id?: string; value: string; label: string };

export type Experience = {
  id?: string;
  role: string;
  organization: string;
  period: string;
  impactBadge?: string;
  summary: string;
};

export type Project = {
  id: string;
  category: string;
  title: string;
  summary: string;
  role: string;
  mediaType?: 'image' | 'video';
  image: string;
  outcome: string;
  link?: string;
  media?: { url: string; type: 'image' | 'video'; thumbnailUrl?: string }[];
};

export type Principle = {
  id?: string;
  number: string;
  title: string;
  copy: string;
};

export type PortfolioContent = {
  name: string;
  roleLine: string;
  intro: string;
  email: string;
  location: string;
  availability: string;
  linkedinUrl: string;
  cvUrl: string;
  cvHeading: string;
  cvDescription: string;
  projectsHeading: string;
  projectsEyebrow: string;
  impactHeading: string;
  impactEyebrow: string;
  experienceHeading: string;
  experienceEyebrow: string;
  approachHeading: string;
  approachEyebrow: string;
  metrics: Metric[];
  experience: Experience[];
  projects: Project[];
  principles: Principle[];
  contactHeading?: string;
  contactAccent?: string;
  contactDescription?: string;
  contactOptions?: string[];
};

// ============================================================================
// DEFAULT CONTENT
// ============================================================================
const DEFAULT_CONTENT: PortfolioContent = {
  name: 'Resham Gurung',
  roleLine: 'Marketing, partnerships & commercial growth',
  intro: 'I bring ideas, people and performance together to help businesses grow. My experience spans brand campaigns, partnerships and lead generation, with a focus on thoughtful strategy and reliable execution.',
  // Public contact address is intentionally unset until the owner adds one.
  email: '',
  location: '',
  availability: '',
  linkedinUrl: 'https://www.linkedin.com/in/resham-gurung',
  cvUrl: '',
  cvHeading: 'Looking for the complete resume?',
  cvDescription: 'Full breakdown of career history, verified revenue metrics, and references.',
  projectsHeading: 'Selected work & creative campaigns.',
  projectsEyebrow: '01 / Selected Work',
  impactHeading: 'Good work should move something forward.',
  impactEyebrow: '02 / Impact',
  experienceHeading: 'The stories behind the numbers.',
  experienceEyebrow: '03 / Experience',
  approachHeading: 'How I like to work.',
  approachEyebrow: '04 / Approach',
  contactHeading: 'A thoughtful conversation',
  contactAccent: 'is a good place to start.',
  contactDescription: 'If you have a role, project or idea in mind, I would be glad to hear about it.',
  contactOptions: ['Discuss a role', 'Explore a project', 'Talk partnerships', 'Something else'],
  metrics: [
    { id: 'm1', value: 'NPR 21.7M+', label: 'Direct revenue delivered' },
    { id: 'm2', value: '80,000+', label: 'Inbound & outbound leads managed' },
    { id: 'm3', value: '2,000+', label: 'Prospective students counselled' },
    { id: 'm4', value: '45+', label: 'Interns led & mentored' },
    { id: 'm5', value: '700+', label: 'Leads generated in a single day' }
  ],
  experience: [
    {
      id: 'exp1',
      role: 'Head of Marketing and Communications',
      organization: 'Asteria · Kathmandu, Nepal',
      period: 'Jan 2026 – Present',
      impactBadge: 'Runway Debut',
      summary: 'Launching an emerging luxury fashion house from the ground up. Bringing high fashion to life on the runway, building VIP relationships, and proving that prestige and commercial pipeline belong in the same room.'
    },
    {
      id: 'exp2',
      role: 'Senior Business Development Officer',
      organization: 'Herald College Kathmandu | University of Wolverhampton',
      period: 'Sep 2024 – Jan 2026',
      impactBadge: 'NPR 21.7M+ Revenue',
      summary: 'Sitting across from 2,000+ prospective students and families, listening to their ambitions, and guiding them into higher education. Led a team of 45+ interns, generated 700+ leads in a single day, and drove NPR 21.7M+ in tuition revenue — proof that genuine empathy scales.'
    },
    {
      id: 'exp3',
      role: 'Partnerships Marketing Officer',
      organization: 'Society Overseas',
      period: 'Mar 2023 – Sep 2024',
      impactBadge: 'Funnel Optimization',
      summary: 'Turning cold online curiosity into trusted consultations. Built automated WhatsApp nurture sequences and college referral alliances so every applicant felt supported rather than sold to.'
    },
    {
      id: 'exp4',
      role: 'Digital Marketing Officer',
      organization: 'The Mari Café',
      period: 'Aug 2022 – Mar 2023',
      impactBadge: 'Community & Footfall',
      summary: 'Giving a local dining room a distinct cultural voice. Used visual storytelling and community activations to turn first-time weekend visitors into lifelong regulars.'
    },
    {
      id: 'exp5',
      role: 'Business Development Officer',
      organization: 'Herald College Kathmandu',
      period: 'Feb 2022 – Aug 2022',
      impactBadge: 'Top Sales Performer',
      summary: 'Where I mastered the art of listening before prescribing. Awarded top annual sales performer by treating consultative admissions as life advice rather than a sales quota.'
    },
    {
      id: 'exp6',
      role: 'Digital Marketing Intern',
      organization: 'Your Own Web Services',
      period: 'Jun 2021 – Jan 2022',
      impactBadge: 'Search & Analytics',
      summary: 'Learned the operational mechanics of digital acquisition from the ground up: auditing search algorithms, analyzing user intent, and reporting performance data.'
    }
  ],
  projects: [
    {
      id: 'asteria-launch',
      category: 'Brand & Events',
      title: 'Asteria — High Fashion Runway Debut',
      summary: 'End-to-end launch staging, media coverage, experiential runway production, and VIP client engagement for an emerging luxury fashion debut.',
      role: 'Marketing Strategy · Runway Staging · VIP Relations',
      mediaType: 'image',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Debuted marquee runway showcase and established high-ticket client acquisition pipeline.'
    },
    {
      id: 'fashion-film',
      category: 'Video & Experiential',
      title: 'Runway Showcase — Behind The Scenes Film',
      summary: 'Event cinematography, behind-the-scenes designer interviews, and influencer social reels capturing the runway launch atmosphere.',
      role: 'Creative Direction · Video Staging · Social PR',
      mediaType: 'video',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Drove 100k+ organic views and high-engagement social coverage across lifestyle channels.'
    },
    {
      id: 'lead-generation',
      category: 'Growth & Performance',
      title: 'The 24-Hour Acquisition Engine',
      summary: 'Full-funnel digital and offline campaign execution supported by custom landing pages and automated WhatsApp workflows to maximize lead velocity.',
      role: 'Campaign Execution · Funnel CRO · Media Buying',
      mediaType: 'image',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Managed 80,000+ total pipeline leads and broke record with 700+ qualified leads in a single day.'
    },
    {
      id: 'sales-leadership',
      category: 'Partnerships',
      title: 'Institutional Alliances & Student Recruitment',
      summary: 'Consultative student counselling, structured sales pipelines, British university degree recruitment, and campus ambassador outreach.',
      role: 'Business Development · Consultative Selling · Leadership',
      mediaType: 'image',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Delivered NPR 21.7M+ tuition revenue, counselled 2,000+ prospective students, and trained 45+ interns.'
    },
    {
      id: 'whatsapp-funnels',
      category: 'Growth & Performance',
      title: 'WhatsApp Automation & Landing Page CRO',
      summary: 'Targeted Meta and Google Search campaigns paired with dedicated landing pages and instant WhatsApp automated nurture workflows.',
      role: 'CRO Funnels · Automation · Performance Ads',
      mediaType: 'image',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Achieved double-digit conversion rate lift and reduced inquiry response time from hours to minutes.'
    },
    {
      id: 'expo-experience',
      category: 'Video & Experiential',
      title: 'University Expo Stage & Interactive Sessions',
      summary: 'Staged multi-day university education pavilions, coordinated live interactive workshops, and managed a 45+ student ambassador outreach squad.',
      role: 'Experiential Events · Stage Production · Outreach',
      mediaType: 'video',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Engaged 2,000+ candidates over a 3-day expo with record on-spot applications.'
    },
    {
      id: 'mari-cafe',
      category: 'Brand & Events',
      title: 'The Mari Café — Dining Culture & Community',
      summary: 'Hyper-local social campaigns, culinary storytelling, and weekend promotional activations designed to convert first-time visitors into regulars.',
      role: 'Local Marketing · Creative Direction · Community',
      mediaType: 'image',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Drove a quantifiable weekend foot traffic surge and boosted repeat customer loyalty.'
    },
    {
      id: 'b2b-alliances',
      category: 'Partnerships',
      title: 'Corporate Sponsorships & Academic Co-Branding',
      summary: 'Establishing co-branded promotional agreements between colleges, corporate sponsors, and creative lifestyle brands.',
      role: 'B2B Negotiation · Sponsorships · Co-Branding',
      mediaType: 'image',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=85',
      outcome: 'Brokered multi-brand partnerships driving recurring referral traffic and brand equity.'
    }
  ],
  principles: [
    {
      id: 'p1',
      number: '01',
      title: 'Strategy into execution.',
      copy: 'Plan and deliver integrated campaigns, lead-generation funnels and brand communications across digital and offline channels.'
    },
    {
      id: 'p2',
      number: '02',
      title: 'Relationships that move work forward.',
      copy: 'Build partnerships, engage clients consultatively, network confidently and connect people with the right opportunities.'
    },
    {
      id: 'p3',
      number: '03',
      title: 'People, performance and follow-through.',
      copy: 'Coordinate events, track campaign performance, mentor teams and improve execution using practical data insights.'
    }
  ]
};

const STORAGE_KEY = 'resham-portfolio-content-v6';
const LEGACY_ADMIN_EMAIL = 'batmanresh007@gmail.com';

function loadContent(): PortfolioContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<PortfolioContent>;
    const publicEmail = parsed.email?.trim().toLowerCase() === LEGACY_ADMIN_EMAIL ? '' : (parsed.email ?? DEFAULT_CONTENT.email);
    const restoreContactCopy = (parsed.contactHeading === 'Got a good feeling' && parsed.contactAccent === 'about this?') || parsed.contactHeading === 'A thoughtful conversation is a good place to start.';
    return { ...DEFAULT_CONTENT, ...parsed, contactHeading: restoreContactCopy ? DEFAULT_CONTENT.contactHeading : (parsed.contactHeading || DEFAULT_CONTENT.contactHeading), contactAccent: restoreContactCopy ? DEFAULT_CONTENT.contactAccent : (parsed.contactAccent || DEFAULT_CONTENT.contactAccent), email: publicEmail, location: '', availability: '' };
  } catch {
    return DEFAULT_CONTENT;
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/** Parse a period string like "Sep 2024 – Jan 2026" into a human duration */
function computeDuration(period: string): string {
  if (!period) return '';
  const MONTHS: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const parts = period.split(/\s*(?:-|\u2013|\u2014|to)\s*/i);
  if (parts.length < 2) {
    // Single year like "2021"
    return '';
  }

  const parseDate = (s: string): Date | null => {
    s = s.trim();
    if (/^present$/i.test(s)) return new Date();
    const tokens = s.split(/\s+/);
    if (tokens.length === 1) {
      // Just a year
      const yr = parseInt(tokens[0]);
      return isNaN(yr) ? null : new Date(yr, 0);
    }
    const mon = MONTHS[tokens[0]];
    const yr = parseInt(tokens[1]);
    if (mon === undefined || isNaN(yr)) return null;
    return new Date(yr, mon);
  };

  const start = parseDate(parts[0]);
  const end = parseDate(parts[1]);
  if (!start || !end) return '';

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months <= 0) months = 1;

  const yrs = Math.floor(months / 12);
  const mos = months % 12;

  if (yrs === 0) return `${mos} mo${mos !== 1 ? 's' : ''}`;
  if (mos === 0) return `${yrs} yr${yrs !== 1 ? 's' : ''}`;
  return `${yrs} yr ${mos} mo${mos !== 1 ? 's' : ''}`;
}

/** Parse metric value like "NPR 21.7M+" into parts for count-up */
function parseMetric(value: string): { prefix: string; num: number; suffix: string } {
  // e.g. "NPR 21.7M+" → prefix="NPR ", num=21.7, suffix="M+"
  // e.g. "80,000+"    → prefix="", num=80000, suffix="+"
  const m = value.match(/^([A-Z\s]*)([0-9,.]+)([KkMm]?\+?)$/);
  if (!m) return { prefix: '', num: 0, suffix: value };
  const prefix = m[1];
  const rawNum = parseFloat(m[2].replace(/,/g, ''));
  const suffix = m[3];
  return { prefix, num: rawNum, suffix };
}

function formatMetricDisplay(prefix: string, num: number, suffix: string): string {
  const hasDec = !Number.isInteger(num);
  const dispNum = hasDec ? num.toFixed(1) : num.toLocaleString();
  return `${prefix}${dispNum}${suffix}`;
}

// ============================================================================
// COUNT-UP HOOK
// ============================================================================
function useCountUp(target: number, duration = 1800, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = eased * target;
      setVal(current);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

// ============================================================================
// METRIC CARD WITH COUNT-UP
// ============================================================================
function MetricCard({
  metric,
  className,
  active,
  isFirst
}: {
  metric: Metric;
  className?: string;
  active: boolean;
  isFirst: boolean;
}) {
  const { prefix, num, suffix } = useMemo(() => parseMetric(metric.value), [metric.value]);
  const animated = useCountUp(num, 1800, active);
  const hasDec = !Number.isInteger(num);

  const displayNum = active
    ? hasDec
      ? animated.toFixed(1)
      : Math.round(animated).toLocaleString()
    : hasDec
    ? num.toFixed(1)
    : num.toLocaleString();

  const displayValue = `${prefix}${displayNum}${suffix}`;

  return (
    <article className={`metric-card ${className ?? ''}`}>
      {isFirst && (
        <p className="text-xs font-bold uppercase tracking-wider text-black/50">
          Primary Benchmark
        </p>
      )}
      <p
        className={`${
          isFirst
            ? 'mt-auto text-[clamp(2.8rem,6vw,5.5rem)] text-black'
            : 'text-[clamp(2.5rem,4.5vw,4.5rem)] text-white'
        } break-words font-extrabold leading-[.9] tracking-[-.07em]`}
      >
        {displayValue}
      </p>
      {!isFirst && <p className="mt-6 text-sm text-white/60">{metric.label}</p>}
      {isFirst && <p className="mt-3 text-sm text-black/60">{metric.label}</p>}
    </article>
  );
}

// ============================================================================
// EXPERIENCE ROW — ACCORDION
// ============================================================================
function ExperienceRow({ item, index }: { item: Experience; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <article className={`experience-entry ${open ? 'experience-entry-open' : ''}`}>
      <button type="button" className="experience-entry-button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="min-w-0 flex-1">
          <span className="experience-entry-period">{item.period}</span>
          <span className={`experience-entry-role mt-1 block text-lg font-extrabold leading-snug tracking-tight ${open ? 'experience-entry-role-open' : ''}`}>{item.role}</span>
          <span className={`experience-entry-company mt-1 block text-sm font-semibold ${open ? 'experience-entry-company-open' : ''}`}>{item.organization}</span>
        </span>
        <span className={`experience-entry-toggle ${open ? 'experience-entry-toggle-open' : ''}`}><ChevronDown className="h-4 w-4" /></span>
      </button>
      {open && <div className="experience-entry-detail"><p className="text-sm leading-relaxed">{item.summary}</p></div>}
    </article>
  );
}

// ============================================================================
// LIGHTBOX
// ============================================================================
function Lightbox({ item, onClose }: { item: Project; onClose: () => void }) {
  const mediaItems: NonNullable<Project['media']> = item.media?.length ? item.media : [{ url: item.image, type: (item.mediaType || 'image') as 'image' | 'video', thumbnailUrl: undefined }];
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [focusPhoto, setFocusPhoto] = useState(false);
  const activeMedia = mediaItems[activeMediaIndex] || mediaItems[0];
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveMediaIndex(index => (index + 1) % mediaItems.length);
      if (e.key === 'ArrowLeft') setActiveMediaIndex(index => (index - 1 + mediaItems.length) % mediaItems.length);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, mediaItems.length]);

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-2 md:p-3"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="lightbox-panel relative flex h-[calc(100svh-16px)] max-h-[96svh] w-[calc(100vw-16px)] max-w-[1600px] flex-col rounded-2xl overflow-hidden bg-[#171715] shadow-2xl md:h-[94svh] md:w-[96vw]">
        <button type="button" onClick={() => setFocusPhoto(value => !value)} className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/65 px-3.5 py-2 text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20" aria-pressed={focusPhoto}>
          {focusPhoto ? 'Show project details' : 'Expand photo'}
        </button>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Media */}
        <div className={`lightbox-content flex min-h-0 flex-1 flex-col bg-[#10100f] ${focusPhoto ? 'p-0' : 'p-2 md:p-3'}`}>
          <div className="project-viewer-media relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-black">
            {activeMedia?.type === 'video' ? <video key={activeMedia.url} src={activeMedia.url} controls autoPlay className="h-full max-h-full w-full object-contain" /> : <img key={activeMedia?.url} src={activeMedia?.url} alt={item.title} className="h-full max-h-full w-full object-contain" />}
            {mediaItems.length > 1 && <><button type="button" onClick={() => setActiveMediaIndex(index => (index - 1 + mediaItems.length) % mediaItems.length)} aria-label="Previous media" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/85"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={() => setActiveMediaIndex(index => (index + 1) % mediaItems.length)} aria-label="Next media" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/85"><ChevronRight className="h-5 w-5" /></button></>}
            {mediaItems.length > 1 && <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[10px] text-white">{String(activeMediaIndex + 1).padStart(2, '0')} / {String(mediaItems.length).padStart(2, '0')}</span>}
          </div>
          {!focusPhoto && mediaItems.length > 1 && <div className="mt-2 flex gap-2 overflow-x-auto px-1 pb-1">{mediaItems.map((media, index) => <button key={`${media.url}-${index}`} onClick={() => setActiveMediaIndex(index)} aria-label={`Show photo ${index + 1} of ${mediaItems.length}`} aria-pressed={activeMediaIndex === index} className={`relative h-12 w-[72px] shrink-0 overflow-hidden rounded-lg border-2 transition-opacity md:h-14 md:w-20 ${activeMediaIndex === index ? 'border-[#e48967]' : 'border-white/10 opacity-60 hover:opacity-100'}`}>{media.thumbnailUrl ? <img src={media.thumbnailUrl} alt="" className="h-full w-full object-cover" /> : media.type === 'video' ? <span className="flex h-full items-center justify-center bg-[#292927] text-white"><Film className="h-4 w-4" /></span> : <img src={media.url} alt="" className="h-full w-full object-cover" />}</button>)}</div>}
        </div>

        {/* Info bar */}
        {!focusPhoto && <div className="lightbox-info shrink-0 border-t border-white/10 px-4 py-3 text-white md:px-6 md:py-4">
          <button onClick={onClose} className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white md:hidden" aria-label="Back to work"><ChevronLeft className="h-4 w-4" /> Back to work</button>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="eyebrow text-[#e48967] font-bold mb-1">{item.category}</p>
              <h2 className="text-lg font-extrabold tracking-tight">{item.title}</h2>
              <p className="mt-1 text-sm text-white/60">{item.summary}</p>
            </div>
            {item.outcome && (
              <div className="shrink-0 rounded-xl border border-white/15 bg-white/8 px-4 py-3 max-w-xs">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Outcome</p>
                <p className="text-xs font-semibold text-white/80">{item.outcome}</p>
              </div>
            )}
          </div>
          {item.link?.trim() && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#e48967] underline underline-offset-4 hover:text-white"
            >
              View project ↗
            </a>
          )}
        </div>}
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN PORTAL
// ============================================================================
function AdminPortal({
  content,
  onUpdateContent,
  onReset,
  onClose
}: {
  content: PortfolioContent;
  onUpdateContent: (updated: PortfolioContent) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'profile' | 'pages' | 'json'>('projects');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setAuthenticated(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, []);

  // Project form
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [draggedMediaIndex, setDraggedMediaIndex] = useState<number | null>(null);
  const editFormRef = useRef<HTMLFormElement | null>(null);
  const adminProjectsRef = useRef<HTMLDivElement | null>(null);
  const [editFormTop, setEditFormTop] = useState(0);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', category: 'Brand & Events', mediaType: 'image', image: '', role: '', summary: '', outcome: '', link: ''
  });
  const [mediaDrafts, setMediaDrafts] = useState<{ url: string; type: 'image' | 'video'; thumbnailUrl?: string }[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const captureRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [categoryDraft, setCategoryDraft] = useState('');

  // Experience form
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [draggedExpIndex, setDraggedExpIndex] = useState<number | null>(null);
  const [expForm, setExpForm] = useState<Partial<Experience>>({
    role: '', organization: '', period: '', impactBadge: '', summary: ''
  });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: content.name,
    roleLine: content.roleLine,
    intro: content.intro,
    email: content.email,
    linkedinUrl: content.linkedinUrl,
    cvUrl: content.cvUrl
  });
  const [pageForm, setPageForm] = useState({
    projectsHeading: content.projectsHeading, projectsEyebrow: content.projectsEyebrow,
    impactHeading: content.impactHeading, impactEyebrow: content.impactEyebrow,
    experienceHeading: content.experienceHeading, experienceEyebrow: content.experienceEyebrow,
    approachHeading: content.approachHeading, approachEyebrow: content.approachEyebrow,
    contactHeading: content.contactHeading || '', contactAccent: content.contactAccent || '', contactDescription: content.contactDescription || '',
    contactOptions: (content.contactOptions || []).join('\n'),
    metrics: content.metrics, principles: content.principles
  });

  const [jsonText, setJsonText] = useState(JSON.stringify(content, null, 2));

  useEffect(() => {
    setProfileForm({
      name: content.name,
      roleLine: content.roleLine,
      intro: content.intro,
      email: content.email,
      linkedinUrl: content.linkedinUrl,
      cvUrl: content.cvUrl
    });
    setJsonText(JSON.stringify(content, null, 2));
    setPageForm({ projectsHeading: content.projectsHeading, projectsEyebrow: content.projectsEyebrow,
      impactHeading: content.impactHeading, impactEyebrow: content.impactEyebrow,
      experienceHeading: content.experienceHeading, experienceEyebrow: content.experienceEyebrow,
      approachHeading: content.approachHeading, approachEyebrow: content.approachEyebrow,
      contactHeading: content.contactHeading || '', contactAccent: content.contactAccent || '', contactDescription: content.contactDescription || '',
      contactOptions: (content.contactOptions || []).join('\n'), metrics: content.metrics, principles: content.principles });
  }, [content]);

  const notify = (msg: string) => {
    setStatusMsg(msg);
    window.setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) { setLoginError('Supabase is not configured yet. Add the project URL and anon key to the deployment environment.'); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail.trim(), password: loginPassword });
    if (error) setLoginError(error.message);
    else setLoginError('');
  };

  // --- PROJECT CRUD ---
  const handleSaveProject = (e: FormEvent) => {
    e.preventDefault();
    const media = mediaDrafts.map(item => ({ ...item, url: item.url.trim() })).filter(item => item.url);
    const validUrl = (value: string) => {
      try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
    };
    const projectTitle = (projectForm.title || '').trim();
    if (!projectTitle) { notify('Add a project title before saving.'); return; }
    if (!media.length) { notify('Add at least one photo or video.'); return; }
    if (media.some(item => !validUrl(item.url))) { notify('Use a valid http or https URL for each photo or video.'); return; }
    const requestedCover = media[coverIndex] || media[0];
    if (requestedCover.type === 'video' && !requestedCover.thumbnailUrl && !projectForm.image) { notify('Choose a thumbnail URL or capture a frame for the video cover.'); return; }
    if (projectForm.link?.trim() && !validUrl(projectForm.link.trim())) { notify('Use a valid http or https URL for the project link.'); return; }
    const normalizedForm = { ...projectForm, title: projectTitle, category: projectForm.category?.trim() || 'Brand & Events', link: projectForm.link?.trim() || '' };
    const selectedCover = media[coverIndex] || media[0];
    const savedForm = { ...normalizedForm, media, image: selectedCover?.thumbnailUrl || (selectedCover?.type === 'image' ? selectedCover.url : projectForm.image) || '', mediaType: selectedCover?.type || projectForm.mediaType };
    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = content.projects.map(p => p.id === editingProject.id ? ({ ...p, ...savedForm } as Project) : p);
      notify('Project updated!');
    } else {
      const newProj: Project = {
        id: 'proj-' + Date.now(),
        title: normalizedForm.title,
        category: normalizedForm.category,
        mediaType: savedForm.mediaType || 'image',
        image: savedForm.image || '',
        media: savedForm.media,
        role: projectForm.role || '',
        summary: projectForm.summary || '',
        outcome: projectForm.outcome || '',
        link: projectForm.link || ''
      };
      updatedProjects = [newProj, ...content.projects];
      notify('New project added!');
    }
    onUpdateContent({ ...content, projects: updatedProjects });
    setIsAddingProject(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      onUpdateContent({ ...content, projects: content.projects.filter(p => p.id !== id) });
      notify('Project deleted.');
    }
  };

  const moveProject = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= content.projects.length || fromIndex === toIndex) return;
    const projects = [...content.projects];
    const [moved] = projects.splice(fromIndex, 1);
    projects.splice(toIndex, 0, moved);
    onUpdateContent({ ...content, projects });
  };

  const moveDraftMedia = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= mediaDrafts.length || fromIndex === toIndex) return;
    const reordered = [...mediaDrafts];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setMediaDrafts(reordered);
    setCoverIndex(current => current === fromIndex ? toIndex : fromIndex < current && toIndex >= current ? current - 1 : fromIndex > current && toIndex <= current ? current + 1 : current);
  };

  // --- EXPERIENCE CRUD ---
  const handleSaveExperience = (e: FormEvent) => {
    e.preventDefault();
    const role = (expForm.role || '').trim();
    const organization = (expForm.organization || '').trim();
    const summary = (expForm.summary || '').trim();
    if (!role || !organization || !summary) { notify('Add a role, organization and short description before saving.'); return; }
    const period = (expForm.period || '').trim();
    if (period && !/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{4}\s*(?:-|–|—|to)\s*(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{4}|Present)$/i.test(period)) {
      notify('Use “Mon YYYY – Mon YYYY” or “Mon YYYY – Present” for the period.'); return;
    }
    const normalizedExp = { ...expForm, role, organization, summary, period };
    let updatedExp: Experience[];
    if (editingExp) {
      updatedExp = content.experience.map(exp =>
        (exp.id || exp.role) === (editingExp.id || editingExp.role) ? ({ ...exp, ...normalizedExp } as Experience) : exp
      );
      notify('Role updated!');
    } else {
      const newExp: Experience = {
        id: 'exp-' + Date.now(),
        role: normalizedExp.role,
        organization: normalizedExp.organization,
        period: normalizedExp.period,
        impactBadge: normalizedExp.impactBadge || '',
        summary: normalizedExp.summary
      };
      updatedExp = [newExp, ...content.experience];
      notify('New role added!');
    }
    onUpdateContent({ ...content, experience: updatedExp });
    setIsAddingExp(false);
    setEditingExp(null);
  };

  const handleDeleteExperience = (idx: number) => {
    if (confirm('Delete this role?')) {
      const next = [...content.experience];
      next.splice(idx, 1);
      onUpdateContent({ ...content, experience: next });
      notify('Role deleted.');
    }
  };

  const moveExperience = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= content.experience.length || fromIndex === toIndex) return;
    const experience = [...content.experience];
    const [moved] = experience.splice(fromIndex, 1);
    experience.splice(toIndex, 0, moved);
    onUpdateContent({ ...content, experience });
  };

  // --- PROFILE SAVE ---
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const email = profileForm.email.trim();
    const urlIsValid = (value: string) => !value.trim() || (() => { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } })();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { notify('Enter a valid public contact email or leave it blank.'); return; }
    if (!urlIsValid(profileForm.cvUrl) || !urlIsValid(profileForm.linkedinUrl)) { notify('Profile links must use a valid http or https URL.'); return; }
    onUpdateContent({ ...content, ...profileForm, email, cvUrl: profileForm.cvUrl.trim(), linkedinUrl: profileForm.linkedinUrl.trim() });
    notify('Profile saved!');
  };

  const handleSavePages = (e: FormEvent) => {
    e.preventDefault();
    const contactOptions = [...new Set(pageForm.contactOptions.split('\n').map(s => s.trim()).filter(Boolean))];
    if (contactOptions.length > 6) { notify('Keep contact choices to six or fewer so the contact card stays clear.'); return; }
    if (pageForm.metrics.some(metric => !metric.value.trim() || !metric.label.trim())) { notify('Complete or remove each impact metric before saving.'); return; }
    if (pageForm.principles.some(principle => !principle.title.trim() || !principle.copy.trim())) { notify('Complete each How I Work card before saving.'); return; }
    onUpdateContent({ ...content, ...pageForm, contactOptions });
    notify('Page content saved!');
  };

  // --- JSON SAVE ---
  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonText) as PortfolioContent;
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.projects) || !Array.isArray(parsed.experience) || !Array.isArray(parsed.metrics) || !Array.isArray(parsed.principles)) { alert('Invalid portfolio JSON: projects, experience, metrics and principles must be arrays.'); return; }
      if (parsed.projects.some(p => !p || typeof p.title !== 'string' || !p.title.trim() || typeof p.category !== 'string' || !p.category.trim() || !(Array.isArray(p.media) ? p.media.length : p.image))) { alert('Each project needs a title, category and at least one media item.'); return; }
      const mediaUrls = parsed.projects.flatMap(p => Array.isArray(p.media) ? p.media.map(m => m?.url) : [p.image]);
      if (mediaUrls.some(url => typeof url !== 'string' || !/^https?:\/\//i.test(url))) { alert('Project media must use valid http or https URLs.'); return; }
      if (parsed.experience.some(x => !x || typeof x.role !== 'string' || !x.role.trim() || typeof x.organization !== 'string' || !x.organization.trim() || typeof x.summary !== 'string')) { alert('Each experience entry needs a role, organization and description.'); return; }
      if (parsed.metrics.some(m => !m || typeof m.value !== 'string' || !m.value.trim() || typeof m.label !== 'string' || !m.label.trim())) { alert('Each metric needs a value and label.'); return; }
      if (parsed.principles.some(p => !p || typeof p.title !== 'string' || !p.title.trim() || typeof p.copy !== 'string' || !p.copy.trim())) { alert('Each How I Work card needs a title and description.'); return; }
      if (parsed.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email)) { alert('The public contact email is not valid.'); return; }
      onUpdateContent(parsed);
      notify('JSON applied.');
    } catch (err) {
      alert('JSON error: ' + (err as Error).message);
    }
  };

  const inputCls = 'w-full rounded-xl border border-black/15 bg-[#f6f5f1] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/30';

  // Login screen
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white mb-3">⚙</span>
            <h2 className="text-xl font-extrabold text-black">Admin Login</h2>
            <p className="mt-1 text-xs text-black/50">Portfolio Content Manager</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-black/60 block mb-1">Username</label>
              <input
                type="email" required autoFocus
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="Admin email from Supabase Auth"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-black/60 block mb-1">Password</label>
              <input
                type="password" required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            {loginError && <p className="text-xs font-bold text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white transition-colors hover:bg-[#bd5938]"
            >
              Sign in
            </button>
          </form>
          <button
            onClick={onClose}
            className="mt-4 w-full text-center text-xs text-black/40 hover:text-black transition-colors"
          >
            ← Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  // Authenticated admin UI
  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside className="flex h-full w-full max-w-3xl flex-col bg-[#f6f5f1] shadow-2xl" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">⚙</span>
            <div>
              <h2 className="text-base font-extrabold text-black">Portfolio Admin</h2>
              <p className="text-xs text-black/50">Full CRUD — Work, Experience, Hero Copy</p>
            </div>
          </div>
          <button type="button" onClick={() => { void supabase?.auth.signOut(); }} className="mr-2 rounded-full border border-black/15 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/5">Sign out</button>
          <button
            onClick={onClose}
            className="rounded-full border border-black/20 p-2 transition-colors hover:bg-black hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div className="bg-emerald-600 px-6 py-2 text-center text-xs font-bold text-white">{statusMsg}</div>
        )}

        {/* Tabs */}
        <div className="admin-tabs flex border-b border-black/10 bg-[#eae8e1] px-6 text-xs font-bold">
          {([
            { key: 'projects', icon: <Layers className="h-3.5 w-3.5" />, label: `Work (${content.projects.length})` },
            { key: 'experience', icon: <Briefcase className="h-3.5 w-3.5" />, label: `Exp (${content.experience.length})` },
            { key: 'profile', icon: <Sliders className="h-3.5 w-3.5" />, label: 'Hero & Profile' },
            { key: 'pages', icon: <FileText className="h-3.5 w-3.5" />, label: 'Page Content' },
            { key: 'json', icon: <FileText className="h-3.5 w-3.5" />, label: 'JSON' }
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 transition-colors ${
                activeTab === tab.key ? 'border-black bg-white text-black' : 'border-transparent text-black/60 hover:text-black'
              }`}
            >
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div ref={adminProjectsRef} className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">Selected Work</h3>
                  <p className="text-xs text-black/55">Add photos or videos. Keep as many as you like.</p>
                </div>
                {!isAddingProject && !editingProject && (
                  <button
                    onClick={() => { setEditingProject(null); setProjectForm({ title: '', category: '', mediaType: 'image', image: '', role: '', summary: '', outcome: '', link: '' }); setMediaDrafts([{ url: '', type: 'image' }]); setCategoryDraft(''); setIsAddingProject(true); }}
                    className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:-translate-y-0.5 transition-transform"
                  >
                    <Plus className="h-3.5 w-3.5" /><span>Add Project</span>
                  </button>
                )}
              </div>

              {(isAddingProject || editingProject) && (
                <form ref={editFormRef} onSubmit={handleSaveProject} style={editingProject ? { position: 'absolute', top: editFormTop, left: 0, right: 0, zIndex: 10 } : undefined} className="rounded-2xl border border-black/15 bg-white p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-black/10 pb-3">
                    <h4 className="text-sm font-bold">{editingProject ? 'Edit Project' : 'Add Project'}</h4>
                    <button type="button" onClick={() => { setIsAddingProject(false); setEditingProject(null); }} className="text-xs text-black/50 hover:text-black font-semibold">Cancel</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">Title *</label>
                      <input type="text" required value={projectForm.title || ''} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Asteria Runway Debut" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">Category</label>
                      <input list="project-categories" value={projectForm.category || categoryDraft} onChange={e => { setCategoryDraft(e.target.value); setProjectForm({ ...projectForm, category: e.target.value }); }} placeholder="Choose or type a category" className={inputCls} />
                      <datalist id="project-categories">{Array.from(new Set(content.projects.map(p => p.category))).map(category => <option key={category} value={category} />)}</datalist>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-xl border border-black/10 bg-[#f6f5f1] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2"><div><label className="text-[11px] font-bold text-black/70">Project media</label><p className="text-[10px] text-black/45">Choose any item as the project cover. Add a thumbnail URL or capture a video frame.</p></div><button type="button" onClick={() => setMediaDrafts([...mediaDrafts, { url: '', type: 'image' }])} className="rounded-full bg-black px-3 py-2 text-[10px] font-bold text-white">+ Add media</button></div>
                    {mediaDrafts.map((media, index) => <div key={index} draggable onDragStart={() => setDraggedMediaIndex(index)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (draggedMediaIndex !== null) moveDraftMedia(draggedMediaIndex, index); setDraggedMediaIndex(null); }} onDragEnd={() => setDraggedMediaIndex(null)} className={`rounded-xl border border-black/10 bg-white p-3 space-y-2 ${draggedMediaIndex === index ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                        <div className="flex items-center justify-between gap-2 sm:w-8 sm:flex-col">
                          <button type="button" aria-label={`Drag media ${index + 1} to reorder`} className="cursor-grab touch-none text-black/35 active:cursor-grabbing"><GripVertical className="h-5 w-5" /></button>
                          <div className="flex gap-1 sm:flex-col"><button type="button" onClick={() => moveDraftMedia(index, index - 1)} disabled={index === 0} aria-label={`Move media ${index + 1} up`} className="rounded border border-black/10 p-1 text-black/60 disabled:opacity-25"><ChevronUp className="h-3 w-3" /></button><button type="button" onClick={() => moveDraftMedia(index, index + 1)} disabled={index === mediaDrafts.length - 1} aria-label={`Move media ${index + 1} down`} className="rounded border border-black/10 p-1 text-black/60 disabled:opacity-25"><ChevronDown className="h-3 w-3" /></button></div>
                        </div>
                        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-black/10">
                          {media.thumbnailUrl || media.type === 'image' && media.url ? <img src={media.thumbnailUrl || media.url} alt="" className="h-full w-full object-cover" /> : media.type === 'video' && media.url ? <video ref={el => { captureRefs.current[index] = el; }} src={media.url} muted controls playsInline preload="metadata" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[10px] text-black/40">Preview</div>}
                        </div>
                        <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_72px_30px] gap-2 sm:grid-cols-[minmax(0,1fr)_90px_34px]">
                          <input type="url" required aria-label={`Media URL ${index + 1}`} value={media.url} onChange={e => setMediaDrafts(mediaDrafts.map((m, i) => i === index ? { ...m, url: e.target.value } : m))} placeholder="Paste image or video URL" className={inputCls} />
                          <select aria-label="Media type" value={media.type} onChange={e => setMediaDrafts(mediaDrafts.map((m, i) => i === index ? { ...m, type: e.target.value as 'image' | 'video' } : m))} className={inputCls}><option value="image">Photo</option><option value="video">Video</option></select>
                          <button type="button" aria-label="Remove media" disabled={mediaDrafts.length === 1} onClick={() => { setMediaDrafts(mediaDrafts.filter((_, i) => i !== index)); setCoverIndex(current => Math.max(0, current > index ? current - 1 : current)); }} className="rounded-lg border border-black/10 text-black/50 disabled:opacity-30">×</button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold"><input type="radio" name="project-cover" checked={coverIndex === index} onChange={() => setCoverIndex(index)} /> Use as project cover</label>
                        <input type="url" aria-label={`Thumbnail URL ${index + 1}`} value={media.thumbnailUrl?.startsWith('data:') ? '' : media.thumbnailUrl || ''} onChange={e => setMediaDrafts(mediaDrafts.map((m, i) => i === index ? { ...m, thumbnailUrl: e.target.value } : m))} placeholder="Optional thumbnail image URL" className={`${inputCls} min-w-[180px] flex-1`} />
                        <label className="cursor-pointer rounded-lg border border-black/15 px-3 py-2 text-[10px] font-bold">Upload thumbnail<input type="file" accept="image/*" className="sr-only" onChange={e => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setMediaDrafts(current => current.map((m, i) => i === index ? { ...m, thumbnailUrl: String(reader.result) } : m)); reader.readAsDataURL(file); e.target.value = ''; }} /></label>
                        {media.type === 'video' && <button type="button" onClick={() => { const video = captureRefs.current[index]; if (!video || !video.videoWidth) { notify('Wait for the video preview to load, then try again.'); return; } const scale = Math.min(1, 640 / video.videoWidth); const canvas = document.createElement('canvas'); canvas.width = Math.round(video.videoWidth * scale); canvas.height = Math.round(video.videoHeight * scale); canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height); try { const thumbnailUrl = canvas.toDataURL('image/jpeg', .72); setMediaDrafts(mediaDrafts.map((m, i) => i === index ? { ...m, thumbnailUrl } : m)); notify('Video frame captured.'); } catch { notify('This video does not allow frame capture. Use a thumbnail URL.'); } }} className="rounded-lg border border-black/15 px-3 py-2 text-[10px] font-bold">Capture current frame</button>}
                      </div>
                    </div>)}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-black/70 block mb-1">Role / Scope</label>
                    <input type="text" value={projectForm.role || ''} onChange={e => setProjectForm({ ...projectForm, role: e.target.value })} placeholder="e.g. Marketing Strategy · Runway Staging" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-black/70 block mb-1">Summary</label>
                    <textarea rows={2} value={projectForm.summary || ''} onChange={e => setProjectForm({ ...projectForm, summary: e.target.value })} placeholder="Concise overview..." className={inputCls} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">Key Outcome</label>
                      <input type="text" value={projectForm.outcome || ''} onChange={e => setProjectForm({ ...projectForm, outcome: e.target.value })} placeholder="e.g. 700+ leads generated" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">External Link (Optional)</label>
                      <input type="url" value={projectForm.link || ''} onChange={e => setProjectForm({ ...projectForm, link: e.target.value })} placeholder="https://..." className={inputCls} />
                    </div>
                  </div>
                  <button type="submit" className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:opacity-90">
                    <Save className="h-3.5 w-3.5" /><span>Save Project</span>
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {content.projects.map((proj, idx) => (
                  <div key={proj.id || idx} data-project-index={idx} draggable onDragStart={() => setDraggedProjectId(proj.id)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const fromIndex = content.projects.findIndex(project => project.id === draggedProjectId); if (fromIndex >= 0) moveProject(fromIndex, idx); setDraggedProjectId(null); }} onDragEnd={() => setDraggedProjectId(null)} className={`flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-3.5 ${draggedProjectId === proj.id ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <button type="button" aria-label={`Drag to reorder ${proj.title}`} className="cursor-grab touch-none text-black/35 active:cursor-grabbing"><GripVertical className="h-5 w-5" /></button>
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-black/10 shrink-0">
                        {proj.mediaType === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black text-white"><Film className="h-4 w-4" /></div>}
                        <img src={proj.image} alt="" className="relative h-full w-full object-cover" onError={e => { (e.target as HTMLElement).style.display = 'none'; }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-bold text-black/60 uppercase">{proj.category}</span>
                          {proj.mediaType === 'video' && <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">Video</span>}
                        </div>
                        <h4 className="text-xs font-bold text-black mt-0.5">{proj.title}</h4>
                        <p className="text-[11px] text-black/50 line-clamp-1">{proj.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex flex-col gap-1"><button type="button" onClick={() => moveProject(idx, idx - 1)} disabled={idx === 0} aria-label={`Move ${proj.title} up`} className="rounded border border-black/10 p-1 text-black/60 disabled:opacity-25"><ChevronUp className="h-3 w-3" /></button><button type="button" onClick={() => moveProject(idx, idx + 1)} disabled={idx === content.projects.length - 1} aria-label={`Move ${proj.title} down`} className="rounded border border-black/10 p-1 text-black/60 disabled:opacity-25"><ChevronDown className="h-3 w-3" /></button></div>
                      <button onClick={e => { const row = e.currentTarget.closest('[data-project-index]'); const parent = adminProjectsRef.current; if (row && parent) setEditFormTop(row.getBoundingClientRect().bottom - parent.getBoundingClientRect().top + 12); setEditingProject(proj); setProjectForm({ ...proj }); setMediaDrafts(proj.media?.length ? proj.media : [{ url: proj.image, type: proj.mediaType || 'image' }]); setCoverIndex(Math.max(0, (proj.media || []).findIndex(m => (m.thumbnailUrl || m.url) === proj.image))); setCategoryDraft(proj.category); setIsAddingProject(false); window.requestAnimationFrame(() => editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })); }} className="rounded-lg border border-black/10 p-2 hover:bg-[#f6f5f1]" title="Edit"><Edit2 className="h-3.5 w-3.5 text-black/70" /></button>
                      <button onClick={() => handleDeleteProject(proj.id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">Career Experience</h3>
                  <p className="text-xs text-black/55">Use "Mon YYYY – Mon YYYY" format for auto duration calculation.</p>
                </div>
                {!isAddingExp && !editingExp && (
                  <button
                    onClick={() => { setEditingExp(null); setExpForm({ role: '', organization: '', period: '', impactBadge: '', summary: '' }); setIsAddingExp(true); }}
                    className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:-translate-y-0.5 transition-transform"
                  >
                    <Plus className="h-3.5 w-3.5" /><span>Add Role</span>
                  </button>
                )}
              </div>

              {isAddingExp && (
                <form onSubmit={handleSaveExperience} className="rounded-2xl border border-black/15 bg-white p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/10 pb-3">
                    <h4 className="text-sm font-bold">Add Role</h4>
                    <button type="button" onClick={() => { setIsAddingExp(false); setEditingExp(null); }} className="text-xs text-black/50 hover:text-black font-semibold">Cancel</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">Role Title *</label>
                      <input type="text" required value={expForm.role || ''} onChange={e => setExpForm({ ...expForm, role: e.target.value })} placeholder="e.g. Head of Marketing" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">Organization *</label>
                      <input type="text" required value={expForm.organization || ''} onChange={e => setExpForm({ ...expForm, organization: e.target.value })} placeholder="e.g. Asteria · Kathmandu, Nepal" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">Period</label>
                      <input type="text" value={expForm.period || ''} onChange={e => setExpForm({ ...expForm, period: e.target.value })} placeholder="e.g. Sep 2024 – Jan 2026" className={inputCls} />
                      <p className="text-[10px] text-black/40 mt-1">Format: Mon YYYY – Mon YYYY or "Present"</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-black/70 block mb-1">Impact Badge</label>
                      <input type="text" value={expForm.impactBadge || ''} onChange={e => setExpForm({ ...expForm, impactBadge: e.target.value })} placeholder="e.g. NPR 21.7M+ Revenue" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-black/70 block mb-1">One-line Story *</label>
                    <textarea rows={3} required value={expForm.summary || ''} onChange={e => setExpForm({ ...expForm, summary: e.target.value })} placeholder="Remarkable, concise description of your impact..." className={inputCls} />
                  </div>
                  <button type="submit" className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:opacity-90">
                    <Save className="h-3.5 w-3.5" /><span>Save Role</span>
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {content.experience.map((exp, idx) => (
                  <div key={exp.id || idx} draggable onDragStart={() => setDraggedExpIndex(idx)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (draggedExpIndex !== null) moveExperience(draggedExpIndex, idx); setDraggedExpIndex(null); }} onDragEnd={() => setDraggedExpIndex(null)} className={`rounded-xl border border-black/10 bg-white ${draggedExpIndex === idx ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4 p-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#bd5938]">{exp.period}</span>
                        {exp.period && <span className="rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-bold text-black/50">{computeDuration(exp.period)}</span>}
                        {exp.impactBadge && <span className="rounded bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/70">{exp.impactBadge}</span>}
                      </div>
                      <h4 className="text-sm font-extrabold text-black mt-1">{exp.role}</h4>
                      <p className="text-xs text-black/50">{exp.organization}</p>
                      <p className="text-xs text-black/70 mt-2 leading-relaxed">{exp.summary}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" aria-label={`Drag to reorder ${exp.role}`} className="cursor-grab touch-none rounded-lg border border-black/10 p-2 text-black/40 active:cursor-grabbing"><GripVertical className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => moveExperience(idx, idx - 1)} disabled={idx === 0} aria-label={`Move ${exp.role} up`} className="rounded border border-black/10 p-2 text-black/60 disabled:opacity-25"><ChevronUp className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => moveExperience(idx, idx + 1)} disabled={idx === content.experience.length - 1} aria-label={`Move ${exp.role} down`} className="rounded border border-black/10 p-2 text-black/60 disabled:opacity-25"><ChevronDown className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => { setEditingExp(exp); setExpForm({ ...exp }); setIsAddingExp(false); }} className="rounded-lg border border-black/10 p-2 hover:bg-[#f6f5f1]" title="Edit"><Edit2 className="h-3.5 w-3.5 text-black/70" /></button>
                      <button onClick={() => handleDeleteExperience(idx)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  {editingExp && (editingExp.id || editingExp.role) === (exp.id || exp.role) && (
                    <form onSubmit={handleSaveExperience} className="mx-4 mb-4 rounded-2xl border border-black/15 bg-[#f6f5f1] p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-black/10 pb-3"><h4 className="text-sm font-bold">Edit Role</h4><button type="button" onClick={() => setEditingExp(null)} className="text-xs text-black/50 hover:text-black font-semibold">Cancel</button></div>
                      <div className="grid gap-3 sm:grid-cols-2"><div><label className="text-[11px] font-bold text-black/70 block mb-1">Role Title *</label><input type="text" required value={expForm.role || ''} onChange={e => setExpForm({ ...expForm, role: e.target.value })} className={inputCls} /></div><div><label className="text-[11px] font-bold text-black/70 block mb-1">Organization *</label><input type="text" required value={expForm.organization || ''} onChange={e => setExpForm({ ...expForm, organization: e.target.value })} className={inputCls} /></div></div>
                      <div className="grid gap-3 sm:grid-cols-2"><div><label className="text-[11px] font-bold text-black/70 block mb-1">Period</label><input type="text" value={expForm.period || ''} onChange={e => setExpForm({ ...expForm, period: e.target.value })} className={inputCls} /></div><div><label className="text-[11px] font-bold text-black/70 block mb-1">Impact Badge</label><input type="text" value={expForm.impactBadge || ''} onChange={e => setExpForm({ ...expForm, impactBadge: e.target.value })} className={inputCls} /></div></div>
                      <div><label className="text-[11px] font-bold text-black/70 block mb-1">One-line Story *</label><textarea rows={3} required value={expForm.summary || ''} onChange={e => setExpForm({ ...expForm, summary: e.target.value })} className={inputCls} /></div>
                      <button type="submit" className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black py-2.5 text-xs font-bold text-white"><Save className="h-3.5 w-3.5" /><span>Save Role</span></button>
                    </form>
                  )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8"><form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-black">Hero & Profile Copy</h3>
                <p className="text-xs text-black/55">Keep it inviting, warm, and commercial.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="text-[11px] font-bold text-black/70 block mb-1">Your Name</label><input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className={inputCls} /></div>
                <div><label className="text-[11px] font-bold text-black/70 block mb-1">Role Tagline</label><input type="text" value={profileForm.roleLine} onChange={e => setProfileForm({ ...profileForm, roleLine: e.target.value })} className={inputCls} /></div>
              </div>
              <div><label className="text-[11px] font-bold text-black/70 block mb-1">Hero Intro</label><textarea rows={4} value={profileForm.intro} onChange={e => setProfileForm({ ...profileForm, intro: e.target.value })} className={inputCls} /></div>
              <div><label className="text-[11px] font-bold text-black/70 block mb-1">Public contact email</label><input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="Leave blank to hide email contact" className={inputCls} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="text-[11px] font-bold text-black/70 block mb-1">CV / Resume URL</label><input type="url" value={profileForm.cvUrl} onChange={e => setProfileForm({ ...profileForm, cvUrl: e.target.value })} placeholder="https://..." className={inputCls} /></div>
                <div><label className="text-[11px] font-bold text-black/70 block mb-1">LinkedIn URL</label><input type="url" value={profileForm.linkedinUrl} onChange={e => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })} className={inputCls} /></div>
              </div>
              <button type="submit" className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-6 py-3 text-xs font-bold text-white hover:opacity-90">
                <Save className="h-3.5 w-3.5" /><span>Save Profile</span>
              </button>
            </form>
            </div>
          )}

          {/* PAGE CONTENT */}
          {activeTab === 'pages' && (
            <form onSubmit={handleSavePages} className="space-y-7">
              <div><h3 className="text-lg font-bold text-black">Customize every section</h3><p className="text-xs text-black/55">Edit section headings, the contact card, impact stats and approach cards.</p></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['projectsHeading','projectsEyebrow','impactHeading','impactEyebrow','experienceHeading','experienceEyebrow','approachHeading','approachEyebrow'] as const).map(key => <label key={key} className="text-[11px] font-bold text-black/70">{key.replace(/([A-Z])/g,' $1')}<input value={pageForm[key]} onChange={e => setPageForm({ ...pageForm, [key]: e.target.value })} className={`${inputCls} mt-1`} /></label>)}
              </div>
              <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
                <h4 className="text-sm font-bold">Contact page</h4>
                <label className="block text-[11px] font-bold">Headline<input value={pageForm.contactHeading} onChange={e => setPageForm({ ...pageForm, contactHeading: e.target.value })} className={`${inputCls} mt-1`} /></label>
                <label className="block text-[11px] font-bold">Colored phrase<input value={pageForm.contactAccent} onChange={e => setPageForm({ ...pageForm, contactAccent: e.target.value })} className={`${inputCls} mt-1`} /></label>
                <label className="block text-[11px] font-bold">Intro<textarea rows={3} value={pageForm.contactDescription} onChange={e => setPageForm({ ...pageForm, contactDescription: e.target.value })} className={`${inputCls} mt-1`} /></label>
                <label className="block text-[11px] font-bold">Contact choices <span className="font-normal text-black/45">(one per line)</span><textarea rows={4} value={pageForm.contactOptions} onChange={e => setPageForm({ ...pageForm, contactOptions: e.target.value })} className={`${inputCls} mt-1`} /></label>
              </div>
              <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
                <h4 className="text-sm font-bold">Impact metrics</h4>
                {pageForm.metrics.map((metric, i) => <div key={metric.id || i} className="grid gap-2 sm:grid-cols-2"><input aria-label="Metric value" value={metric.value} onChange={e => setPageForm({ ...pageForm, metrics: pageForm.metrics.map((m, j) => j === i ? { ...m, value: e.target.value } : m) })} className={inputCls} /><input aria-label="Metric label" value={metric.label} onChange={e => setPageForm({ ...pageForm, metrics: pageForm.metrics.map((m, j) => j === i ? { ...m, label: e.target.value } : m) })} className={inputCls} /></div>)}
                <button type="button" onClick={() => setPageForm({ ...pageForm, metrics: [...pageForm.metrics, { id: `m-${Date.now()}`, value: '', label: '' }] })} className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-bold">+ Add metric</button>
              </div>
              <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
                <h4 className="text-sm font-bold">How I work</h4>
                {pageForm.principles.map((principle, i) => <div key={principle.id || i} className="space-y-2 rounded-xl bg-[#f6f5f1] p-3"><input aria-label="Principle title" value={principle.title} onChange={e => setPageForm({ ...pageForm, principles: pageForm.principles.map((p, j) => j === i ? { ...p, title: e.target.value } : p) })} className={inputCls} /><textarea aria-label="Principle description" rows={2} value={principle.copy} onChange={e => setPageForm({ ...pageForm, principles: pageForm.principles.map((p, j) => j === i ? { ...p, copy: e.target.value } : p) })} className={inputCls} /></div>)}
                <button type="button" onClick={() => setPageForm({ ...pageForm, principles: [...pageForm.principles, { id: `p-${Date.now()}`, number: String(pageForm.principles.length + 1).padStart(2,'0'), title: '', copy: '' }] })} className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-bold">+ Add principle</button>
              </div>
              <button type="submit" className="flex items-center gap-1.5 rounded-xl bg-black px-6 py-3 text-xs font-bold text-white"><Save className="h-3.5 w-3.5" /> Save page content</button>
            </form>
          )}

          {/* JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">Direct JSON Editor</h3>
                  <p className="text-xs text-black/55">Edit, backup, or restore portfolio data.</p>
                </div>
                <button type="button" onClick={() => { onReset(); notify('Defaults restored.'); }} className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-bold hover:bg-black/5 flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" /><span>Reset Defaults</span>
                </button>
              </div>
              <textarea spellCheck={false} value={jsonText} onChange={e => setJsonText(e.target.value)} className="h-96 w-full rounded-2xl border border-black/15 bg-white p-4 font-mono text-xs leading-5 focus:outline-none focus:ring-1 focus:ring-black/20" />
              <button type="button" onClick={handleSaveJson} className="flex items-center gap-1.5 rounded-xl bg-black px-6 py-3 text-xs font-bold text-white hover:opacity-90">
                <Save className="h-3.5 w-3.5" /><span>Apply JSON</span>
              </button>
            </div>
          )}

        </div>
      </aside>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [content, setContent] = useState<PortfolioContent>(loadContent);
  const [adminOpen, setAdminOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeNav, setActiveNav] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [contactIntent, setContactIntent] = useState(content.contactOptions?.[0] || 'Discuss a role');
  const [emailCopied, setEmailCopied] = useState(false);
  const [heroCopied, setHeroCopied] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<Project | null>(null);
  const [impactVisible, setImpactVisible] = useState(false);
  const impactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('portfolio_content').select('content').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (error) { console.error('Could not load portfolio content from Supabase:', error.message); return; }
      if (data?.content) {
        const remote = { ...DEFAULT_CONTENT, ...(data.content as Partial<PortfolioContent>) };
        setContent(remote);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(remote)); } catch { /* Remote content remains available. */ }
      }
    });
  }, []);
  const nav = [
    { id: 'work', label: 'Work' },
    { id: 'impact', label: 'Impact' },
    { id: 'experience', label: 'Experience' },
    { id: 'approach', label: 'Approach' }
  ];

  const filters = useMemo(() => ['All', ...Array.from(new Set(content.projects.map(p => p.category)))], [content.projects]);

  const emailHref = content.email.trim()
    ? `mailto:${content.email.trim()}?subject=${encodeURIComponent(contactIntent)}&body=${encodeURIComponent(
        `Hi Resham,\n\nI'm reaching out regarding ${contactIntent.toLowerCase()}.\n\n`
      )}`
    : 'mailto:';

  const copyEmail = async () => {
    if (!content.email.trim()) return;
    try {
      await navigator.clipboard.writeText(content.email.trim());
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${content.email.trim()}`;
    }
  };

  const copyHeroEmail = async () => {
    if (!content.email.trim()) return;
    try {
      await navigator.clipboard.writeText(content.email.trim());
      setHeroCopied(true);
      window.setTimeout(() => setHeroCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${content.email.trim()}`;
    }
  };

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveNav(visible.target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.2, 0.5] });
    nav.forEach(item => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setAdminOpen(false); setMenuOpen(false); if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') window.history.replaceState({}, '', '/'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Admin via /admin route only
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      setAdminOpen(true);
    }
  }, []);

  // IntersectionObserver for Impact count-up
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setImpactVisible(true); },
      { threshold: 0.2 }
    );
    if (impactRef.current) obs.observe(impactRef.current);
    return () => obs.disconnect();
  }, []);

  const handleUpdateContent = async (updated: PortfolioContent) => {
    try {
      if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      const { error } = await supabase.from('portfolio_content').upsert({ id: 1, content: updated });
      if (error) throw error;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setContent(updated);
    } catch (error) {
      window.alert(`Your changes could not be saved to Supabase: ${(error as Error).message}`);
    }
  };

  const resetContent = () => {
    void handleUpdateContent(DEFAULT_CONTENT);
  };

  const closeAdmin = () => {
    setAdminOpen(false);
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      window.history.replaceState({}, '', '/');
    }
  };

  const filteredProjects = content.projects.filter(p => activeFilter === 'All' || p.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171715]">
      {/* Navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 transition-all duration-300 md:px-10 ${
          scrollY > 20 ? 'border-b border-black/10 bg-[#f6f5f1]/90 backdrop-blur-md shadow-sm' : 'bg-[#f6f5f1]'
        }`}
      >
        <a href="#home" className="brand-link focus-ring text-sm font-extrabold tracking-tight md:text-base">
          Resh<span className="text-[#bd5938]">.</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {nav.map(item => (
            <a key={item.id} aria-current={activeNav === item.id ? 'location' : undefined} className={`nav-link focus-ring text-xs font-semibold transition-colors ${activeNav === item.id ? 'nav-link-active' : ''}`} href={`#${item.id}`} onClick={() => setActiveNav(item.id)}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta focus-ring group inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#bd5938]" href="#contact" onClick={() => setActiveNav('contact')}>
            Let's talk <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </nav>

        <button
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-black/20 md:hidden"
          onClick={() => setMenuOpen(v => !v)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="fixed inset-x-0 top-[60px] z-40 flex flex-col gap-5 border-b border-black/10 bg-[#f6f5f1] px-6 py-8 shadow-xl md:hidden">
          {nav.map(item => (
            <a key={item.id} aria-current={activeNav === item.id ? 'location' : undefined} onClick={() => { setMenuOpen(false); setActiveNav(item.id); }} href={`#${item.id}`} className={`mobile-nav-link text-2xl font-bold tracking-tight ${activeNav === item.id ? 'mobile-nav-link-active' : ''}`}>
              {item.label}
            </a>
          ))}
          <a href="#contact" onClick={() => { setMenuOpen(false); setActiveNav('contact'); }} className="flex items-center justify-between rounded-xl bg-black px-5 py-3 text-base font-bold text-white">
            <span>Let's talk</span><ArrowUpRight className="h-5 w-5" />
          </a>
        </nav>
      )}

      <main>
        {/* ================================================================ */}
        {/* 1. HERO                                                          */}
        {/* ================================================================ */}
        <section id="home" className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden px-5 pb-12 pt-28 md:px-10 md:pb-14 md:pt-24">
          <div className="hero-glow-1 pointer-events-none absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#bd5938]/12 via-[#e48967]/8 to-transparent blur-3xl" />
          <div className="hero-glow-2 pointer-events-none absolute -bottom-32 -left-24 h-[440px] w-[440px] rounded-full bg-gradient-to-tr from-[#f0df75]/10 via-[#c9b9ed]/8 to-transparent blur-3xl" />
          <div className="hero-grain" />
          <div className="relative mx-auto w-full max-w-[1140px]">
            <h1 className="reveal max-w-4xl text-[clamp(2.7rem,6vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-[#171715]">Thoughtful marketing. Measurable growth.<span className="mt-2 block font-serif font-normal italic text-[#bd5938]">Built with people in mind.</span></h1>
            <div className="reveal reveal-d1 mt-5 max-w-2xl">
              <p className="text-lg leading-relaxed text-black/65 md:text-xl">Hi, I'm <strong className="font-bold text-black">{content.name}</strong> ? {content.roleLine}.</p>
              <p className="mt-3 text-sm leading-relaxed text-black/50 md:text-base">{content.intro}</p>
            </div>
            <div className="reveal reveal-d2 mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="focus-ring group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#bd5938]"><span>Explore the work</span><ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" /></a>
              <a href="#contact" className="focus-ring group inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/80 px-6 py-3.5 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:border-black hover:bg-white"><span>Say hello</span><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              <button type="button" onClick={copyHeroEmail} className="focus-ring inline-flex items-center gap-2 px-2 py-3 text-xs font-semibold text-black/55 transition-colors hover:text-black">{heroCopied ? <span className="flex items-center gap-1.5 font-bold text-emerald-700"><Check className="h-3.5 w-3.5" />Copied!</span> : <span className="flex items-center gap-1.5 underline underline-offset-4 decoration-black/25"><Copy className="h-3.5 w-3.5" />Copy email</span>}</button>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 2. SELECTED WORK                                                 */}
        {/* ================================================================ */}
        <section id="work" className="scroll-mt-20 border-t border-black/10 bg-[#e9e7e1] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1340px]">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow mb-4 font-bold text-black/45">{content.projectsEyebrow}</p>
                <h2 className="max-w-4xl text-4xl font-extrabold leading-[.95] tracking-[-0.05em] text-[#171715] md:text-6xl">
                  {content.projectsHeading}
                </h2>
                <p className="mt-3 max-w-xl text-sm text-black/55">
                  Brand activations, commercial campaigns, and experiential showcases. Click any to explore.
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {filters.map(filter => {
                  const count = filter === 'All' ? content.projects.length : content.projects.filter(p => p.category === filter).length;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`focus-ring rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 ${
                        activeFilter === filter ? 'border-black bg-black text-white' : 'border-black/20 bg-white/60 text-black hover:bg-white'
                      }`}
                    >
                      {filter} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Projects grid */}
            <div className="mt-10 grid gap-5 md:mt-14 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, i) => (
                <article
                  key={project.id || i}
                  className={`work-card group relative cursor-pointer overflow-hidden rounded-2xl bg-[#f6f5f1] shadow-sm ${i === 0 ? 'sm:col-span-2' : ''}`}
                  onClick={() => setLightboxItem(project)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${project.title}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightboxItem(project); } }}
                >
                  {/* Media */}
                  <div className={`media-wrap relative bg-[#d8d5cd] ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                    {project.mediaType === 'video' ? (
                      <div className="relative h-full w-full">
                        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/20">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform group-hover:scale-110">
                            <Play className="h-5 w-5 fill-current ml-0.5" />
                          </span>
                        </div>
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                          <Film className="h-3 w-3" /> Video
                        </span>
                      </div>
                    ) : (
                      <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover" />
                    )}

                    <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{project.category}</span>
                    {(project.media?.length || 1) > 1 && <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 font-mono text-[10px] text-white">{project.media?.length} items</span>}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end">
                      <div className="w-full translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 p-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black shadow-md">
                          View project ↗
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="p-5">
                    <p className="eyebrow text-[#bd5938] font-bold">{project.category}</p>
                    <h3 className="mt-1.5 text-base font-bold tracking-tight text-black md:text-lg leading-snug">{project.title}</h3>
                    {project.outcome && (
                      <p className="mt-2 text-xs text-black/55 line-clamp-2">{project.outcome}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-8 text-xs text-black/40 text-center">
              Showing {filteredProjects.length} of {content.projects.length} projects
            </p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 3. IMPACT                                                        */}
        {/* ================================================================ */}
        <section
          id="impact"
          ref={impactRef}
          className="scroll-mt-20 bg-[#171715] px-5 py-20 text-[#f6f5f1] md:px-10 md:py-28"
        >
          <div className="mx-auto max-w-[1240px]">
            <p className="eyebrow mb-4 font-bold text-white/50">{content.impactEyebrow}</p>
            <h2 className="mb-10 max-w-4xl text-4xl font-extrabold leading-[.95] tracking-[-0.05em] md:mb-14 md:text-6xl">
              {content.impactHeading}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:gap-4">
              {content.metrics.map((metric, i) => (
                <MetricCard
                  key={metric.id || `${metric.label}-${i}`}
                  metric={metric}
                  active={impactVisible}
                  isFirst={i === 0}
                  className={`${
                    i === 0
                      ? 'flex min-h-[240px] flex-col justify-between bg-[#f6f5f1] text-[#171715] md:row-span-2 md:min-h-[380px]'
                      : i % 2 ? 'bg-[#242423]' : 'bg-[#2d2d2b]'
                  } rounded-2xl p-6 md:p-8`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4. EXPERIENCE */}
        {/* ================================================================ */}
        <section id="experience" className="scroll-mt-20 border-t border-black/10 bg-[#f0eee9] px-5 py-20 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="experience-intro lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow mb-4 font-bold text-[#bd5938]">{content.experienceEyebrow.replace(/^\s*\d+\s*\/\s*/, '')}</p>
              <h2 className="max-w-lg text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-[#171715] md:text-5xl">{content.experienceHeading}</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-black/60">From campaign work to partnerships and business development, the best results have come from understanding people and staying focused on the goal.</p>
              <div className="experience-practice mt-8 max-w-sm">
                <p className="eyebrow mb-4 text-black/40">What I bring to a team</p>
                <div className="experience-practice-item"><span aria-hidden="true" /><strong>Understand the goal</strong></div>
                <div className="experience-practice-item"><span aria-hidden="true" /><strong>Work well with people</strong></div>
                <div className="experience-practice-item"><span aria-hidden="true" /><strong>Deliver the next step</strong></div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-xs font-bold">
                {content.cvUrl.trim() && <a href={content.cvUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#bd5938]">Download CV</a>}
                {content.linkedinUrl && <a href={content.linkedinUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#bd5938]">LinkedIn</a>}
              </div>
            </div>
            <div className="experience-list space-y-3 lg:max-h-[calc(100svh-10rem)] lg:overflow-y-auto lg:pr-2" aria-label="Career experience">
              {content.experience.map((item, i) => <ExperienceRow key={item.id || `${item.organization}-${i}`} item={item} index={i} />)}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 5. APPROACH — Principle cards only                               */}
        {/* ================================================================ */}
        <section id="approach" className="scroll-mt-20 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1240px]">
            <p className="eyebrow mb-4 font-bold text-black/45">{content.approachEyebrow}</p>
            <h2 className="mb-10 max-w-4xl text-4xl font-extrabold leading-[.95] tracking-[-0.05em] md:mb-14 md:text-6xl">
              {content.approachHeading}
            </h2>
            <div className="approach-grid grid gap-4 md:grid-cols-3">
              {content.principles.map((principle, index) => (
                <article
                  key={principle.number}
                  className="principle-card group relative overflow-hidden rounded-2xl border border-black/10 bg-white/60 p-7 md:p-9"
                >
                  <div className="mb-7 flex items-center gap-3"><span className="approach-number">{principle.number}</span><span className="approach-rule" /></div>
                  <h3 className="text-xl font-bold tracking-tight text-black">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/60">{principle.copy}</p>
                  <span className="approach-index" aria-hidden="true">0{index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 6. CONTACT                                                       */}
        {/* ================================================================ */}
        <section id="contact" className="contact-section scroll-mt-20 relative px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr] md:items-end md:gap-14">
              {/* Left — headline */}
              <div>
                <p className="eyebrow mb-5 text-white/55">Contact</p>
                <h2 className="contact-headline max-w-4xl text-5xl font-extrabold leading-[.9] tracking-[-.07em] md:text-7xl">
                  {content.contactHeading || 'Got a good feeling'}<br /><span>{content.contactAccent || 'about this?'}</span>
                </h2>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
                  {content.contactDescription || 'I am open to marketing, partnerships and growth roles where clear thinking and good execution make a difference.'}
                </p>

                {/* LinkedIn CTA — prominent */}
                {content.linkedinUrl.trim() && (
                  <a
                    href={content.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Connect on LinkedIn ↗
                  </a>
                )}

              </div>

              {/* Right — contact card */}
              <div className="contact-card">
                <p className="eyebrow text-black/45">Let's start somewhere</p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight">What brings you here?</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/55">Choose a topic to add it to your email subject.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {(content.contactOptions || ['Discuss a role', 'Explore a project', 'Talk partnerships', 'Something else']).map(intent => (
                    <button key={intent} type="button" onClick={() => setContactIntent(intent)} className={`contact-option ${contactIntent === intent ? 'contact-option-active' : ''}`} aria-pressed={contactIntent === intent}>
                      <span>{intent}</span><span className="contact-option-icon">{contactIntent === intent ? <Check className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}</span>
                    </button>
                  ))}
                </div>
                {content.email.trim() ? <a href={emailHref} className="focus-ring mt-5 flex w-full items-center justify-between rounded-full bg-[#171715] px-5 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#bd5938]"><span>Write an email</span><ArrowUpRight className="h-4 w-4" /></a> : content.linkedinUrl.trim() ? <a href={content.linkedinUrl} target="_blank" rel="noreferrer" className="focus-ring mt-5 flex w-full items-center justify-between rounded-full bg-[#171715] px-5 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#bd5938]"><span>Continue on LinkedIn</span><ArrowUpRight className="h-4 w-4" /></a> : null}
                {content.email.trim() && <button
                  type="button"
                  onClick={copyEmail}
                  className="focus-ring mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-black/10 px-4 py-3 text-left text-xs font-semibold text-black/60 transition-colors hover:bg-white"
                >
                  <span>{content.email}</span>
                  <span className="shrink-0 font-bold text-[#bd5938]">{emailCopied ? 'Copied ✓' : 'Copy email'}</span>
                </button>}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 flex flex-col justify-between gap-5 border-t border-white/15 pt-5 text-xs text-white/45 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-white">{content.name}<span className="text-[#e48967]">.</span></p>
                <p className="mt-1">Marketing · Partnerships · Growth</p>
              </div>
              <div className="flex flex-wrap gap-5">
                {content.email.trim() && <a className="focus-ring hover:text-white transition-colors" href={emailHref}>Email ↗</a>}
                {content.linkedinUrl.trim() && (
                  <a className="focus-ring hover:text-white transition-colors" href={content.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a>
                )}
                <span>© {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxItem && <Lightbox key={lightboxItem.id} item={lightboxItem} onClose={() => setLightboxItem(null)} />}

      {/* Admin portal — only triggered via /admin route */}
      {adminOpen && (
        <AdminPortal
          content={content}
          onUpdateContent={handleUpdateContent}
          onReset={resetContent}
          onClose={closeAdmin}
        />
      )}
    </div>
  );
}
