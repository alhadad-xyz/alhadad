# Working on site/ (notes for Claude)

The personal site at https://alhadad.dev. Product intent is in `prd.md`; open work is in `task.md`.

## Commands

```bash
npm run dev -- -p 3123   # port 3000 on this machine is taken by Gotenberg
npm run build            # static export to out/
```

## Deploy

Deploy only when asked. Run `npm run deploy` from `site/`. `deploy/deploy.sh` builds, lists what the sync would delete (expect only old build hashes), asks for a `y`, then syncs and prints the live Last-Modified.

Caddy serves `/srv/alhadad-site`, and its config lives in `deploy/Caddyfile`. The SSH alias `alhadad-vps` points at 103.150.92.93 as user `khalid`.

## Map

| File | What it owns |
|------|--------------|
| `app/page.jsx` | All markup: preloader, hero cover and chapters. `CHAPTERS` drives the cover lines. `Doodle`/`Note` draw the margin doodles; `#boil-loop` lives in `.svg-defs`. |
| `app/globals.css` | Tokens on `:root`, the preloader, the hero cover and the chapters |
| `app/RunningHead.jsx` | Running header past the cover: scroll observer for the current chapter, `<details>` chapter index |
| `app/CopyEmail.jsx` | Back-cover email: click copies, hand-drawn "copied" boils, `mailto:` fallback |
| `app/WorkIndex.jsx` | Chapter 3 project index: rows open into cards; hover pours the image in beside the cursor |
| `app/drips.js` | `drips()`: the strand-y clip-path edge shared by the preloader drain, the work hover and the chapter 2 pour |
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
- **A note inside a `.pull` is blended with it.** The pull quote is cream + `difference`, so its note must be cream too, or it disappears.
- **Doodles must not use `vector-effect: non-scaling-stroke`.** With `pathLength` and a stretched viewBox, Chrome then draws only part of the dash. Their stroke width is in viewBox units instead.
- **Chapter 2 pins.** `turningPoint()` must run before `revealChapters()` so later triggers account for the pin spacing, and `.flip` keeps a paper background so its difference-blended text stays right while pinned.
- **The layering comes from DOM order.** The h1 comes before `<Portrait />` in `page.jsx`, so the cut-out photo paints over it. Don't reorder them.
- **Headless screenshots get stuck on the preloader.** Set `sessionStorage.intro-seen = '1'` and reload (`--force-prefers-reduced-motion` alone doesn't skip it). WebGL in headless Chrome needs `--use-angle=swiftshader --enable-unsafe-swiftshader`.

## Conventions

- Match the existing code: small files, comments that explain why rather than what, and no new dependencies for a few lines of code.
- Put new colours on `:root` as tokens. Test layout at 390×844 and 1440×900.
- Commit and push only when asked. Commit messages follow Conventional Commits with the `site` scope, e.g. `feat(site): …`.

Note: Claude Code loads this file only when it reads files under `docs/` (macOS is case-insensitive, so `claude.md` counts as `CLAUDE.md`). To have it loaded in every session started from `site/`, move it to `site/CLAUDE.md`, or import it there with `@docs/claude.md`.
