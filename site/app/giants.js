import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// The interlude between chapters 3 and 4: the section pins and a camera pans a canvas of giant words, down to
// the first row, across it, diagonally to the next. Each row gets a stop at its left and right edge (or one
// centred stop, twice, if it fits), and the camera moves at one constant speed, so one pixel scrolled is one
// pixel travelled. Taped cards and margin notes drift against the pan, and letters rise as the camera finds them.
// Without motion (Intro only calls this under no-preference) the rows simply stack.
export function giants() {
  const section = document.querySelector('.giants');
  const canvas = section.querySelector('.giants__canvas');
  const title = section.querySelector('.giants__title');
  const rows = gsap.utils.toArray('.giants__row', section);
  const drifters = gsap.utils.toArray('.giants__card, .giants__note', section).map((el) => ({
    el,
    // Fraction of the viewport each drifts at the screen edge; notes lag the pan, cards lead it a little.
    pp: el.classList.contains('giants__note') ? -0.03 : 0.012,
    home: 0,
  }));
  const drift = gsap.parseEase('power2.inOut');
  section.classList.add('is-panning');

  // Layout offsets only (offsetLeft/Top ignore the canvas transform), so measuring mid-pan is safe.
  let pts = [];
  let segs = [];
  let total = 1;
  const measure = () => {
    const vw = innerWidth;
    const vh = innerHeight;
    const inset = vw * 0.045;
    pts = [];
    for (const row of rows) {
      const y = vh / 2 - (row.offsetTop + row.offsetHeight / 2);
      const fits = row.offsetWidth <= vw - 2 * inset;
      const a = fits ? vw / 2 - (row.offsetLeft + row.offsetWidth / 2) : inset - row.offsetLeft;
      const b = fits ? a : vw - inset - (row.offsetLeft + row.offsetWidth);
      pts.push({ x: a, y }, { x: b, y });
    }
    // Opens on the cover line, lined up over the first row.
    pts.unshift({ x: pts[0].x, y: vh / 2 - (title.offsetTop + title.offsetHeight / 2) });
    segs = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
    total = segs.reduce((a, b) => a + b, 0) || 1;
    for (const d of drifters) {
      let x = d.el.offsetWidth / 2;
      for (let n = d.el; n && n !== canvas; n = n.offsetParent) x += n.offsetLeft;
      d.home = x;
    }
  };

  // Camera at progress p along the path, by distance, so every segment runs at the same speed.
  const place = (p) => {
    let d = p * total;
    let i = 0;
    while (i < segs.length - 1 && d > segs[i]) d -= segs[i++];
    const t = segs[i] ? Math.min(1, d / segs[i]) : 1;
    const x = pts[i].x + (pts[i + 1].x - pts[i].x) * t;
    const y = pts[i].y + (pts[i + 1].y - pts[i].y) * t;
    gsap.set(canvas, { x, y });
    const vw = innerWidth;
    for (const dr of drifters) {
      const s = gsap.utils.clamp(-1, 1, (x + dr.home - vw / 2) / (0.65 * vw));
      dr.el.style.setProperty('--pdx', `${-dr.pp * vw * Math.sign(s) * drift(Math.abs(s))}px`);
    }
  };

  measure();
  place(0);
  const cam = { p: 0 };
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => (measure(), `+=${Math.round(total)}`),
    pin: true,
    scrub: 0.6,
    invalidateOnRefresh: true,
    onRefresh: () => place(cam.p),
    animation: gsap.to(cam, { p: 1, ease: 'none', onUpdate: () => place(cam.p) }),
  });

  // Each letter, title line, card and note plays its entrance the first time it is on screen. The pin's
  // overflow clips the canvas, and an IntersectionObserver counts that and the pan's transform.
  const chars = SplitText.create(section.querySelectorAll('.giants__part'), { type: 'chars', mask: 'chars', aria: 'none' }).chars;
  const lines = SplitText.create(title.querySelector('h2'), { type: 'lines', mask: 'lines', aria: 'none' }).lines;
  const plays = new Map();
  for (const el of [...chars, ...lines]) {
    plays.set(el.parentElement, gsap.from(el, { yPercent: 110, duration: 1, ease: 'expo.out', delay: gsap.utils.random(0, 0.3), paused: true }));
  }
  for (const card of section.querySelectorAll('.giants__card')) {
    plays.set(card, gsap.from(card, { scale: 0.5, rotation: 18, autoAlpha: 0, duration: 0.9, delay: 0.25, ease: 'back.out(1.6)', paused: true }));
  }
  for (const note of section.querySelectorAll('.giants__note')) {
    plays.set(note, gsap.timeline({ paused: true, delay: 0.4 })
      .from(note.firstChild, { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' })
      // autoRound off: rounding snaps the 1-to-0 draw, as in revealChapters.
      .from(note.querySelectorAll('path'), { strokeDashoffset: 1, autoRound: false, duration: 0.8, ease: 'power2.inOut' }, 0.2));
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      plays.get(e.target).play();
    }
  });
  plays.forEach((_, el) => io.observe(el));

  return () => {
    io.disconnect();
    section.classList.remove('is-panning');
    drifters.forEach(({ el }) => el.style.removeProperty('--pdx'));
    gsap.set(canvas, { clearProps: 'transform' });
  };
}
