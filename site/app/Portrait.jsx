'use client';

import { useEffect, useRef } from 'react';
import { mountLiquid } from './liquid';
import { loadSheet } from './doodles';

let markReady;
// Settles once the liquid is drawing (or has given up), so the preloader can hold for it.
export const portraitReady = new Promise((r) => (markReady = r));

let markLifted;
// Intro calls liftCurtain() as the preloader starts to leave; until then the liquid is hidden, so it doesn't run.
const curtainLifted = new Promise((r) => (markLifted = r));
export const liftCurtain = () => markLifted();

export default function Portrait() {
  const canvas = useRef(null);
  const img = useRef(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return markReady();
    let cleanup, cancelled = false;
    // Fonts too: the liquid redraws the masthead from its live type.
    Promise.all([loadSheet(), img.current.decode(), document.fonts.ready]).then(([paint]) =>
      !cancelled && mountLiquid(canvas.current, img.current, paint, document.querySelector('.hero__name'), curtainLifted)
    ).then((stop) => {
      cleanup = stop;
      // Unmounted while the setup yielded: undo it.
      if (cancelled) return stop?.();
      if (stop) canvas.current.parentElement.classList.add('is-gl');
      markReady();
    }).catch(markReady);
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="hero__portrait">
      {/* The cover's LCP: AVIF is ~45% smaller than the WebP fallback. */}
      <picture>
        <source srcSet="/hero.avif" type="image/avif" />
        <img ref={img} className="hero__photo" src="/hero.webp" width="1198" height="1200" alt="Portrait of Alhadad" fetchPriority="high" />
      </picture>
      <canvas ref={canvas} className="hero__canvas" aria-hidden="true" />
    </div>
  );
}
