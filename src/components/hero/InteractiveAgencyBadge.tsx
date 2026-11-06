import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import './InteractiveAgencyBadge.css';

type Props = {
  name: string;
  roleLine: string;
  location?: string;
  portraitSrc?: string;
};

export default function InteractiveAgencyBadge({
  name,
  roleLine,
  location = 'Dubai, UAE',
  portraitSrc
}: Props) {
  const pointerStart = useRef({ x: 0, y: 0, moved: false });
  const dragOrigin = useRef({ x: 0, y: 0 });
  const [drag, setDrag] = useState({ x: 0, y: 0, rotate: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY, moved: false };
    dragOrigin.current = { x: drag.x, y: drag.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) pointerStart.current.moved = true;
    const x = Math.max(-105, Math.min(105, dragOrigin.current.x + dx));
    const y = Math.max(-58, Math.min(74, dragOrigin.current.y + dy));
    setDrag({ x, y, rotate: Math.max(-17, Math.min(17, dx * 0.12)) });
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!pointerStart.current.moved) setFlipped(value => !value);
    else setDrag({ x: 0, y: 0, rotate: 0 });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setFlipped(value => !value);
    }
  };

  const cardTransform = `translate3d(${drag.x}px, ${drag.y}px, 0) rotateZ(${drag.rotate}deg) rotateX(${isDragging ? -drag.y * 0.13 : 0}deg) rotateY(${isDragging ? drag.x * 0.16 : 0}deg)`;
  const strapPath = `M 155 0 C 155 72, ${155 - drag.x * 0.12} 92, ${155 + drag.x * 0.08} 158`;

  return (
    <div className={`agency-badge-stage ${reducedMotion ? 'is-reduced-motion' : ''}`}>
      <div className="agency-badge-index" aria-hidden="true">
        <span>FIELD NOTES / 001</span><span>IDENTITY OBJECT</span>
      </div>
      <svg className="agency-lanyard" viewBox="0 0 310 205" aria-hidden="true">
        <defs>
          <linearGradient id="lanyard-weave" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#292724" />
            <stop offset=".48" stopColor="#4b4741" />
            <stop offset="1" stopColor="#1d1c1a" />
          </linearGradient>
        </defs>
        <path d={strapPath} fill="none" stroke="#d5d0c6" strokeWidth="19" strokeLinecap="round" transform="translate(0 2)" />
        <path d={strapPath} fill="none" stroke="url(#lanyard-weave)" strokeWidth="16" strokeLinecap="round" />
        <path d={strapPath} fill="none" stroke="#777168" strokeWidth="1" strokeDasharray="2 4" opacity=".75" />
        <path d="M155 151 v19" stroke="#9b9489" strokeWidth="8" strokeLinecap="round" />
        <path d="M155 151 v19" stroke="#e1dcd2" strokeWidth="2" strokeLinecap="round" />
        <path d="M146 170 h18 l-2 18 h-14z" fill="#a9a39a" stroke="#777168" strokeWidth="1" />
        <path d="M151 173 h8 v10 h-8z" fill="#3b3935" />
      </svg>

      <div
        className={`agency-badge-drag-zone ${isDragging ? 'is-dragging' : ''}`}
        style={{ transform: cardTransform, transition: isDragging || reducedMotion ? 'none' : 'transform 900ms cubic-bezier(.18,.78,.2,1)' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Agency identity badge, reverse side. Activate to show front.' : 'Agency identity badge, front side. Activate to show reverse.'}
        aria-pressed={flipped}
      >
        <div className={`agency-badge-card ${flipped ? 'is-flipped' : ''}`}>
          <section className="agency-badge-face agency-badge-front" aria-hidden={flipped}>
            <div className="badge-topline">
              <span className="badge-brand">RESH<span>.</span></span>
              <span className="badge-access">CREATIVE / 001</span>
            </div>
            <div className="badge-portrait">
              {portraitSrc && !imageFailed ? (
                <img src={portraitSrc} alt={name} draggable={false} onError={() => setImageFailed(true)} />
              ) : (
                <div className="badge-monogram" aria-label={`Portrait placeholder for ${name}`}>
                  <span>{name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()}</span>
                  <small>PORTRAIT</small>
                </div>
              )}
              <span className="portrait-corner portrait-corner-tl" />
              <span className="portrait-corner portrait-corner-br" />
            </div>
            <div className="badge-identity">
              <p className="badge-overline">THE PERSON BEHIND THE WORK</p>
              <h2>{name}</h2>
              <p className="badge-role">{roleLine}</p>
            </div>
            <div className="badge-footer">
              <div><span>BASED IN</span><strong>{location}</strong></div>
              <div className="badge-id"><span>ACCESS</span><strong>OPEN / 24</strong></div>
              <span className="badge-stamp">RG</span>
            </div>
            <div className="badge-edge-code">STRATEGY · PEOPLE · PROGRESS</div>
          </section>

          <section className="agency-badge-face agency-badge-back" aria-hidden={!flipped}>
            <div className="badge-back-head">
              <span className="badge-brand">RESH<span>.</span></span>
              <span>CAPABILITIES / 001</span>
            </div>
            <p className="badge-back-kicker">WHAT I BRING TO THE TABLE</p>
            <div className="badge-capabilities">
              {['Brand & campaign strategy', 'Partnerships & activations', 'Lead generation', 'Commercial growth', 'People-first execution'].map((item, index) => (
                <div className="badge-capability" key={item}>
                  <span>0{index + 1}</span><strong>{item}</strong><ArrowUpRight size={14} />
                </div>
              ))}
            </div>
            <div className="badge-back-bottom">
              <div className="badge-pattern" aria-hidden="true">{Array.from({ length: 49 }, (_, i) => <i key={i} />)}</div>
              <div><span>GOOD WORK IS</span><strong>NEVER A SOLO ACT.</strong></div>
            </div>
            <span className="badge-back-serial">RG / DUBAI / UAE</span>
          </section>
        </div>
      </div>

      <div className="agency-badge-hint" aria-live="polite">
        <span className="badge-hint-icon"><RotateCw size={13} /></span>
        <span>DRAG TO MOVE <i>·</i> CLICK TO FLIP</span>
      </div>
      <div className="agency-badge-caption" aria-hidden="true">
        <span>AN INTRODUCTION, NOT A CV.</span><span>EST. WITH INTENT.</span>
      </div>
    </div>
  );
}
