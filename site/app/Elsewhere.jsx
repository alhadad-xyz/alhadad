import Taped from './Taped';

// The back-cover stickers and the RunningHead menu row both read this list.
export const SOCIALS = [
  { name: 'Instagram', handle: '@alhadad.dev', href: 'https://www.instagram.com/alhadad.dev', shape: 'burst' },
  { name: 'Threads', handle: '@alhadad.dev', href: 'https://www.threads.com/@alhadad.dev', shape: 'circle' },
  { name: 'X', handle: '@alhadad_dev', href: 'https://x.com/alhadad_dev', shape: 'square' },
  { name: 'LinkedIn', handle: 'in/alhadad-dev', href: 'https://www.linkedin.com/in/alhadad-dev/', shape: 'pill' },
  { name: 'GitHub', handle: '@alhadad-xyz', href: 'https://github.com/alhadad-xyz', shape: 'tab' },
];

const ROTATIONS = [-8, 5, -3, 9, -6];

export default function Elsewhere() {
  if (!SOCIALS.length) return null;

  return (
    <div className="elsewhere">
      <p className="eyebrow">Stick these anywhere</p>
      <ul className="stickers">
        {SOCIALS.map((s, i) => (
          <li key={s.name}>
            <Taped
              as="a"
              className={`sticker sticker--${s.shape}`}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              style={{ '--r': `${ROTATIONS[i % ROTATIONS.length]}deg` }}
              aria-label={`${s.name}, ${s.handle} (opens in a new tab)`}
            >
              <span className="sticker__name">{s.name}</span>
              <span className="sticker__handle">{s.handle}</span>
            </Taped>
          </li>
        ))}
      </ul>
    </div>
  );
}
