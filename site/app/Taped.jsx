'use client';

import { useRef } from 'react';

// Something taped into the chapter 1 notebook. With a mouse or pen it can be peeled up and moved;
// it stays where it's dropped. Touch keeps scrolling the page.
export default function Taped({ as: Tag = 'figure', className = '', children }) {
  const ref = useRef(null);

  const down = (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const el = ref.current;
    const x0 = e.clientX - (+el.dataset.x || 0);
    const y0 = e.clientY - (+el.dataset.y || 0);
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-lifted');
    const move = (m) => {
      el.dataset.x = m.clientX - x0;
      el.dataset.y = m.clientY - y0;
      el.style.translate = `${el.dataset.x}px ${el.dataset.y}px`;
    };
    const up = () => {
      el.classList.remove('is-lifted');
      el.removeEventListener('pointermove', move);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up, { once: true });
    el.addEventListener('pointercancel', up, { once: true });
  };

  return <Tag ref={ref} className={`taped ${className}`} onPointerDown={down}>{children}</Tag>;
}
