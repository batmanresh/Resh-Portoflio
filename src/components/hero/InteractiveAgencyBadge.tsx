import { useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import './InteractiveAgencyBadge.css';

type Props = { name: string; roleLine: string; location?: string; portraitSrc?: string };

export default function InteractiveAgencyBadge({ name, roleLine, location = 'Dubai, UAE', portraitSrc }: Props) {
  const start = useRef({ x: 0, y: 0, moved: false });
  const origin = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [failedImage, setFailedImage] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0, rotate: 0, tiltX: 0, tiltY: 0 });

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    start.current = { x: event.clientX, y: event.clientY, moved: false };
    origin.current = { x: offset.x, y: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (dragging) {
      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) start.current.moved = true;
      setOffset({ x: Math.max(-90, Math.min(90, origin.current.x + dx)), y: Math.max(-50, Math.min(65, origin.current.y + dy)), rotate: Math.max(-15, Math.min(15, dx * .16)), tiltX: Math.max(-8, Math.min(8, -dy * .06)), tiltY: Math.max(-10, Math.min(10, dx * .08)) });
      return;
    }
    if (event.pointerType === 'touch') return;
    const px = (event.clientX - bounds.left) / bounds.width - .5;
    const py = (event.clientY - bounds.top) / bounds.height - .5;
    setOffset(value => ({ ...value, tiltX: -py * 7, tiltY: px * 9 }));
  };
  const pointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (!start.current.moved) setFlipped(value => !value);
    setOffset({ x: 0, y: 0, rotate: 0, tiltX: 0, tiltY: 0 });
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFlipped(value => !value); }
  };
  const transform = `rotateX(${offset.tiltX}deg) rotateY(${offset.tiltY}deg)`;

  return (
    <div className={`agency-pass-stage ${dragging ? 'is-dragging' : ''}`}>
      <div className="agency-pass-meta"><span>PERSONAL IDENTITY / 001</span><span>DRAG TO PLAY</span></div>
      <div className="agency-pass-swing" style={{ transform: `translateX(${offset.x}px) translateY(${offset.y}px) rotate(${offset.rotate}deg)`, transition: dragging ? 'none' : 'transform 850ms cubic-bezier(.16,1,.3,1)' }}>
        <div className="agency-pass-pendulum">
        <svg className="agency-pass-lanyard" viewBox="0 0 160 230" aria-hidden="true">
          <defs>
            <linearGradient id="pass-strap" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#6d7044"/><stop offset=".5" stopColor="#a1a16b"/><stop offset="1" stopColor="#66683e"/></linearGradient>
            <linearGradient id="pass-metal" x1="0" x2="1"><stop offset="0" stopColor="#8d8c85"/><stop offset=".48" stopColor="#f5f3ed"/><stop offset="1" stopColor="#77766f"/></linearGradient>
          </defs>
          <path d="M59 -12 L101 -12 L101 111 Q101 127 80 127 Q59 127 59 111 Z" fill="url(#pass-strap)"/>
          {[18,48,78].map(y => <circle key={y} cx="80" cy={y} r="8" fill="#555735" opacity=".8"/>)}
          <path d="M80 126 v13" stroke="url(#pass-metal)" strokeWidth="5"/>
          <circle cx="80" cy="146" r="12" fill="none" stroke="url(#pass-metal)" strokeWidth="5"/>
          <path d="M80 158 v22" stroke="url(#pass-metal)" strokeWidth="5"/>
          <path d="M68 179 h24 l-3 15 H71z" fill="url(#pass-metal)" stroke="#77766f" strokeWidth="1"/>
          <path d="M73 181 h14 v8 H73z" fill="#a7a59c"/>
        </svg>
        <div className="agency-pass-interaction" style={{ transform, transition: dragging ? 'none' : 'transform 850ms cubic-bezier(.16,1,.3,1)' }} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onKeyDown={keyDown} role="button" tabIndex={0} aria-label={flipped ? 'Identity pass reverse. Activate to flip to front.' : 'Identity pass front. Activate to flip to reverse.'} aria-pressed={flipped}>
          <div className={`agency-pass-card ${flipped ? 'is-flipped' : ''}`}>
            <section className="agency-pass-face agency-pass-front" aria-hidden={flipped}>
              <h2>{name}</h2>
              <div className="agency-pass-photo">
                {portraitSrc && !failedImage ? <img src={portraitSrc} alt={name} draggable={false} onError={() => setFailedImage(true)}/> : <div className="agency-pass-placeholder"><span>{name.split(/\s+/).map(word => word[0]).slice(0,2).join('').toUpperCase()}</span></div>}
              </div>
              <div className="agency-pass-role">{roleLine}</div>
              <div className="agency-pass-location">{location}</div>
              <span className="agency-pass-serial">RG — 001</span>
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
      <div className="agency-pass-instruction"><RotateCw size={13}/><span>DRAG THE PASS <i>·</i> CLICK TO FLIP</span></div>
    </div>
  );
}
