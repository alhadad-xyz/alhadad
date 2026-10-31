# Tasks

Last updated: 2026-10-29 (statuses checked against the code and the live site). See `prd.md` for the why behind each item.

## Done

- [x] Preloader with ring counter, Enter gate, paint pour and drip drain.
- [x] Liquid portrait hero with gravity drips and a painted reveal, with doodles and a crown that boil.
- [x] Magazine cover hero: masthead, issue line, lead and chapter cover lines.
- [x] Light theme (paper and ink), with an inverted painted layer.
- [x] Fonts: Bodoni Moda for display and JetBrains Mono for chrome.
- [x] Masthead behind the portrait, redrawn in the shader so it stays visible inside the paint.
- [x] "A." logo, plus `app/icon.png` and `app/apple-icon.png`.
- [x] Committed the deployed work in `e28e907`. `../prototype/` is kept.
- [x] Running header past the cover (`app/RunningHead.jsx`, commit `174923d`). It shows the current chapter and page number, opens the chapter index on tap, and marks the current chapter with `aria-current`.
- [x] `npm run deploy` (`deploy/deploy.sh`): build, dry run, confirm, sync. Committed in `4465783`.
- [x] `agentRules: false` in `next.config.mjs`, so `next dev` no longer writes `AGENTS.md`. Committed in `4465783`.
- [x] Deployed to https://alhadad.dev. The latest deploy is 2026-10-30 19:08 GMT (`0877fc1`). It adds the record crate, the notebook origin, the wheat-paste manifesto and the skipping-record 404 (tasks 22 to 25), still with placeholder content.

## Now

1. [x] **Commit the chapter work** (`4e91c99`), which is live but not in git: `CopyEmail.jsx`, `WorkIndex.jsx`, `drips.js`, `public/work/`, and the changes to `Intro.jsx`, `page.jsx`, `globals.css` and `docs/`.
2. [ ] **Write the real copy:**
   - The hero lead line, which is still "One line that says who you are."
   - Chapters 1, 2 and 4, which are still "Placeholder copy."

   This needs input from Alhadad.
3. [ ] **Project content for chapter 3:** pick 3 to 5 projects. For each, gather a title, role, year, the problem, what was done, the result, and one image.

## Next: finishing the magazine frame

These items are small and finish the frame around the content.

