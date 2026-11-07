import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
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

export type EditorialBoard = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  images: { id: string; url: string; alt: string; caption?: string }[];
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
  editorialBoards: EditorialBoard[];
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
  editorialBoards: [
    {
      id: 'board-before',
      eyebrow: 'A visual point of view',
      title: 'Ideas take shape.',
      description: '',
      images: [
        { id: 'board-before-1', url: 'https://res.cloudinary.com/dvhs1dbxh/image/upload/v1792324376/All_g0udqd.jpg', alt: 'Creative campaign collage and visual direction', caption: 'Visual direction' },
        { id: 'board-before-2', url: 'https://res.cloudinary.com/dvhs1dbxh/image/upload/v1792324376/_15A5802_tfxp7t.jpg', alt: 'Behind-the-scenes creative work', caption: 'In the moment' }
      ]
    },
    {
      id: 'board-after',
      eyebrow: 'Outside the case study',
      title: 'The details matter.',
      description: '',
      images: [
        { id: 'board-after-1', url: 'https://res.cloudinary.com/dvhs1dbxh/image/upload/v1792324376/_15A5810_s0qev9.jpg', alt: 'Creative production and campaign detail', caption: 'The details' },
        { id: 'board-after-2', url: 'https://res.cloudinary.com/dvhs1dbxh/image/upload/v1792324376/Birdal1_ss9kr2.jpg', alt: 'Editorial campaign moment', caption: 'The finish' }
      ]
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
  const mediaItems: NonNullable<Project['media']> = item.media?.length ? item.media : [{ url: item.image, type: (item.mediaType || 'image') as 'image' | 'video' }];
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const activeMedia = mediaItems[activeMediaIndex] || mediaItems[0];

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { if (viewerOpen) setViewerOpen(false); else onClose(); }
      if (event.key === 'ArrowRight') setActiveMediaIndex(index => (index + 1) % mediaItems.length);
      if (event.key === 'ArrowLeft') setActiveMediaIndex(index => (index - 1 + mediaItems.length) % mediaItems.length);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, mediaItems.length, viewerOpen]);

  return (
    <div className="editorial-backdrop fixed inset-0 z-[200] overflow-y-auto bg-[#e9e6df]" onClick={event => { if (event.target === event.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label={item.title}>
      <button type="button" onClick={onClose} className="editorial-close" aria-label="Close project"><X className="h-5 w-5"/></button>
      <article className="editorial-sheet">
        <header className="editorial-masthead"><span>RESHAM GURUNG / SELECTED WORK</span><span>PROJECT FILE — {item.category.toUpperCase()}</span><span>SCROLL TO EXPLORE ↓</span></header>
        <section className="editorial-opening">
          <div className="editorial-opening-copy">
            <p className="eyebrow">{item.category} / PROJECT FEATURE</p>
            <h1>{item.title}</h1>
            <p className="editorial-deck">{item.summary}</p>
            <div className="editorial-role"><span>MY ROLE</span><strong>{item.role || 'Strategy · Creative direction · Execution'}</strong></div>
            <div className="editorial-opening-index"><span>01</span><span>THE STORY BEHIND THE WORK</span></div>
          </div>
          <div className="editorial-cover">
            {activeMedia?.type === 'video'
              ? <video key={activeMedia.url} src={activeMedia.url} controls className="editorial-cover-media"/>
              : <button type="button" className="editorial-cover-trigger" onClick={() => setViewerOpen(true)} aria-label="Open project image">
                  <img key={activeMedia?.url} src={activeMedia?.url} alt={item.title} className="editorial-cover-media"/>
                  <span className="editorial-expand">OPEN IMAGE ↗</span>
                </button>}
            {activeMedia?.type === 'video' && <button type="button" className="editorial-expand" onClick={() => setViewerOpen(true)}>VIEW FULLSCREEN ↗</button>}
          </div>
        </section>

        <>
          <section className="editorial-context">
            <div><p className="eyebrow">THE THINKING</p><h2>Good creative work<br/><em>starts with a point of view.</em></h2></div>
            <p>{item.summary} The goal was to bring the idea to life through considered creative direction, clear communication and details that make the experience memorable.</p>
          </section>

          <section className="editorial-gallery">
            <div className="editorial-gallery-heading"><p className="eyebrow">02 / VISUAL ARCHIVE</p><span>{String(activeMediaIndex + 1).padStart(2,'0')} — {String(mediaItems.length).padStart(2,'0')}</span></div>
            <div className="editorial-gallery-stage">
              {mediaItems.map((media, index) => (
                <button type="button" key={media.url + index} className={`editorial-gallery-item ${activeMediaIndex === index ? 'is-active' : ''} ${index % 3 === 0 ? 'gallery-item-large' : ''}`} onClick={() => { setActiveMediaIndex(index); setViewerOpen(true); }} aria-label={`Open media ${index + 1}`}>
                  {media.type === 'video' ? <span className="editorial-video-tile"><Film className="h-8 w-8"/><small>VIDEO</small></span> : <img src={media.thumbnailUrl || media.url} alt={`${item.title} — visual ${index + 1}`} loading="lazy"/>}
                  <span className="editorial-gallery-number">{String(index + 1).padStart(2,'0')}</span>
                </button>
              ))}
            </div>
            {mediaItems.length > 1 && <div className="editorial-gallery-controls"><button type="button" onClick={() => setActiveMediaIndex(index => (index - 1 + mediaItems.length) % mediaItems.length)}><ChevronLeft size={16}/> PREVIOUS</button><button type="button" onClick={() => setActiveMediaIndex(index => (index + 1) % mediaItems.length)}>NEXT <ChevronRight size={16}/></button></div>}
          </section>

          <section className="editorial-outcome">
            <p className="eyebrow">03 / WHAT MOVED FORWARD</p>
            <h2>{item.outcome || 'A considered idea, brought to life.'}</h2>
            <div className="editorial-outcome-bottom"><span>STRATEGY → PEOPLE → EXECUTION</span>{item.link?.trim() && <a href={item.link} target="_blank" rel="noreferrer">VIEW PROJECT ↗</a>}</div>
          </section>
          <footer className="editorial-footer"><span>END OF PROJECT FILE</span><button type="button" onClick={onClose}>BACK TO ALL WORK ↑</button><span>RESHAM GURUNG © {new Date().getFullYear()}</span></footer>
        </>
        {viewerOpen && (
          <div className="editorial-media-viewer" role="dialog" aria-modal="true" aria-label="Project media viewer" onClick={event => { if (event.target === event.currentTarget) setViewerOpen(false); }}>
            <div className="editorial-media-viewer-top"><span>{item.title}</span><span>{String(activeMediaIndex + 1).padStart(2,'0')} / {String(mediaItems.length).padStart(2,'0')}</span></div>
            <button type="button" className="editorial-media-viewer-close" onClick={() => setViewerOpen(false)} aria-label="Close image viewer"><X/></button>
            {activeMedia?.type === 'video'
              ? <video key={activeMedia.url} src={activeMedia.url} controls autoPlay className="editorial-media-viewer-content"/>
              : <img key={activeMedia?.url} src={activeMedia?.url} alt={item.title} className="editorial-media-viewer-content"/>}
            {mediaItems.length > 1 && <>
              <button type="button" className="editorial-media-viewer-nav editorial-media-viewer-prev" onClick={() => setActiveMediaIndex(index => (index - 1 + mediaItems.length) % mediaItems.length)} aria-label="Previous image"><ChevronLeft/></button>
              <button type="button" className="editorial-media-viewer-nav editorial-media-viewer-next" onClick={() => setActiveMediaIndex(index => (index + 1) % mediaItems.length)} aria-label="Next image"><ChevronRight/></button>
            </>}
            <p className="editorial-media-viewer-caption">{activeMedia?.type === 'video' ? 'VIDEO' : 'SELECTED PROJECT VISUAL'}</p>
          </div>
        )}
      </article>
    </div>
  );
}

// ============================================================================
// EDITORIAL BOARDS — INTERACTIVE IMAGE EXPLORER
// ============================================================================
function EditorialBoardView({ board, index }: { board: EditorialBoard; index: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusedImage, setFocusedImage] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const draggedRef = useRef(false);
  const images = board.images || [];

  useEffect(() => {
    setActiveIndex(current => Math.min(current, Math.max(0, images.length - 1)));
  }, [images.length]);

  useEffect(() => {
    if (focusedImage === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFocusedImage(null);
      if (event.key === 'ArrowRight') setFocusedImage(current => current === null ? null : (current + 1) % images.length);
      if (event.key === 'ArrowLeft') setFocusedImage(current => current === null ? null : (current - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusedImage, images.length]);

  if (!images.length) return null;

  const goToImage = (imageIndex: number) => {
    const next = (imageIndex + images.length) % images.length;
    setActiveIndex(next);
    const card = trackRef.current?.children[next] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const syncActiveImage = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, childIndex) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < closestDistance) { closestDistance = distance; closestIndex = childIndex; }
    });
    setActiveIndex(closestIndex);
  };

  return (
    <section className={`editorial-board editorial-board-${index % 2 ? 'reverse' : 'normal'}`} aria-label={board.title || 'Editorial board'}>
      <div className="editorial-board-topline">
        <span>{board.eyebrow || 'VISUAL STORY'}</span>
        <span>{String(index + 1).padStart(2, '0')} / EDITORIAL</span>
      </div>
      <div className="editorial-board-heading">
        <h2>{board.title}</h2>
        {board.description?.trim() && <p className="editorial-board-description">{board.description}</p>}
      </div>
      <div className="editorial-board-track-wrap">
        <div
          className="editorial-board-track"
          ref={trackRef}
          onScroll={syncActiveImage}
          onPointerDown={event => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            dragRef.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft };
            draggedRef.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
            const delta = event.clientX - dragRef.current.startX;
            if (Math.abs(delta) > 6) draggedRef.current = true;
            if (draggedRef.current) event.currentTarget.scrollLeft = dragRef.current.scrollLeft - delta;
          }}
          onPointerUp={event => { if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null; }}
          onPointerCancel={() => { dragRef.current = null; }}
          onClickCapture={event => { if (draggedRef.current) { event.preventDefault(); event.stopPropagation(); draggedRef.current = false; } }}
          aria-label="Editorial image gallery"
        >
          {images.map((image, imageIndex) => (
            <button type="button" key={image.id || image.url} className={`editorial-board-card editorial-board-card-${imageIndex % 4}`} onClick={() => setFocusedImage(imageIndex)} aria-label={`View image ${imageIndex + 1}: ${image.alt || board.title}`}>
              <img src={image.url} alt={image.alt || board.title} loading={imageIndex > 1 ? 'lazy' : 'eager'}/>
              <span className="editorial-board-card-shade"/>
              <span className="editorial-board-card-meta">
                <span>{image.caption || board.title}</span>
                <span>{String(imageIndex + 1).padStart(2, '0')}</span>
              </span>
              <span className="editorial-board-card-open">↗</span>
            </button>
          ))}
        </div>
        <div className="editorial-board-footer">
          <div className="editorial-board-progress" aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / images.length) * 100}%` }}/></div>
          <div className="editorial-board-footer-controls">
            <span className="editorial-board-count">{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(images.length).padStart(2, '0')}</span>
            <span className="editorial-board-hint">DRAG OR SCROLL TO EXPLORE</span>
            <div className="editorial-board-controls">
              <button type="button" onClick={() => goToImage(activeIndex - 1)} aria-label="Previous image"><ChevronLeft size={18}/></button>
              <button type="button" onClick={() => goToImage(activeIndex + 1)} aria-label="Next image"><ChevronRight size={18}/></button>
            </div>
          </div>
        </div>
      </div>
      {focusedImage !== null && images[focusedImage] && (
        <div className="editorial-image-viewer" role="dialog" aria-modal="true" aria-label="Expanded editorial image" onClick={event => { if (event.target === event.currentTarget) setFocusedImage(null); }}>
          <div className="editorial-viewer-top"><span>{board.title}</span><span>{String(focusedImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div>
          <button type="button" className="editorial-image-close" onClick={() => setFocusedImage(null)} aria-label="Close image"><X/></button>
          <button type="button" className="editorial-image-nav editorial-image-prev" onClick={() => setFocusedImage(current => current === null ? null : (current - 1 + images.length) % images.length)} aria-label="Previous image"><ChevronLeft/></button>
          <img src={images[focusedImage].url} alt={images[focusedImage].alt || board.title}/>
          <button type="button" className="editorial-image-nav editorial-image-next" onClick={() => setFocusedImage(current => current === null ? null : (current + 1) % images.length)} aria-label="Next image"><ChevronRight/></button>
          {images[focusedImage].caption && <p className="editorial-viewer-caption">{images[focusedImage].caption}</p>}
        </div>
      )}
    </section>
  );
}

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

  const [activeTab, setActiveTab] = useState<'projects' | 'boards' | 'experience' | 'profile' | 'pages' | 'json'>('projects');
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
  const [boardsDraft, setBoardsDraft] = useState<EditorialBoard[]>(content.editorialBoards || []);

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
    setBoardsDraft(content.editorialBoards || []);
    setPageForm({ projectsHeading: content.projectsHeading, projectsEyebrow: content.projectsEyebrow,
      impactHeading: content.impactHeading, impactEyebrow: content.impactEyebrow,
      experienceHeading: content.experienceHeading, experienceEyebrow: content.experienceEyebrow,
      approachHeading: content.approachHeading, approachEyebrow: content.approachEyebrow,
      contactHeading: content.contactHeading || '', contactAccent: content.contactAccent || '', contactDescription: content.contactDescription || '',
      contactOptions: (content.contactOptions || []).join('\n'), metrics: content.metrics, principles: content.principles });
  }, [content]);

  const saveBoards = (event: FormEvent) => {
    event.preventDefault();
    const cleaned = boardsDraft.map(board => ({
      ...board,
      eyebrow: (board.eyebrow || '').trim(),
      title: (board.title || '').trim(),
      description: (board.description || '').trim(),
      images: (board.images || []).filter(image => image.url.trim()).map(image => ({ ...image, url: image.url.trim(), alt: (image.alt || '').trim(), caption: (image.caption || '').trim() }))
    }));
    if (cleaned.some(board => !board.title)) { notify('Give each board a short title.'); return; }
    if (cleaned.some(board => board.images.some(image => !/^https?:\/\//i.test(image.url)))) { notify('Each image needs a valid http or https URL.'); return; }
    onUpdateContent({ ...content, editorialBoards: cleaned });
    notify('Editorial boards saved.');
  };

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
          {!isSupabaseConfigured && (
            <div role="alert" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
              <strong className="mb-1 block">Admin sign-in is not configured for this deployment.</strong>
              Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the Vercel environment for this branch, then redeploy. A Supabase Auth admin account is also required.
            </div>
          )}
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
      <aside className="flex h-full w-full admin-shell max-w-6xl flex-col bg-[#f6f5f1] shadow-2xl" role="dialog" aria-modal="true" aria-label="Portfolio content studio">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171715] text-xs font-bold tracking-tight text-white">RG</span>
            <div>
              <h2 className="text-base font-extrabold text-black">Content Studio</h2>
              <p className="text-xs text-black/50">RESHAM GURUNG · PORTFOLIO MANAGEMENT</p>
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

        {/* Content overview */}
        <div className="admin-overview grid grid-cols-2 gap-px border-b border-black/10 bg-black/10 sm:grid-cols-4">
          {[
            { label: 'Selected work', value: content.projects.length, note: 'Project stories' },
            { label: 'Editorial boards', value: (content.editorialBoards || []).length, note: 'Visual collections' },
            { label: 'Experience', value: content.experience.length, note: 'Career entries' },
            { label: 'Page sections', value: 5, note: 'Copy & contact' }
          ].map(item => <div key={item.label} className="bg-[#f6f5f1] px-5 py-4"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-black/40">{item.label}</p><div className="mt-1 flex items-baseline gap-2"><strong className="text-2xl font-semibold tracking-tight text-black">{String(item.value).padStart(2, '0')}</strong><span className="text-[10px] text-black/40">{item.note}</span></div></div>)}
        </div>

        {/* Tabs */}
        <div className="admin-tabs flex border-b border-black/10 bg-white px-6 text-xs font-bold">
          {([
            { key: 'projects', icon: <Layers className="h-3.5 w-3.5" />, label: `Work (${content.projects.length})` },
            { key: 'boards', icon: <Film className="h-3.5 w-3.5" />, label: `Boards (${(content.editorialBoards || []).length})` },
            { key: 'experience', icon: <Briefcase className="h-3.5 w-3.5" />, label: `Exp (${content.experience.length})` },
            { key: 'profile', icon: <Sliders className="h-3.5 w-3.5" />, label: 'Hero & Profile' },
            { key: 'pages', icon: <FileText className="h-3.5 w-3.5" />, label: 'Page Content' },
            { key: 'json', icon: <FileText className="h-3.5 w-3.5" />, label: 'JSON' }
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 transition-colors ${
                activeTab === tab.key ? 'border-[#bd5938] bg-white text-[#171715]' : 'border-transparent text-black/50 hover:border-black/20 hover:text-black'
              }`}
            >
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="admin-content flex-1 overflow-y-auto p-6 md:p-9">

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

          {/* EDITORIAL BOARDS */}
          {activeTab === 'boards' && (
            <form onSubmit={saveBoards} className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><h3 className="text-lg font-bold text-black">Editorial boards</h3><p className="text-xs text-black/55">Manage the image stories shown around Selected Work.</p></div>
                <button type="button" onClick={() => setBoardsDraft([...boardsDraft, { id: `board-${Date.now()}`, eyebrow: '', title: 'New board', description: '', images: [] }])} className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white"><Plus className="mr-1 inline h-3.5 w-3.5"/>Add board</button>
              </div>
              {boardsDraft.map((board, boardIndex) => (
                <section key={board.id} className="space-y-4 rounded-2xl border border-black/10 bg-white p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-widest text-[#bd5938]">Board {String(boardIndex + 1).padStart(2, '0')}</span><div className="flex items-center gap-2"><button type="button" disabled={boardIndex === 0} onClick={() => setBoardsDraft(current => { const next = [...current]; [next[boardIndex - 1], next[boardIndex]] = [next[boardIndex], next[boardIndex - 1]]; return next; })} className="rounded-lg border border-black/10 px-2 py-1 text-[10px] font-bold disabled:opacity-30">Move up</button><button type="button" disabled={boardIndex === boardsDraft.length - 1} onClick={() => setBoardsDraft(current => { const next = [...current]; [next[boardIndex + 1], next[boardIndex]] = [next[boardIndex], next[boardIndex + 1]]; return next; })} className="rounded-lg border border-black/10 px-2 py-1 text-[10px] font-bold disabled:opacity-30">Move down</button><button type="button" onClick={() => setBoardsDraft(boardsDraft.filter((_, i) => i !== boardIndex))} className="rounded-lg border border-red-200 p-2 text-red-600" aria-label="Delete board"><Trash2 size={15}/></button></div></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-[11px] font-bold">Small label<input value={board.eyebrow} onChange={e => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, eyebrow: e.target.value } : item))} placeholder="Optional" className={`${inputCls} mt-1`}/></label>
                    <label className="text-[11px] font-bold">Board title *<input required value={board.title} onChange={e => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, title: e.target.value } : item))} className={`${inputCls} mt-1`}/></label>
                  </div>
                  <label className="block text-[11px] font-bold">Short description <span className="font-normal text-black/40">(optional)</span><textarea rows={2} value={board.description || ''} onChange={e => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, description: e.target.value } : item))} className={inputCls + ' mt-1'}/></label>
                  <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#171715] text-[#f6f5f1]">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                      <span className="text-[9px] font-bold uppercase tracking-[.18em] text-white/45">Live board preview</span>
                      <span className="text-[9px] font-mono text-white/45">{board.images.length} {board.images.length === 1 ? 'IMAGE' : 'IMAGES'}</span>
                    </div>
                    <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:items-center sm:p-5">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#d58b70]">{board.eyebrow || 'EDITORIAL'}</p>
                        <h4 className="mt-2 break-words text-2xl font-semibold leading-[.95] tracking-[-.055em] sm:text-3xl">{board.title || 'Untitled board'}</h4>
                        <p className="mt-3 line-clamp-3 text-[11px] leading-relaxed text-white/55">{board.description || 'Your board description will appear here.'}</p>
                      </div>
                      <div className="grid min-h-[116px] grid-cols-4 gap-1.5">
                        {board.images.slice(0, 4).map((asset, previewIndex) => <div key={asset.id || previewIndex} className="relative aspect-[3/4] overflow-hidden rounded-md bg-white/10">
                          {asset.url ? <img src={asset.url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[8px] text-white/35">Add URL</div>}
                        </div>)}
                        {!board.images.length && <div className="col-span-4 flex items-center justify-center rounded-md border border-dashed border-white/20 text-[10px] text-white/40">Your images will appear here</div>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><h4 className="text-xs font-bold">Images ({board.images.length})</h4><button type="button" onClick={() => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, images: [...item.images, { id: `img-${Date.now()}`, url: '', alt: '', caption: '' }] } : item))} className="rounded-full border border-black/15 px-3 py-1.5 text-[10px] font-bold">+ Add image</button></div>
                    {board.images.map((image, imageIndex) => (
                      <div key={image.id || imageIndex} className="grid gap-3 rounded-xl border border-black/5 bg-[#f6f5f1] p-3 sm:grid-cols-[132px_1fr]">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black/10">{image.url ? <img src={image.url} alt="" className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center text-[10px] text-black/35">Image preview</div>}<span className="absolute bottom-1.5 left-1.5 rounded bg-black/65 px-1.5 py-1 font-mono text-[8px] text-white">{String(imageIndex + 1).padStart(2,'0')}</span></div>
                        <div className="min-w-0 space-y-2">
                          <input type="url" value={image.url} onChange={e => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, images: item.images.map((asset, j) => j === imageIndex ? { ...asset, url: e.target.value } : asset) } : item))} placeholder="Image URL (https://...)" aria-label="Image URL" className={inputCls}/>
                          <div className="grid gap-2 sm:grid-cols-2"><input value={image.alt} onChange={e => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, images: item.images.map((asset, j) => j === imageIndex ? { ...asset, alt: e.target.value } : asset) } : item))} placeholder="Image description (alt text)" aria-label="Image description" className={inputCls}/><input value={image.caption || ''} onChange={e => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, images: item.images.map((asset, j) => j === imageIndex ? { ...asset, caption: e.target.value } : asset) } : item))} placeholder="Caption (optional)" aria-label="Image caption" className={inputCls}/></div>
                          <div className="flex justify-end gap-2"><button type="button" disabled={imageIndex === 0} onClick={() => setBoardsDraft(boardsDraft.map((item, i) => { if (i !== boardIndex) return item; const images = [...item.images]; [images[imageIndex - 1], images[imageIndex]] = [images[imageIndex], images[imageIndex - 1]]; return { ...item, images }; }))} className="rounded-lg border border-black/10 px-2 py-1 text-[10px] font-bold disabled:opacity-30">Move up</button><button type="button" disabled={imageIndex === board.images.length - 1} onClick={() => setBoardsDraft(boardsDraft.map((item, i) => { if (i !== boardIndex) return item; const images = [...item.images]; [images[imageIndex + 1], images[imageIndex]] = [images[imageIndex], images[imageIndex + 1]]; return { ...item, images }; }))} className="rounded-lg border border-black/10 px-2 py-1 text-[10px] font-bold disabled:opacity-30">Move down</button><button type="button" onClick={() => setBoardsDraft(boardsDraft.map((item, i) => i === boardIndex ? { ...item, images: item.images.filter((_, j) => j !== imageIndex) } : item))} className="rounded-lg border border-red-200 px-2 py-1 text-[10px] font-bold text-red-600">Remove</button></div>
                        </div>
                      </div>
                    ))}
                    {!board.images.length && <p className="rounded-xl border border-dashed border-black/15 p-5 text-center text-xs text-black/45">No images yet. Add an image to make this board visible.</p>}
                  </div>
                </section>
              ))}
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-bold text-white"><Save size={15}/>Save editorial boards</button>
            </form>
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
        {(content.editorialBoards || []).slice(0, 1).map((board, index) => <EditorialBoardView key={board.id} board={board} index={index} />)}

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

        {(content.editorialBoards || []).slice(1).map((board, index) => <EditorialBoardView key={board.id} board={board} index={index + 1} />)}

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
