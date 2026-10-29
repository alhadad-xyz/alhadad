'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { drips } from './drips';

const pad = (n) => String(n).padStart(2, '0');

// Chapter 3's editorial index: one row per project that opens into a card (image, problem, work, result).
// With a mouse, hovering a row pours its image in beside the cursor, with the preloader's drips.
export default function WorkIndex({ projects }) {
  const list = useRef(null);
  const preview = useRef(null);

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const el = preview.current;
    const path = document.querySelector('#pour path');
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    let pour, shown;

    const move = (e) => (x(e.clientX), y(e.clientY));
    const enter = (e) => {
      const row = e.target.closest('[data-img]');
      // An open row already shows its image in the card.
      if (row?.querySelector('details[open]')) return shown && leave();
      if (!row || row.dataset.img === shown) return;
      shown = row.dataset.img;
      el.src = shown;
      pour?.kill();
      gsap.set(el, { autoAlpha: 1 });
      pour = drips(path, -1, { count: 14, duration: [0.35, 0.6], lag: 0.12 });
    };
    const leave = () => {
      shown = null;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    };

    const ul = list.current;
    ul.addEventListener('pointermove', move);
    ul.addEventListener('pointerover', enter);
    ul.addEventListener('pointerleave', leave);
    ul.addEventListener('toggle', leave, true); // toggle doesn't bubble
    return () => {
      pour?.kill();
      ul.removeEventListener('pointermove', move);
      ul.removeEventListener('pointerover', enter);
      ul.removeEventListener('pointerleave', leave);
      ul.removeEventListener('toggle', leave, true);
    };
  }, []);

  return (
    <>
      <p className="work-index__head" aria-hidden="true">
        <span>No.</span><span>Project</span><span>Role</span><span>Year</span>
      </p>
      <ol ref={list} className="work-index">
        {projects.map((p, i) => (
          <li key={p.title} className="reveal" data-img={p.img}>
            <details>
              <summary>
                <span className="work-index__no">{pad(i + 1)}</span>
                <span className="work-index__title">{p.title}</span>
                <span className="work-index__role">{p.role}</span>
                <span className="work-index__year">{p.year}</span>
              </summary>
              <div className="work-index__card">
                <img src={p.img} width="800" height="600" alt={p.alt} loading="lazy" />
                <dl>
                  <dt>Problem</dt><dd>{p.problem}</dd>
                  <dt>What I did</dt><dd>{p.did}</dd>
                  <dt>Result</dt><dd>{p.result}</dd>
                </dl>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <img ref={preview} className="work-index__preview" alt="" aria-hidden="true" />
      <svg className="svg-defs" aria-hidden="true">
        <clipPath id="pour" clipPathUnits="objectBoundingBox"><path d="M0 0Z" /></clipPath>
      </svg>
    </>
  );
}