4. [x] **Back cover (chapter 5, Let's talk):** done in `app/CopyEmail.jsx` and the `#contact` section. The barcode and "copied" use their own looping `#boil-loop` filter, because the preloader's `#boil` stops once the intro ends.
   - Set the email address as large as the masthead.
   - Clicking it copies the address, and a hand-drawn "copied ✓" appears that boils like the doodles. Keep the `mailto:` link as a fallback.
   - Add a doodled barcode in the corner with "Issue 001 · V-001", which echoes the preloader.
   - Refs: [Giulia Gartner copy-email footer](https://www.awwwards.com/inspiration/footer-copy-paste-contact-email-giulia-gartner), [Corentin Bernadou footer](https://www.awwwards.com/inspiration/footer-design-corentin-bernadou), [Hallo Basis big type](https://www.awwwards.com/inspiration/big-typography-contact-page-hallobasis-com).

## Next: chapters

5. [x] **The work as an editorial index (chapter 3).** Replaced by the record crate (task 22). Built in `app/WorkIndex.jsx` with dummy `PROJECTS` in `page.jsx` and placeholder images in `public/work/`; swap in the real ones from task 3. The hover image pours in through the preloader's drip clip-path (`app/drips.js`) instead of the liquid shader: same drips, far lighter.
   - Lay the projects out as a table with the columns No. / Project / Role / Year, set in Bodoni with mono.
   - Hovering a row reveals the project image next to the cursor, pouring in with drips (a clip-path, not the liquid shader).
   - On phones, and from the keyboard, rows open into cards.
   - Without hover, or with reduced motion, there's no preview; the image shows in the open card.
   - Refs: [Thibaud Allie hover reveal](https://www.awwwards.com/inspiration/hover-image-reveal-thibaud-allie-portfolio), [WA Studio archive](https://www.awwwards.com/inspiration/archive-wa-studio), [Crafted image reveal](https://www.awwwards.com/inspiration/image-reveal-hover-crafted).
6. [x] **Chapter opening pages (chapters 1 and 4).** Layout done (`.opener` in `page.jsx` and `globals.css`) with placeholder copy; the pull quotes wait on task 2.
   - Each opens with a huge Bodoni chapter number, then the title, then a drop cap on the first paragraph.
   - Add one pull quote per chapter, using difference-blended text like the cover chrome.
   - For chapter 4, set the principles as a short list of headlines.
   - Refs: [Books of Design](https://www.awwwards.com/inspiration/editorial-layout-books-of-design), [Mara](https://www.awwwards.com/inspiration/editorial-layout-mara-3), [storytelling scroll layout](https://www.awwwards.com/inspiration/storytelling-scroll-layout-jesus-is-king).
7. [x] **Doodles in the margins (all chapters).** `Doodle` and `Note` in `page.jsx`, drawn in by `revealChapters()` in `Intro.jsx`. Notes show from 900px up. Rewrite the asides once the real copy lands.
   - Fine-liner notes beside the copy: arrows, circled words, short asides.
   - They draw in on scroll (stroke-dashoffset) and wobble like the hero's lines, reusing the `#boil-loop` filter (the preloader's `#boil` stops after the intro).
   - Refs: [Its just a portfolio](https://www.awwwards.com/inspiration/freehand-sketches-its-just-a-portfolio), [Mr. Pandas Paper Portfolio](https://www.awwwards.com/sites/mr-pandas-paper-portfolio).
8. [x] **Turning point: the page flips colors (chapter 2).** `turningPoint()` in `Intro.jsx`: ink pours down with `drips()` scrubbed by scroll, then the section pins while the sentence lights up. The sentence is placeholder until task 2.
   - Scrolling in pours paint down until it covers the screen, and the chapter is set in ink.
   - One big sentence then lights up word by word as you scroll.
   - Reuse the pour and drain from the preloader.
   - With reduced motion, simply switch the colors.

## Quality

9. [ ] **Cross-browser:**
   - Safari 16, which lacks `ctx.letterSpacing`: the masthead redrawn in the paint may be misaligned.
   - iOS WebGL float support.
   - Firefox.
10. [ ] **Accessibility pass:**
    - Contrast of the difference-blended text over the photo and the paint.
    - Keyboard path through the gate, the cover lines and the running header.
    - Screen-reader reading order.
    - 2026-10-29: Lighthouse a11y 91 → 95–96. `--muted` darkened to `#6e6a63` (3.2 → 4.7:1), SplitText uses `aria: "none"` (its default put `aria-label` on `<p>`s), wordmark label is "A. Alhadad". Still flagged: the chapter 2 words at 0.15 opacity before they light up (intentional).
    - 2026-10-30 keyboard pass (headless Chrome): the gate takes focus once armed, Enter opens the site, then Tab runs cover lines → work rows → email, all with the accent focus ring. Fixed: Tab during the counter reached the page behind the curtain; `Intro.jsx` now keeps everything but `.preloader` `inert` until `finishLoading()`.
    - 2026-10-30 screen-reader order (Chrome accessibility tree): it matches the visual order, with one h1 and an h2 per chapter. Fixed: the cover lines and the chapter index read their number twice ("1. 01Origin"), because they're `<ol>`s; the visible number is now `aria-hidden`.
    - Not done: a real screen reader (VoiceOver), and the contrast of difference-blended text over the paint.
11. [x] **Performance:** Lighthouse on mobile, size of `hero.webp`, font payload (Bodoni variable `opsz`), and the 8s preloader cap.
    - 2026-10-29, local build, Lighthouse 12 mobile, real GPU: perf 53–67 → 69–91 (noisy), TBT 1.4–4.9 s → 0.17–0.4 s. `paintSheet()` was one ~620 ms task at 4× throttle; it now yields between steps and every 100 rows of the distance passes.
    - LCP was ~3.3 s: the preloader in the HTML hid the hero until JS ran, even on return visits. Now an inline `<head>` script in `layout.jsx` drops `is-loading` before first paint when `intro-seen` is set, and return visits skip the `hook()` entrance. First run gave LCP 2.1 s; not re-measured cleanly (machine load ~230). First visits are unchanged.
    - Swiftshader (software WebGL) runs score far lower (27–47); use a real GPU when measuring.
    - 2026-10-31 audit, first visit, live site, Lighthouse 12.8 mobile, headless: perf 63 and 72, TBT 1.96 s and 1.02 s, LCP 3.4 s and 3.1 s, CLS 0, 461 KiB transferred. LCP is the hero `<img>` under the curtain, and 48% of it is render delay: the image is in, but the main thread is busy.
    - Where the main thread goes, from a CPU profile of a sourcemapped build at 4× throttle:
      - One 452 ms task for hydration plus the effects. `Intro` `init()` builds every chapter's SplitText and ScrollTrigger pins up front (~160 ms plus ~170 ms of forced style and layout). `Crate`, `LinerNotes` and `Taped` add ~85 ms.
      - `paintSheet()`: ~450 ms in total. `distance()` takes 248 ms, the `getImageData` passes 162 ms, and the SVG decodes ~80 ms. One step is still a 217 ms task.
      - The `hero.webp` decode is a 123 ms task (1198×1200 on every viewport).
      - The liquid's rAF loop runs behind the opaque preloader. The IntersectionObserver can't see occlusion. 699 ms of animation frames ran in 7 s.
      - Paint, layerize and commit: ~2.1 s in 7 s. Sources: the `#boil` re-seed every 125 ms, the liquid canvas, and `#boil-loop` on the always-visible `.player__bars`.
    - No `Cache-Control` on anything. Hashed `/_next/static/*` files are re-validated on every visit.
    - Fonts: three preloads (137 KiB) race the hero image. JS is 190 KiB gz; React and the Next runtime are 123 KiB of it.
    - Plan, in order. Target: perf ≥ 90, TBT < 300 ms, LCP < 2.5 s. Take the median of 5 headed runs on a real GPU.
      1. [x] **Cache headers** in `deploy/Caddyfile`. `/_next/static/*` gets `public, max-age=31536000, immutable`; everything else gets `no-cache` and keeps its ETag. Not yet applied to the server: needs a backup, `caddy validate` and a reload.
      2. [x] **Liquid idles behind the curtain.** `mountLiquid` takes a promise, which `liftCurtain()` in `Portrait.jsx` settles. Intro calls it at the Play click, before the pour, and in `finishLoading()`.
      3. [x] **Defer the below-the-fold timelines.** `init()` builds only the preloader and `coverTurn()` at load. `turningPoint()`, `crate()`, `revealChapters()` and `pasteUp()` follow in page order, then one `ScrollTrigger.refresh()`. First visit: at `arm()`, while the curtain still covers everything. Return visit: `requestIdleCallback`, with a timeout.
      4. [x] **Bake the paint sheet at build time.** `paintSheet()` is deterministic: a fixed photo, two fixed SVGs and a 1320×600 canvas. Write it once to a PNG in `public/`, and upload that straight to the textures.
         - The distance field needs up to 2048 at half-float precision. Split it across two 8-bit channels, or check whether 8-bit quantised looks the same.
         - Turn off premultiply and colour-space conversion on the upload.
         - Side effect: the "alhadad." scribble becomes Marker Felt on every platform, where today each platform uses its own `cursive` fallback.
      5. [x] **Hero image.** `fetchPriority="high"` on the `<img>`, plus `public/hero.avif` (`avifenc -q 60`): 52 KB against the WebP's 92 KB, and it looks the same. No phone variant: phones show the photo ~760 CSS px wide at DPR 1.75, which is already more pixels than the 1198 px source.
      6. [x] **Fonts.** No change needed: all three preloaded faces show on the first screen. The preloader mark is Bodoni italic, the record label is mono and the h1 is Bodoni.
    - 2026-10-31, done. Notes on how it was built:
      - Step 3: `later()` in `Intro.jsx` builds each step in its own idle task (`requestIdleCallback`, 500 ms timeout) inside the matchMedia context, then runs one `ScrollTrigger.refresh()`. The Play click's timeline builds anything still queued before the curtain lifts.
      - Step 4: `npm run bake` (`scripts/bake-sheet.mjs`) runs `paintSheet()` in headless Chrome. It writes `public/sheet.bin.gz`: distances as int16 steps of 1/32 texel from the texel before, then ink and glow bytes, 68 KB gzipped. Half floats would have been 188 KB. `loadSheet()` decodes it; the shader reads ink and glow from `.rg`.
      - Check, headless Chrome at 1440×900: the pour shows paint, return visits run the liquid, and there are no page errors. Pins (3), page height (9287) and the chapter 2 split (14 words) match the old build.
      - Measured locally at 4× CPU, first visit, with the machine at load ~40–60 (noisy). Estimated TBT: old build 662, 1763 and 891 ms (median 891); new build 1100, 199, 312, 275 and 289 ms (median 289).
      - Deployed 2026-10-31, and the cache headers were applied on the server (backup: `/etc/caddy/Caddyfile.bak-20261031101412`). Live Lighthouse 12.8, mobile, headless, 3 runs at machine load ~17–40: perf 69, 86 and 78 (was 63 and 72); TBT 2.33 s, 0.35 s and 0.91 s; LCP 2.3 s, 2.9 s and 2.0 s (was 3.4 s and 3.1 s). Weight 486 KiB: the sheet adds 68 KB, and AVIF saves 40 KB.
      - Still short of 90. The remaining long tasks are React hydration (`3wbm…` chunk, up to ~780 ms) and the app/GSAP chunk (~160–400 ms). Next suspect: `mountLiquid` (shader compiles, photo upload and mipmaps) running in a single task. Profile it before changing anything.
    - 2026-10-31, second pass, from a sourcemapped CPU profile (4×, GPU path). Long tasks in our code were: `mountLiquid` at 144 ms, the deferred chapter steps at 61–99 ms (each play-once ScrollTrigger measures layout as it's built), and the extra `ScrollTrigger.refresh()` at 69 ms.
      - Play-once reveals (`revealChapters()` and the sheets' slap in `pasteUp()`) now use `playAt()`, an IntersectionObserver on the same line ("top 70%" and "top 85%"). The scrubbed plate and the pins stay on ScrollTrigger.
      - Dropped the extra refresh.
      - `mountLiquid` is async and yields between the shader programs, the photo upload, the sheet textures and the rest.
      - Check: on both the old and new builds, after a full scroll every reveal shows except one crate sleeve the crate itself fades out. Reloading mid-page restores the same way on both, at y=3153 instead of 6500 (pre-existing). The liquid on first and return visits is fine.
      - Local estimated TBT at load ~7–20: previous build 264, 223, 250 and 240 ms; new build 185, 154, 148 and 111 ms. The 3 long tasks left are the Next bootstrap, React hydration and the effects pass: framework cost.
      - Deployed 2026-10-31. Live Lighthouse 12.8, mobile, headless, machine load ~12–17: perf 95, 96, 96 and 92; TBT 180, 140, 100 and 150 ms; LCP 2.6, 2.6, 2.6 and 3.0 s (the hero photo). Three earlier runs during a load spike gave 80, 38 and 79, and named the preloader disc's text as LCP. Real Chrome's own LCP entries put the photo at 328–396 ms (was 452–1012 ms).
    - Not planned: dropping React or Next for a static page (a rewrite). `#boil-loop` on the player bars stays, unless a trace shows it in INP.
12. [x] **Check the favicon at 16px.** The period survives at about 2px; no change needed.
13. [x] **SEO and sharing:** `app/opengraph-image.jpg` (the cover, shot with reduced motion so the paint is off), `app/robots.js`, `app/sitemap.js`, and a drafted description in `layout.jsx`. Re-shoot the image and rewrite the description once the hero line is real (task 2).
    - An Open Graph image (the cover).
    - A real `description` to replace "Personal site of Alhadad."
    - `robots.txt` and `sitemap.xml`. Today both URLs return the home page with a 200.
14. [x] **Real 404s:** `app/not-found.jsx` plus `handle_errors` in `deploy/Caddyfile`, applied on the server 2026-10-29 (backup: `/etc/caddy/Caddyfile.bak-20261029171906`). `/nope` now returns 404.

## In progress: every chapter its own format

Brainstormed 2026-10-31. Today chapters 1 and 4 share the `.opener` layout, and chapter 3 is the common hover list. The goal is for each chapter to borrow a different printed or music object, all within the paper, ink and doodle system. Chapters 0, 2 and 5 already have their own formats and stay as they are.

| # | Chapter | Format | Status |
|---|---------|--------|--------|
| 1 | Origin | Junior-high notebook page: ruled paper, a taped polaroid of the first game and a sticky note, both draggable | Done (task 23) |
| 3 | The work | Record crate: flip through the projects as sleeves, then pull the record out to read its notes | Done (task 22) |
| 4 | What I stand for | Wheat-paste manifesto poster: risograph layers out of register that line up as each principle is pasted on | Done (task 24) |
| 5 | Let's talk | Optional: a tear-off reply card that opens the email | Idea |
| — | 404 | A skipping record, "Out of print" | Done (task 25) |

Research refs: [Mr. Pandas Paper Portfolio](https://www.awwwards.com/sites/mr-pandas-paper-portfolio), [Polaroid I-2](https://www.awwwards.com/inspiration/photo-gallery-polaroid-i-2), [Skizophonic albums](https://www.awwwards.com/inspiration/albums-skizophonic), [Vinyl artwork gallery, Meinhard Taxer](https://www.awwwards.com/inspiration/vinyl-artwork-gallery-meinhard-taxer), [Mad Manifiesto List](https://www.awwwards.com/inspiration/mad-manifiesto-list), [Help Humans manifesto](https://www.awwwards.com/inspiration/manifesto-help-humans).

22. [x] **The work as a record crate (chapter 3).** `app/Crate.jsx` replaces `app/WorkIndex.jsx`.
    - From 1024px wide, with motion allowed: the section pins and scrolling flips through the sleeves, snapping one per project. The sleeve in front stands upright, the ones still to come lean back behind it, and each flipped sleeve falls forward and fades. A caption in the bottom left shows the title, role and year, with a large Bodoni `/01` counter in the bottom right.
    - Opening a sleeve (click, Enter or Space; it's still a `<details>`) slides the record out to the right, and the problem, what I did and the result appear beside it as liner notes. Flipping to another sleeve closes it.
    - Tabbing to a sleeve that's further back scrolls the crate to it.
    - On phones, without hover, or with reduced motion: no pin. It's a plain tracklist of small sleeves that open into the notes.
    - REA recon, 2026-10-31: captured meinhardtaxer.com's album world with a headless scenario. It's a sticky scroll section in which the centre cover sits flat and its neighbours tilt in 3D, with the caption bottom left and a `/01` counter bottom right. Its page transition is a clip-path `inset()` curtain, 0.55s, `cubic-bezier(0.7, 0, 0.18, 1)`. The main module that drives the album world wasn't retained, so its exact motion is unknown. jams.basicagency.com showed only a bot check. Nothing was copied: the crate is our own code, built from the observed layout.
    - Verified 2026-10-31 in headless Chrome: 1440×900 and 1280×800 (stack, PageDown snaps to the next sleeve, a click pulls the record out beside the notes) and 390×844 (tracklist opens into the notes). No page errors.
    - Still to do: real sleeve art from task 3 (the placeholders are 4:3 and get cropped to square), and a check in Safari, where `preserve-3d` sorts depth differently.

23. [x] **Origin as a notebook page (chapter 1).** `.notebook` in `page.jsx` and `globals.css`, with `app/Taped.jsx`.
    - The section is ruled paper with a red margin line. Line boxes and gaps are multiples of `--rule`, so the copy sits on the lines.
    - A polaroid of the first game (a pixel scene in inline SVG) and the pull quote as a sticky note are taped in. With a mouse or pen, either can be peeled up and dragged; touch keeps scrolling.
    - Cut for now: the first game playable for a few seconds.
24. [x] **Values as a wheat-pasted manifesto (chapter 4).** `.manifesto` in `page.jsx` and `globals.css`, plus `pasteUp()` in `Intro.jsx`.
    - Each principle is a riso sheet pasted at a slight angle, overlapping its neighbour from 900px up. Each slaps on as it enters, and its accent plate (`--plate`, a text-shadow) is scrubbed from 10px off register to 0 as the sheet rises.
    - The pull quote becomes a large italic slogan below the wall. Without motion the sheets are simply in register.
25. [x] **404 as a skipping record.** `app/not-found.jsx`: the record turns 70°, jumps back at the scratch, and repeats, while the headline repeats "Not in this— not in this— not in this issue." Screen readers get the plain line. It holds still with reduced motion.
    - Verified 2026-10-31 in headless Chrome at 1440×900 and 390×844, with no page errors.
    - Not done: the optional chapter 5 tear-off reply card.

## Next version: Issue 002

Brainstormed 2026-10-29. The content in tasks 2 and 3 comes first: without it the new features have nothing to show. Close the quality tasks (9 to 11) before adding pages.

Order: tasks 2 and 3, then 15, then 16. Tasks 17 and 20 are small extras that can ship alongside.

15. [ ] **Case-study pages as magazine features** (`/work/[slug]`). This resolves the PRD's open question on case studies.
    - Each project opens with a feature spread: a huge title and a standfirst, then image and text spreads.
    - The work index row pours into the feature page with `drips()`.
    - Static export: generate the pages with `generateStaticParams` from `PROJECTS`.
    - Needs the real projects from task 3.
16. [ ] **Print edition.** A `@media print` stylesheet that turns the site into a printable magazine that doubles as a CV.
    - Each chapter starts on a new page, and the back cover becomes the contact page.
    - Drop the preloader, the running header and the WebGL canvas; print the plain portrait.
17. [ ] **Colophon.** A small page at the back for peers: the fonts, the stack, how the liquid shader works, and the issue credits.
18. [ ] **Back issues.** Freeze each version at `/issues/001`, `/issues/002` and so on, and add a "Back issues" link on the cover.
    - Build a git tag into a subfolder of the static export.
    - This replaces "Refresh the issue line each season" from Later.
19. [ ] **Seasonal cover.** Each issue changes the accent colour, the cover photo, the doodle set and the lead line. The liquid and the layout stay the same. Pairs with task 18.
20. [ ] **Real barcode.** Make the back-cover barcode encode `alhadad.dev` as Code 128, so it scans.
21. [ ] **Keyboard reading.** `J`/`K` (or `←`/`→`) jump between chapters, and the running header shows the hint. This also helps task 10.

Skipped for Issue 002:

- Guestbook, reader letters and a "subscribe to the next issue" newsletter. All need a backend, and the site is static. Revisit with a form service.
- A blog or notes column. It's a non-goal in the PRD.
- A page-turn scroll hijack between chapters. It fights native scroll and the accessibility goals.
- The liquid shader on every image. It costs too much against the Lighthouse ≥ 90 target.

## Dropped

- ~~Active cover line for the chapter in view.~~ The cover lines are visible only on the cover. The running header's index marks the current chapter instead.

