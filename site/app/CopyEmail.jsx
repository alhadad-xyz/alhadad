'use client';

import { useEffect, useState } from 'react';

// The back-cover email: a click copies the address and a hand-drawn "copied" boils beside it.
// Without JS, or if the clipboard refuses, the link falls back to mailto.
export default function CopyEmail({ address, children }) {
  const [copied, setCopied] = useState(false);
  const [user, domain] = address.split('@');

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = (e) => {
    // Modified clicks keep their browser meaning (new window, mail client).
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(address).then(
      () => setCopied(true),
      () => (location.href = `mailto:${address}`),
    );
  };

  return (
    <div className="back-cover__mail reveal">
      <a className="back-cover__email" href={`mailto:${address}`} onClick={copy} aria-label={`Copy ${address}`}>
        <span>{user}</span><span>@{domain}</span>
      </a>
      <p className="eyebrow back-cover__hint">Click to copy</p>
      {children}
      {copied && (
        <svg className="back-cover__copied" viewBox="0 0 150 60" aria-hidden="true">
          <text x="4" y="38">copied</text>
          <path d="M104 30c5 4 9 10 12 16 6-14 16-28 30-40" />
          <path d="M6 50c30-5 70-6 96-2" />
        </svg>
      )}
      <p className="visually-hidden" role="status">{copied ? 'Email address copied' : ''}</p>
    </div>
  );
}
