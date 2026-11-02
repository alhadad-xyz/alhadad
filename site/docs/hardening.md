# Hardening plan

Written 2026-11-02. Goal: the site stays readable when something fails (JS, WebGL, audio, network), the server sends safe headers, and a bad build can't reach production unnoticed. No new runtime dependencies.

Findings from the survey that drive this plan:

- **The page can be stuck hidden.** `layout.jsx` puts `is-loading` on `<html>`, and only `Intro.jsx` removes it. If a chunk fails to load or hydration throws, the preloader covers the page forever. `<noscript>` covers only JS that is turned off, not JS that breaks. The 8s cap in `waitForAssets()` runs only once Intro is running.
- **No security headers live.** `curl -sI https://alhadad.dev/` shows no HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or frame protection.
- **WebGL context loss isn't handled.** `liquid.js` has no `webglcontextlost` listener. On a GPU reset (common on iOS when the tab is in the background), the canvas goes blank over the photo.
- **Audio errors aren't handled.** `Player.jsx` has no `error` listener. If the m4a 404s or fails to decode, the caption still shows it as playing.
- **Known flakes, from task.md:** in about 1 in 4 headless loads the chapter steps never ran. A mid-page reload restores to y=3153 instead of 6500.
- **Deploys aren't guarded.** `deploy.sh` builds whatever is in the working tree, with no clean-tree check, no smoke test and no fast rollback.
- `npm audit --omit=dev`: 0 vulnerabilities. Deps are pinned exactly. Not a concern now.

## P0: availability and safety

1. [x] **Preloader failsafe.**
   - Done 2026-11-02. Checked in headless Chrome with the JS chunks returning 404: the preloader shows at 1s, and the page is visible and scrollable at 13.5s. A normal first visit is unchanged.
   - Limit: if `init()` starts and then throws, the timer doesn't help. On a network slow enough that hydration takes over 12s, the page shows under a preloader that is still running.
   - In the inline `<head>` script in `layout.jsx`, start a 12s timer. If `window.__intro` isn't set when it fires, remove `is-loading`, hide `.preloader` and clear `inert` from the rest of the page.
   - `Intro.jsx` sets `window.__intro = 1` as soon as `init()` starts.
   - Files: `app/layout.jsx`, `app/Intro.jsx`.
   - Verify: in headless Chrome, block `/_next/static/chunks/*` and check that the cover shows and is scrollable after about 12s. A normal first visit is unchanged: the gate still shows, with no early reveal.
