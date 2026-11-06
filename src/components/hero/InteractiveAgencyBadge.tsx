import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import './InteractiveAgencyBadge.css';

type Props = { name: string; roleLine: string; location?: string; portraitSrc?: string };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function InteractiveAgencyBadge({ name, roleLine, location = 'Dubai, UAE', portraitSrc = '/resham-profile.webp' }: Props) {
  const rigRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, moved: false, lastX: 0, lastTime: 0 });
  const physics = useRef({ angle: -2.2, velocity: 0, target: 0, dragging: false });
  const [flipped, setFlipped] = useState(false);
  const [failedImage, setFailedImage] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  // A damped spring drives the entire pass from its suspension point.
  // The strap, clip and card therefore share one continuous physical motion.
  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.032);
      previous = now;
      const p = physics.current;
      if (!p.dragging && !reducedMotion) {
        const stiffness = 34;
        const damping = 8.2;
        const acceleration = (p.target - p.angle) * stiffness - p.velocity * damping;
        p.velocity += acceleration * dt;
        p.angle += p.velocity * dt;
        if (Math.abs(p.angle - p.target) < 0.015 && Math.abs(p.velocity) < 0.02) {
          p.angle = p.target;
          p.velocity = 0;
        }
      } else if (reducedMotion && !p.dragging) {
        p.angle = p.target;
        p.velocity = 0;
      }
      if (rigRef.current) rigRef.current.style.transform = `rotate(${p.angle.toFixed(3)}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointer.current = { x: event.clientX, y: event.clientY, moved: false, lastX: event.clientX, lastTime: performance.now() };
    physics.current.dragging = true;
    physics.current.velocity = 0;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (physics.current.dragging) {
      const dx = event.clientX - pointer.current.x;
      const dy = event.clientY - pointer.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) pointer.current.moved = true;
      const bounds = event.currentTarget.getBoundingClientRect();
      const pivotX = bounds.left + bounds.width / 2;
      const pivotY = bounds.top - 155;
      const angle = Math.atan2(event.clientX - pivotX, Math.max(100, event.clientY - pivotY)) * (180 / Math.PI);
      const next = clamp(angle * 1.2, -22, 22);
      const now = performance.now();
      const elapsed = Math.max(8, now - pointer.current.lastTime);
      physics.current.velocity = clamp(((next - physics.current.target) / elapsed) * 1000, -100, 100);
      physics.current.target = next;
      physics.current.angle = next;
      pointer.current.lastX = event.clientX;
      pointer.current.lastTime = now;
      return;
    }
    if (event.pointerType === 'touch' || !cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    cardRef.current.style.setProperty('--tilt-x', `${clamp(-py * 8, -5, 5)}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${clamp(px * 10, -7, 7)}deg`);
  };

  const release = () => {
    if (!physics.current.dragging) return;
    physics.current.dragging = false;
    physics.current.target = 0;
    physics.current.velocity *= 0.72;
    setDragging(false);
    if (!pointer.current.moved) setFlipped(value => !value);
  };

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setFlipped(value => !value);
    }
  };

  return (
    <div className={`agency-pass-stage ${dragging ? 'is-dragging' : ''} ${reducedMotion ? 'is-reduced-motion' : ''}`}>
      <div className="agency-pass-meta"><span>PERSONAL IDENTITY / 001</span><span>DRAG TO SWING</span></div>
      <div className="agency-pass-rig" ref={rigRef}>
        <svg className="agency-pass-lanyard" viewBox="0 0 220 280" aria-hidden="true">
          <defs>
            <linearGradient id="pass-strap" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#62663d"/><stop offset=".48" stopColor="#a0a36d"/><stop offset="1" stopColor="#686b42"/></linearGradient>
            <linearGradient id="pass-metal" x1="0" x2="1"><stop offset="0" stopColor="#77766f"/><stop offset=".48" stopColor="#f8f6ee"/><stop offset="1" stopColor="#77766f"/></linearGradient>
          </defs>
          <path d="M88 -12 H132 V132 Q132 151 110 151 Q88 151 88 132 Z" fill="url(#pass-strap)"/>
          <path d="M94 -8 V126 M126 -8 V126" stroke="#d3d2a7" strokeWidth="1" opacity=".42"/>
          {[22,56,90].map(y => <g key={y}><circle cx="110" cy={y} r="7" fill="#555735" opacity=".7"/><circle cx="110" cy={y} r="2" fill="#c4c58d" opacity=".7"/></g>)}
          <path d="M110 150 v13" stroke="url(#pass-metal)" strokeWidth="6"/>
          <circle cx="110" cy="173" r="13" fill="none" stroke="url(#pass-metal)" strokeWidth="5"/>
          <path d="M110 186 v18" stroke="url(#pass-metal)" strokeWidth="6"/>
          <path d="M96 202 h28 l-3 17 H99z" fill="url(#pass-metal)" stroke="#77766f" strokeWidth="1"/>
          <path d="M102 205 h16 v9 h-16z" fill="#a7a59c"/>
        </svg>
        <div className="agency-pass-card-anchor">
          <div className="agency-pass-clip" aria-hidden="true"><span /></div>
          <div className="agency-pass-interaction" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={release} onPointerCancel={release} onKeyDown={keyDown} role="button" tabIndex={0} aria-label={flipped ? 'Identity pass reverse. Activate to flip to front.' : 'Identity pass front. Activate to flip to reverse.'} aria-pressed={flipped}>
            <div className={`agency-pass-card ${flipped ? 'is-flipped' : ''}`} ref={cardRef}>
              <section className="agency-pass-face agency-pass-front" aria-hidden={flipped}>
                <div className="agency-pass-top"><span>RESHAM GURUNG</span><span>CREATIVE ID / 01</span></div>
                <div className="agency-pass-photo">
                  {portraitSrc && !failedImage ? <img src={portraitSrc} alt={name} draggable={false} onError={() => setFailedImage(true)}/> : <div className="agency-pass-placeholder"><span>{name.split(/\s+/).map(word => word[0]).slice(0,2).join('').toUpperCase()}</span></div>}
                </div>
                <div className="agency-pass-identity"><h2>{name}</h2><p>{roleLine}</p></div>
                <div className="agency-pass-bottom"><span>{location}</span><span className="agency-pass-serial">RG — 001</span></div>
              </section>
              <section className="agency-pass-face agency-pass-reverse" aria-hidden={!flipped}>
                <span className="agency-pass-reverse-kicker">A LITTLE ABOUT MY WORK</span>
                <h2>Good ideas need people, clarity and follow-through.</h2>
                <div className="agency-pass-skills">{['Marketing & brand strategy','Partnerships & activations','Lead generation','Commercial growth'].map((item, i) => <div key={item}><span>0{i+1}</span>{item}<ArrowUpRight size={14}/></div>)}</div>
                <span className="agency-pass-serial">RESHAM GURUNG / DUBAI</span>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="agency-pass-instruction"><RotateCw size={13}/><span>DRAG TO SWING <i>·</i> TAP TO FLIP</span></div>
    </div>
  );
}
