'use client';

import { useEffect, useRef, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

// The magazine's running header: current chapter and page number once past the cover. Tap it for the index.
export default function RunningHead({ chapters }) {
  const [current, setCurrent] = useState(-1); // -1 = on the cover
  const [folded, setFolded] = useState(null);
  const details = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dog-ear');
      if (saved) setFolded(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const sections = ['hook', ...chapters.map(([id]) => id)].map((id) => document.getElementById(id));
    // A band across the middle of the viewport: whichever section crosses it is the page being read.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setCurrent(sections.indexOf(e.target) - 1);
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach((s) => s && io.observe(s));

    const onScroll = () => {
      if (window.scrollY < 50) setCurrent(-1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [chapters]);

  const onCover = current < 0;
  useEffect(() => { if (onCover) details.current.open = false; }, [onCover]);

  const close = () => (details.current.open = false);
  const [currentId, title] = chapters[Math.max(current, 0)];
  const isFolded = folded === currentId;
  const toggle = () => {
    const next = isFolded ? null : currentId;
    setFolded(next);
    try {
      if (next) localStorage.setItem('dog-ear', next);
      else localStorage.removeItem('dog-ear');
    } catch {}
  };

  return (
    <>
      <details
        ref={details}
        className="running-head"
        data-hidden={onCover || undefined}
        inert={onCover || undefined}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      >
        <summary aria-label={`Chapter ${current + 1}: ${title}. Open chapter index`}>
          <span className="running-head__title">{pad(current + 1)} — {title}</span>
          <span className="running-head__page">p. {pad(current + 1)} / {pad(chapters.length)}</span>
        </summary>
        <nav aria-label="Chapter index">
          <ol>
            {chapters.map(([id, t], i) => (
              <li key={id}>
                <a href={`#${id}`} onClick={close} aria-current={i === current ? 'page' : undefined}>
                  <span aria-hidden="true">{pad(i + 1)}</span>{t}
                  {id === folded && (
                    <>
                      <span className="dog-ear__mark" aria-hidden="true" />
                      <span className="visually-hidden">, folded</span>
                    </>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
      <button
        type="button"
        className="dog-ear"
        hidden={onCover}
        aria-pressed={isFolded}
        aria-label={`${isFolded ? 'Unfold' : 'Fold'} the corner of chapter ${current + 1}, ${title}`}
        onClick={toggle}
      />
    </>
  );
}
