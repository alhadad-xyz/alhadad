# Tasks

Last updated: 2026-10-29. See `prd.md` for the why behind each item.

## Done

- [x] Preloader with ring counter, Enter gate, paint pour and drip drain.
- [x] Liquid portrait hero with gravity drips and a painted reveal, with doodles and a crown that boil.
- [x] Magazine cover hero: masthead, issue line, lead and chapter cover lines.
- [x] Light theme (paper and ink), with an inverted painted layer.
- [x] Fonts: Bodoni Moda for display and JetBrains Mono for chrome.
- [x] Masthead behind the portrait, redrawn in the shader so it stays visible inside the paint.
- [x] "A." logo, plus `app/icon.png` and `app/apple-icon.png`.
- [x] Deployed to https://alhadad.dev (latest 2026-10-29 08:31 GMT).

## Now

1. [ ] **Commit the deployed work.** Everything after `94132a8` is live but not in git: theme, fonts, masthead layering, logo, favicon and the shader title. Also decide what to do with the deleted `../prototype/` files.
2. [ ] **Add a deploy script.** Add `npm run deploy` that runs the build, an rsync dry run, a confirmation, then `rsync -a --delete out/ alhadad-vps:/srv/alhadad-site/`. This stops the dry run being skipped by mistake.
3. [ ] **Stop `next dev` writing `AGENTS.md`.** Set `agentRules: false` in `next.config.mjs`, or commit the file once.
4. [ ] **Write the real copy** for the hero lead line and chapters 1, 2 and 4. This needs input from Alhadad.

## Next

5. [ ] **Chapter layouts** in the magazine language:
   - Origin: an opening spread with a drop cap and one large pull quote.
   - Turning point: a full-bleed moment, either an image or one big sentence.
   - The work: "feature stories" with a number, title, problem, what was done, result and an image.
   - What I stand for: a short list of principles set as headlines.
   - Let's talk: a back-cover layout with the email address as the masthead.
6. [ ] **Project content for chapter 3:** pick 3 to 5 projects and gather images and results.
7. [ ] **Navigation after the hero.** The header shows only "A.", so a reader has no way to jump between chapters once past the cover. Options are a small chapter index in the header or a progress indicator.
8. [ ] **Active cover line:** mark the chapter currently in view.

## Quality

9. [ ] **Cross-browser:**
   - Safari 16, which lacks `ctx.letterSpacing`: the masthead redrawn in the paint may be misaligned.
   - iOS WebGL float support.
   - Firefox.
10. [ ] **Accessibility pass:**
    - Contrast of the difference-blended text over the photo and the paint.
    - Keyboard path through the gate and the cover lines.
    - Screen-reader reading order.
11. [ ] **Performance:** Lighthouse on mobile, size of `hero.webp`, font payload (Bodoni variable `opsz`), and the 8s preloader cap.
12. [ ] **Check the favicon at 16px**, since the period may disappear.
13. [ ] **SEO and sharing:** Open Graph image (the cover), a real `description`, `sitemap.xml` and `robots.txt`.

## Later

- [ ] Case-study pages per project, if the PRD open question resolves that way.
- [ ] Refresh the issue line each season.
