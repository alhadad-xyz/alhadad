// Written to out/404.html; Caddy serves it with a 404 status (deploy/Caddyfile).
export const metadata = { title: 'Not in this issue — Alhadad' };

export default function NotFound() {
  return (
    <main className="chapter not-found">
      <p className="eyebrow">Error 404</p>
      <h1>Not in this issue.</h1>
      <p>The page you asked for isn’t here. <a href="/">Back to the cover</a>.</p>
    </main>
  );
}