2. [ ] **Security headers** (the `deploy/Caddyfile` block is done; not yet on the server) in `deploy/Caddyfile`, in a `header` block for `alhadad.dev`:
   - `Strict-Transport-Security "max-age=31536000"` (no `preload` yet; adding it is hard to undo).
   - `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy same-origin`.
   - `Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"`.
   - CSP: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`.
     - shortcut: `'unsafe-inline'` for scripts, because Next's static export writes per-build inline flight scripts. Upgrade to build-time sha256 hashes if the site ever takes user input.
   - 2026-11-02: there is no Caddy on this machine, so the CSP was checked with a Node server sending the same header (Playwright, Chrome, 1440 and 390, first visit through the gate, a full scroll, and the 404 page): no violations or page errors, and the liquid mounts. A stricter `script-src 'self'` fails the same check, so the check itself works.
   - Verify locally first: run `caddy run` with the block against `out/`, load every chapter and the 404 page in headless Chrome, and expect zero CSP console errors (WebGL, audio, `sheet.bin.gz` fetch, fonts).
   - Then on the server: back up `/etc/caddy/Caddyfile`, `caddy validate`, `sudo systemctl reload caddy`, and check the headers with `curl -sI`. Needs a yes before touching the server.
3. [x] **Liquid survives context loss.** Done 2026-11-02: after `loseContext()`, `is-gl` is removed and the photo is visible, with no page errors. In `mountLiquid`, listen for `webglcontextlost`: call `preventDefault()`, stop the rAF loop, and remove `is-gl` from the parent so the `<img>` shows. Don't rebuild on restore (shortcut: the photo is a fine fallback; rebuild only if users notice).
   - Files: `app/liquid.js`, `app/Portrait.jsx` (it owns `is-gl`).
   - Verify: call `WEBGL_lose_context.loseContext()` from the console. The photo shows, and there are no errors.
4. [x] **Audio fails quietly.** Done 2026-11-02: with the m4a returning 404, Play still finishes the intro, and the caption reads "No music", disabled, labelled "Music unavailable". Add an `error` listener on the `<audio>` in `Player.jsx` that sets the caption to paused, or hides it. `startMusic()` must not throw.
   - Verify: rename the m4a in `out/`, click Play, and check that the intro still finishes and the caption isn't stuck on "playing".

## P1: robustness

5. [ ] **Find the "chapter steps never ran" flake.**
   - New lead, 2026-11-02, from the smoke test: in 2 of 10 first-visit runs (at both widths), the pins were built but `is-loading` was still set 20s after the gate click, with no page error. `finishLoading()` runs only in `enter()`'s timeline `onComplete`, so either the click never reached `enter()` or that timeline stalled.
   - It didn't reproduce in 6 instrumented runs at load average ~33. Retry on a quiet machine, and log `gate.disabled` after the click (true means `enter()` ran) and the rAF rate. Debug the root cause before changing code (`superpowers:systematic-debugging`). Suspects: `later()`'s `requestIdleCallback` queue against the Play click's flush, and `matchMedia` context timing.
   - Repro: loop 20 headless loads and count `ScrollTrigger.getAll().length` (expect 3 pins plus the scrubs).
   - Done when: 0 of 50 loads fail.
6. [ ] **Mid-page reload position.** Either set `history.scrollRestoration = 'manual'`, save `scrollY` on `pagehide` and restore it after the deferred `ScrollTrigger.refresh()`, or decide it's acceptable and write that in task.md. Investigate first: it may share a cause with step 5.
7. [ ] **Cross-browser** (task 9): Firefox, a real iPhone (WebGL float targets, context loss from step 3), and Safari 16 (`ctx.letterSpacing` fallback for the masthead redraw).
8. [ ] **Accessibility leftovers** (task 10): a VoiceOver pass, the contrast of difference-blended text over the paint, and a reduced-motion pass across every chapter.

## P2: guardrails

9. [x] **Smoke test:** done 2026-11-02, `npm run smoke` (`scripts/smoke.mjs`, written by the Gemini worker and finished in Opus).
   - Results on the current build: first visit at 1440 (3 pins) and 390 (2 pins), block mode and 404 all pass. Removing the failsafe from `out/index.html` turns block mode into a FAIL, so the check catches a regression.
   - Timing is for software WebGL: the gate arms 10–20s in, so the test waits up to 40s for it, up to 20s after the click for `is-loading` to clear, and 90s per run.
   - A full run takes about 1–3 minutes. Under heavy machine load (load average 20–37) expect a timeout now and then.
   - Original spec: `scripts/smoke.mjs`, built on the same headless Chrome launcher as `bake-sheet.mjs`, with no new dependencies.
   - It serves `out/`, loads `/` at 1440×900 and 390×844 (first visit and with `intro-seen`), and loads `/missing`.
   - It fails on any page error, on a ScrollTrigger count that doesn't match, or on the preloader still showing after the 12s failsafe.
   - Add `"smoke": "node scripts/smoke.mjs"` to `package.json`.
10. [ ] **Guarded deploy** in `deploy/deploy.sh`:
    - Refuse a dirty tree (`git status --porcelain -- .`).
    - Run `npm ci` instead of trusting `node_modules`, then build, then `npm run smoke`.
    - Before the sync, copy the live tree aside on the server: `cp -a /srv/alhadad-site /srv/alhadad-site.prev`. Rollback is one command: swap the two directories.
    - Write the commit hash into `out/version.txt`.
    - After the sync, check that `/` returns 200, `/nope` returns 404, `version.txt` matches the commit, and the security headers are present.
11. [ ] **CI (optional):** a GitHub Action on push that runs `npm ci && npm run build && npm run smoke`. Skip it if deploys stay local only.

## Order

Do steps 1 → 4 first: they are small, independent and user-visible. Then 9, so steps 5 and 6 have a harness to prove the fixes, then 10. Steps 7 and 8 need real devices and a screen reader, so they run alongside. Commit each step on its own (`fix(site): …` / `chore(site): …`). Server changes (step 2, and the first run of step 10) need an explicit yes.

Not planned: Subresource Integrity (all assets are same-origin), rate limiting (static files on Caddy), a CSP report endpoint (no backend), and an ESLint setup (it adds a dependency; `next build` already catches syntax and import errors).
