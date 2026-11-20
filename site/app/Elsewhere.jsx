import Taped from './Taped';

// The back-cover stickers and the RunningHead menu row both read this list.
export const SOCIALS = [
  { name: 'Instagram', handle: '@alhadad.dev', href: 'https://www.instagram.com/alhadad.dev', shape: 'burst' },
  { name: 'Threads', handle: '@alhadad.dev', href: 'https://www.threads.com/@alhadad.dev', shape: 'circle' },
  { name: 'X', handle: '@alhadad_dev', href: 'https://x.com/alhadad_dev', shape: 'square' },
  { name: 'LinkedIn', handle: 'in/alhadad-dev', href: 'https://www.linkedin.com/in/alhadad-dev/', shape: 'pill' },
  { name: 'GitHub', handle: '@alhadad-xyz', href: 'https://github.com/alhadad-xyz', shape: 'tab' },
];

// Where each sticker sits on the sleeve's right half from 1200px, in % of that area, and its tilt.
const SPOTS = [
  { x: 6, y: 4, r: -8 },
  { x: 52, y: 0, r: 5 },
  { x: 30, y: 38, r: -3 },
  { x: 58, y: 50, r: 9 },
  { x: 10, y: 72, r: -6 },
];

export default function Elsewhere() {
  if (!SOCIALS.length) return null;

  return (
    <div className="elsewhere">
      <ul className="stickers">
        {SOCIALS.map((s, i) => {
          const { x, y, r } = SPOTS[i % SPOTS.length];
          return (
            <li key={s.name} style={{ '--x': `${x}%`, '--y': `${y}%` }}>
              <Taped
                as="a"
                className={`sticker sticker--${s.shape}`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                style={{ '--r': `${r}deg` }}
                aria-label={`${s.name}, ${s.handle} (opens in a new tab)`}
              >
                <span className="sticker__name">{s.name}</span>
                <span className="sticker__handle">{s.handle}</span>
              </Taped>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
