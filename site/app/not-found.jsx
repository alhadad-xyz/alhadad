// Written to out/404.html; Caddy serves it with a 404 status (deploy/Caddyfile).
export const metadata = { title: 'Not in this issue — Alhadad' };

// A record stuck in a groove: it keeps jumping back, like the headline.
export default function NotFound() {
  return (
    <main className="chapter not-found">
      <svg className="skip" viewBox="0 0 220 220" aria-hidden="true">
        <g className="skip__disc">
          <circle cx="110" cy="110" r="108" />
          {[96, 86, 76, 66, 56].map((r) => <circle key={r} className="skip__groove" cx="110" cy="110" r={r} />)}
          <circle className="skip__label" cx="110" cy="110" r="36" />
          <path className="skip__scratch" d="M150 60l20-14" />
        </g>
        <g className="skip__arm">
          <circle cx="205" cy="20" r="7" />
          <path d="M205 20L197 112L172 148" />
        </g>
      </svg>
      <p className="eyebrow">Error 404 — Out of print</p>
      <h1 aria-label="Not in this issue.">
        <span aria-hidden="true"><span className="skip__echo">Not in this⁠— </span><span className="skip__echo">not in this⁠— </span>not in this issue.</span>
      </h1>
      <p>The page you asked for isn’t here. <a href="/">Back to the cover</a>.</p>
    </main>
  );
}
