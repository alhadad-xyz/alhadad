# Working on site/ (notes for Claude)

The personal site at https://alhadad.dev. Product intent is in `prd.md`; open work is in `task.md`.

## Commands

```bash
npm run dev -- -p 3123   # port 3000 on this machine is taken by Gotenberg
npm run build            # static export to out/
```

## Deploy

Deploy only when asked. Run from `site/`:

```bash
npm run build
rsync -an --delete --itemize-changes out/ alhadad-vps:/srv/alhadad-site/ | grep deleting   # dry run: expect only old build hashes
rsync -a --delete out/ alhadad-vps:/srv/alhadad-site/
curl -sI https://alhadad.dev/ | grep -i last-modified
```

Caddy serves `/srv/alhadad-site`, and its config lives in `deploy/Caddyfile`. The SSH alias `alhadad-vps` points at 103.150.92.93 as user `khalid`.

## Map

| File | What it owns |
|------|--------------|
| `app/page.jsx` | All markup: preloader, hero cover and chapters. `CHAPTERS` drives the cover lines. |
| `app/globals.css` | Tokens on `:root`, the preloader, the hero cover and the chapters |
| `app/RunningHead.jsx` | Running header past the cover: scroll observer for the current chapter, `<details>` chapter index |
| `app/Intro.jsx` | GSAP: preloader beats, the pour, the drain, the hero entrance (`hook()`) and chapter reveals |
| `app/Portrait.jsx` | Mounts the liquid once the photo and fonts are ready, and exports `portraitReady` |
| `app/liquid.js` | WebGL2 fluid simulation, plus the display shader (photo, painted layer, masthead redraw) |
| `app/doodles.js` | Builds the painted sheet (doodles, distance field). Also exports `HEART` and `SPARK`. |
| `app/layout.jsx` | Fonts (`--font-bodoni`, `--font-jetbrains`) and metadata |
| `app/icon.png`, `app/apple-icon.png` | The favicon, rendered from Bodoni "A." with headless Chrome |

## Things that bite

- **Shader colours mirror the CSS tokens.** `liquid.js` hard-codes paper `0.949, 0.937, 0.914` (= `#f2efe9`) and ink `0.055`. Change them together with `--bg` and `--fg`.
- **The masthead is drawn twice.** Once in the DOM (`.hero__name`, behind the canvas) and once in the shader, from a 2D canvas that copies the h1's computed font, size, letter-spacing and position. Keep the h1 to a single line. Style changes carry over on the next resize.
- **Chrome text depends on `--cream` plus `mix-blend-mode: difference`.** That is what turns it to ink on paper and light on the photo or paint. Don't set those elements to `--fg`.
- **The layering comes from DOM order.** The h1 comes before `<Portrait />` in `page.jsx`, so the cut-out photo paints over it. Don't reorder them.
- **`next dev` writes `AGENTS.md`** into `site/`. Delete it, or set `agentRules: false` in `next.config.mjs`.
- **Headless screenshots get stuck on the preloader.** Either set `sessionStorage.intro-seen = '1'` and reload, or pass `--force-prefers-reduced-motion`. WebGL in headless Chrome needs `--use-angle=swiftshader --enable-unsafe-swiftshader`.

## Conventions

- Match the existing code: small files, comments that explain why rather than what, and no new dependencies for a few lines of code.
- Put new colours on `:root` as tokens. Test layout at 390×844 and 1440×900.
- Commit and push only when asked. Commit messages follow Conventional Commits with the `site` scope, e.g. `feat(site): …`.

Note: Claude Code loads this file only when it reads files under `docs/` (macOS is case-insensitive, so `claude.md` counts as `CLAUDE.md`). To have it loaded in every session started from `site/`, move it to `site/CLAUDE.md`, or import it there with `@docs/claude.md`.
