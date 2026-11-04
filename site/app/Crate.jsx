'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const pad = (n) => String(n).padStart(2, '0');

// Chapter 3 as a record crate: one sleeve per project. Each is a <details>, so it opens from the keyboard
// and without JS; opening it slides the record out and shows the notes. Plain tracklist until crate() runs.
export default function Crate({ projects }) {
  return (
    <div className="crate">
      <ol className="crate__list">
        {projects.map((p, i) => (
          <li key={p.title} className="crate__item reveal">
            <details>
              <summary>
                <span className="crate__sleeve">
                  <img src={p.img} width="800" height="600" alt={p.alt} loading="lazy" />
                  <svg className="crate__disc" viewBox="0 0 220 220" aria-hidden="true">
                    <circle cx="110" cy="110" r="108" />
                    {[96, 86, 76, 66, 56].map((r) => <circle key={r} className="crate__groove" cx="110" cy="110" r={r} />)}
                    <circle className="crate__label" cx="110" cy="110" r="36" />
                    <text x="110" y="114" textAnchor="middle">{pad(i + 1)}</text>
                  </svg>
                </span>
                <span className="crate__meta">
                  <span className="crate__no">{pad(i + 1)}</span>
                  <span className="crate__title">{p.title}</span>
                  <span className="crate__role">{p.role}</span>
                  <span className="crate__year">{p.year}</span>
                </span>
              </summary>
              <dl className="crate__notes">
                <dt>Problem</dt><dd>{p.problem}</dd>
                <dt>What I did</dt><dd>{p.did}</dd>
                <dt>Result</dt><dd>{p.result}</dd>
              </dl>
            </details>
          </li>
        ))}
      </ol>
      <p className="crate__caption" aria-hidden="true">
        <span className="crate__now"></span>
        <span className="crate__count"></span>
      </p>
    </div>
  );
}

// Intro calls this between chapter 2's pin and the chapter reveals, so the triggers below account for its pin.
// From 1024px with a mouse, the section pins and scrolling flips through the sleeves, one snap per project.
export function crate() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px) and (hover: hover)', () => {
    const section = document.querySelector('#work');
    const root = section.querySelector('.crate');
    const items = gsap.utils.toArray('.crate__item', root);
    const details = items.map((li) => li.querySelector('details'));
    const now = root.querySelector('.crate__now');
    const count = root.querySelector('.crate__count');
    const last = items.length - 1;
    let current = -1;

    root.classList.add('is-flipping');

    const place = (p) => {
      items.forEach((li, i) => {
        const d = i - p;
        // Ahead: lean back into the crate. Behind: fall forward toward the reader and fade.
        gsap.set(li, d >= 0
          ? { y: -d * 28, z: -d * 90, rotationX: 0, opacity: gsap.utils.clamp(0, 1, 4 - d) }
          : { y: 0, z: 0, rotationX: d * 80, opacity: gsap.utils.clamp(0, 1, 1 + d * 1.4) });
      });
      const i = Math.round(p);
      if (i === current) return;
      current = i;
      items.forEach((li, j) => li.toggleAttribute('data-current', j === i));
      details.forEach((el, j) => j !== i && (el.open = false));
      const meta = items[i].querySelector('.crate__meta');
      now.textContent = [...meta.children].slice(1).map((el) => el.textContent).join(' · ');
      count.textContent = `/${pad(i + 1)}`;
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${last * 60}%`,
      pin: true,
      scrub: 0.4,
      snap: { snapTo: 1 / last, duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut' },
      onUpdate: (self) => place(self.progress * last),
    });
    place(0);

    // Tabbing to a sleeve further back scrolls the crate to it.
    const focus = (e) => {
      const i = items.findIndex((li) => li.contains(e.target));
      if (i >= 0 && i !== current) st.scroll(st.start + ((st.end - st.start) * i) / last);
    };
    root.addEventListener('focusin', focus);
    ScrollTrigger.sort();

    return () => {
      root.removeEventListener('focusin', focus);
      root.classList.remove('is-flipping');
      items.forEach((li) => li.removeAttribute('data-current'));
    };
  });
}
