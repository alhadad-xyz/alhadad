// Add Instagram, Threads, X here once the handles are known; the strip and the menu both read this list.
export const SOCIALS = [
  { name: 'GitHub', handle: '@alhadad-xyz', href: 'https://github.com/alhadad-xyz' },
];

export default function Elsewhere() {
  if (!SOCIALS.length) return null;

  return (
    <div className="elsewhere">
      <p className="eyebrow">Elsewhere — find the author</p>
      <ul>
        {SOCIALS.map((s) => (
          <li key={s.name}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              <span className="elsewhere__name">{s.name}</span>
              <span className="elsewhere__handle">
                {s.handle} <span aria-hidden="true">↗</span>
              </span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
