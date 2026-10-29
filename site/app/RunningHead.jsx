'use client';

import { useEffect, useRef, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

// The magazine's running header: current chapter and page number once past the cover. Tap it for the index.
export default function RunningHead({ chapters }) {
  const [current, setCurrent] = useState(-1); // -1 = on the cover
  const details = useRef(null);

  useEffect(() => {
    const sections = ['hook', ...chapters.map(([id]) => id)].map((id) => document.getElementById(id));
    // A band across the middle of the viewport: whichever section crosses it is the page being read.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setCurrent(sections.indexOf(e.target) - 1);
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [chapters]);

  const onCover = current < 0;
  useEffect(() => { if (onCover) details.current.open = false; }, [onCover]);

  const close = () => (details.current.open = false);
  const [, title] = chapters[Math.max(current, 0)];

  return (
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
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
