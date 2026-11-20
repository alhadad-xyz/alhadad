'use client';

import { useRef } from 'react';

// The last thing picked up stays on top of the others.
let top = 2;

// Something taped into the chapter 1 notebook. With a mouse or pen it can be peeled up and moved;
// it stays where it's dropped. Touch keeps scrolling the page.
export default function Taped({ as: Tag = 'figure', className = '', children, ...rest }) {
  const ref = useRef(null);
  const dragged = useRef(false);

  const down = (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragged.current = false;
    const el = ref.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const x0 = e.clientX - (+el.dataset.x || 0);
    const y0 = e.clientY - (+el.dataset.y || 0);
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-lifted');
    el.style.zIndex = ++top;
    const move = (m) => {
      if (Math.hypot(m.clientX - startX, m.clientY - startY) > 4) dragged.current = true;
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

  const onClickCapture = (e) => {
    if (dragged.current) {
      e.preventDefault();
      dragged.current = false;
    }
  };

  return (
    <Tag
      ref={ref}
      {...rest}
      className={`taped ${className}`}
      onPointerDown={down}
      onClickCapture={onClickCapture}
    >
      {children}
    </Tag>
  );
}
