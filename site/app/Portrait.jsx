'use client';

import { useEffect, useRef } from 'react';
import { mountLiquid } from './liquid';

export default function Portrait() {
  const canvas = useRef(null);
  const img = useRef(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cleanup, cancelled = false;
    img.current.decode().then(() => {
      if (cancelled) return;
      cleanup = mountLiquid(canvas.current, img.current);
      if (cleanup) canvas.current.parentElement.classList.add('is-gl');
    }).catch(() => {});
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
