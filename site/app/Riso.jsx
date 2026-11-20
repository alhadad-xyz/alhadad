'use client';

import { useEffect } from 'react';

export default function Riso() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = null;
    let lastY = window.scrollY;
    let offset = 0;

    const tick = () => {
      const y = window.scrollY;
      const velocity = y - lastY;
      lastY = y;
      const target = Math.max(-8, Math.min(8, velocity * 0.15));
      offset += (target - offset) * 0.2;

      if (Math.abs(offset) < 0.05 && velocity === 0) {
        document.documentElement.style.setProperty('--riso', '0');
        offset = 0;
        rafId = null;
        return;
      }

      document.documentElement.style.setProperty('--riso', offset.toFixed(2));
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
