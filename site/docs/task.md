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
- [x] `npm run deploy` (`deploy/deploy.sh`): build, dry run, confirm, sync. *Works, but not committed yet.*
- [x] `agentRules: false` in `next.config.mjs`, so `next dev` no longer writes `AGENTS.md`. *Not committed yet.*
- [x] Deployed to https://alhadad.dev. The latest deploy is 2026-10-29 09:02 GMT and includes the running header.

## Now

1. [ ] **Commit the loose work:** `deploy/deploy.sh`, `package.json`, `next.config.mjs`, and `docs/`.
2. [ ] **Write the real copy:**
   - The hero lead line, which is still "One line that says who you are."
   - Chapters 1, 2 and 4, which are still "Placeholder copy."

   This needs input from Alhadad.
3. [ ] **Project content for chapter 3:** pick 3 to 5 projects. For each, gather a title, role, year, the problem, what was done, the result, and one image.

## Next: finishing the magazine frame

These items are small and finish the frame around the content.

4. [ ] **Back cover (chapter 5, Let's talk):**
   - Set the email address as large as the masthead.
   - Clicking it copies the address, and a hand-drawn "copied ✓" appears that boils like the doodles. Keep the `mailto:` link as a fallback.
   - Add a doodled barcode in the corner with "Issue 001 · V-001", which echoes the preloader.
   - Refs: [Giulia Gartner copy-email footer](https://www.awwwards.com/inspiration/footer-copy-paste-contact-email-giulia-gartner), [Corentin Bernadou footer](https://www.awwwards.com/inspiration/footer-design-corentin-bernadou), [Hallo Basis big type](https://www.awwwards.com/inspiration/big-typography-contact-page-hallobasis-com).

## Next: chapters

5. [ ] **The work as an editorial index (chapter 3).** This is the signature piece. It needs task 3 first.
   - Lay the projects out as a table with the columns No. / Project / Role / Year, set in Bodoni with mono.
   - Hovering a row reveals the project image next to the cursor. The image is drawn through the liquid shader, so it pours in with drips instead of fading in.
   - On phones, rows expand into cards.
   - With reduced motion or no WebGL, show a plain image.
   - Refs: [Thibaud Allie hover reveal](https://www.awwwards.com/inspiration/hover-image-reveal-thibaud-allie-portfolio), [WA Studio archive](https://www.awwwards.com/inspiration/archive-wa-studio), [Crafted image reveal](https://www.awwwards.com/inspiration/image-reveal-hover-crafted).
6. [ ] **Chapter opening pages (chapters 1 and 4).**
   - Each opens with a huge Bodoni chapter number, then the title, then a drop cap on the first paragraph.
   - Add one pull quote per chapter, using difference-blended text like the cover chrome.
   - For chapter 4, set the principles as a short list of headlines.
   - Refs: [Books of Design](https://www.awwwards.com/inspiration/editorial-layout-books-of-design), [Mara](https://www.awwwards.com/inspiration/editorial-layout-mara-3), [storytelling scroll layout](https://www.awwwards.com/inspiration/storytelling-scroll-layout-jesus-is-king).
7. [ ] **Doodles in the margins (all chapters).** Do this together with task 6.
   - Fine-liner notes beside the copy: arrows, circled words, short asides.
   - They draw in on scroll (stroke-dashoffset) and wobble like the hero's lines, reusing the `#boil` filter.
   - Refs: [Its just a portfolio](https://www.awwwards.com/inspiration/freehand-sketches-its-just-a-portfolio), [Mr. Pandas Paper Portfolio](https://www.awwwards.com/sites/mr-pandas-paper-portfolio).
8. [ ] **Turning point: the page flips colors (chapter 2).** This is the biggest effect, so do it last. It needs the chapter 2 copy.
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
11. [ ] **Performance:** Lighthouse on mobile, size of `hero.webp`, font payload (Bodoni variable `opsz`), and the 8s preloader cap.
12. [ ] **Check the favicon at 16px**, since the period may disappear.
13. [ ] **SEO and sharing:**
    - An Open Graph image (the cover).
    - A real `description` to replace "Personal site of Alhadad."
    - `robots.txt` and `sitemap.xml`. Today both URLs return the home page with a 200.
14. [ ] **Real 404s:** Caddy answers unknown paths with the home page and a 200. Serve `404.html` with a 404 status instead (in `deploy/Caddyfile`).

## Dropped

- ~~Active cover line for the chapter in view.~~ The cover lines are visible only on the cover. The running header's index marks the current chapter instead.

## Later

- [ ] Case-study pages per project, if the PRD open question resolves that way.
- [ ] Refresh the issue line each season.
