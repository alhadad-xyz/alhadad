'use client';

import { useEffect, useRef } from 'react';
import { mountLiquid } from './liquid';
import { paintSheet } from './doodles';

let markReady;
// Settles once the liquid is drawing (or has given up), so the preloader can hold for it.
export const portraitReady = new Promise((r) => (markReady = r));

export default function Portrait() {
  const canvas = useRef(null);
  const img = useRef(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return markReady();
    let cleanup, cancelled = false;
    img.current.decode().then(() => paintSheet(img.current)).then((paint) => {
      if (cancelled) return;
      cleanup = mountLiquid(canvas.current, img.current, paint);
      if (cleanup) canvas.current.parentElement.classList.add('is-gl');
      markReady();
    }).catch(markReady);
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="hero__portrait">
      <img ref={img} className="hero__photo" src="/hero.webp" width="1198" height="1200" alt="Portrait of Alhadad" />
      <canvas ref={canvas} className="hero__canvas" aria-hidden="true" />
    </div>
  );
}
