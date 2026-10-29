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
- [x] Deployed to https://alhadad.dev. The latest deploy is 2026-10-29 10:18 GMT and includes every chapter layout (placeholder content), the share image, robots.txt and sitemap.xml.

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

5. [x] **The work as an editorial index (chapter 3).** Built in `app/WorkIndex.jsx` with dummy `PROJECTS` in `page.jsx` and placeholder images in `public/work/`; swap in the real ones from task 3. The hover image pours in through the preloader's drip clip-path (`app/drips.js`) instead of the liquid shader: same drips, far lighter.
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
11. [ ] **Performance:** Lighthouse on mobile, size of `hero.webp`, font payload (Bodoni variable `opsz`), and the 8s preloader cap.
    - 2026-10-29, local build, Lighthouse 12 mobile, real GPU: perf 53–67 → 69–91 (noisy), TBT 1.4–4.9 s → 0.17–0.4 s. `paintSheet()` was one ~620 ms task at 4× throttle; it now yields between steps and every 100 rows of the distance passes.
    - LCP was ~3.3 s: the preloader in the HTML hid the hero until JS ran, even on return visits. Now an inline `<head>` script in `layout.jsx` drops `is-loading` before first paint when `intro-seen` is set, and return visits skip the `hook()` entrance. First run gave LCP 2.1 s; not re-measured cleanly (machine load ~230). First visits are unchanged.
    - Swiftshader (software WebGL) runs score far lower (27–47); use a real GPU when measuring.
12. [x] **Check the favicon at 16px.** The period survives at about 2px; no change needed.
13. [x] **SEO and sharing:** `app/opengraph-image.jpg` (the cover, shot with reduced motion so the paint is off), `app/robots.js`, `app/sitemap.js`, and a drafted description in `layout.jsx`. Re-shoot the image and rewrite the description once the hero line is real (task 2).
    - An Open Graph image (the cover).
    - A real `description` to replace "Personal site of Alhadad."
    - `robots.txt` and `sitemap.xml`. Today both URLs return the home page with a 200.
14. [x] **Real 404s:** `app/not-found.jsx` plus `handle_errors` in `deploy/Caddyfile`, applied on the server 2026-10-29 (backup: `/etc/caddy/Caddyfile.bak-20261029171906`). `/nope` now returns 404.

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

