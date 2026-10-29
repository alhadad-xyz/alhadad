# PRD — alhadad.dev personal site

Last updated: 2026-10-29

## Goal

A personal site that reads like the cover and pages of a magazine about Alhadad. A visitor should know who Alhadad is within a few seconds of the hero, then be able to read the story behind the work and get in touch.

## Audience

- People deciding whether to work with or hire Alhadad: clients, studios, recruiters.
- Peers in design and development, who will judge the craft of the site itself.

## Success criteria

- The hero says who Alhadad is in one line, with no scrolling needed.
- Every chapter can be reached in one click from the hero's cover lines.
- The contact address is reachable from the last chapter, and it works.
- The site works without WebGL and with reduced motion: content and navigation are all there, only the effects drop.
- Lighthouse on mobile: Performance ≥ 90, Accessibility ≥ 95.

## Structure

One page, organised as a magazine issue with six sections.

| # | Section | Anchor | Purpose |
|---|---------|--------|---------|
| 0 | The cover (hero) | `#hook` | Name, one-line positioning, chapter index |
| 1 | Origin | `#origin` | Where it started |
| 2 | Turning point | `#turning-point` | The moment that shaped the work |
| 3 | The work | `#work` | Selected projects: problem, what was done, result |
| 4 | What I stand for | `#values` | How Alhadad works |
| 5 | Let's talk | `#contact` | Email call to action |

## Experience

### Preloader

- A ring counter climbs to 100 while the fonts, images and liquid portrait load. There is a hard 8s cap.
- An Enter gate follows the counter. Clicking it pours paint onto the hero and drains the panel off the page in drips.
- It runs once per session (`sessionStorage` key `intro-seen`). Adding `?intro` to the URL replays it.
- With reduced motion, the gate is skipped and the preloader simply fades out.

### Hero: magazine cover

- Masthead "ALHADAD" in Bodoni Moda, set behind the cut-out portrait.
- Issue line in the top right: "Issue 001 — Autumn 2026".
- Lead line on the right, in large italic.
- Cover lines on the left: the five chapters, each linking to its section.
- Bottom row: "Chapter 0 — The cover" on the left and "Move to pour" on the right. The right-hand hint shows only on hover devices.
- Liquid portrait (WebGL2):
  - The cursor pours paint that drips under gravity.
  - The paint reveals an inverted painted version: ink paper, light contour rings and cream doodles.
  - The masthead is redrawn inside the paint, difference-blended, so it stays legible.
  - When the cursor is idle, the paint moves on its own in a figure-eight.

### Chapters

- Today each chapter is a placeholder: eyebrow, heading and copy, revealed on scroll.
- The chapters still need their own magazine-style layouts (see `task.md`).

## Visual system

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#f2efe9` | Paper (page background) |
| `--fg` | `#0e0e0e` | Ink (text) |
| `--cream` | `#ede4dd` | Chrome under `mix-blend-mode: difference`: it reads as ink on paper and as light on the photo or paint |
| `--muted` | `#8a867f` | Secondary text |
| `--accent` | `#ff5a1f` | Focus rings, selection, the contact CTA |

- Display type is Bodoni Moda (variable, with `opsz`), used for the masthead, lead, cover lines and headings.
- Chrome type is JetBrains Mono, used for the preloader, issue line, eyebrows and numbers.
- Body type is the system UI font.
- The logo is "A." in bold Bodoni. The favicon is a cream "A." on an ink rounded square.

## Tech

- Next.js 16 with `output: 'export'`, so the build is static HTML in `out/`.
- React 19, and GSAP 3.13 with ScrollTrigger and SplitText.
- WebGL2 for the liquid effect. It needs `EXT_color_buffer_float`; without it, the `<img>` stays as the fallback.
- Hosting is Caddy on `alhadad-vps`, serving `/srv/alhadad-site`. See `deploy/Caddyfile`.

## Non-goals (for now)

- A CMS, a blog, or more than one page.
- A dark-mode toggle. The site is paper and ink only.
- Translations.

## Open questions

- The real lead line for the hero, which says who Alhadad is.
- The copy for chapters 1, 2 and 4.
- Which projects go in chapter 3, and whether each gets a case-study page or stays a single entry.
- Whether to keep the issue line ("Issue 001 — Autumn 2026") and update it with each refresh, or drop it.
