const GROOVES = [74, 66, 58, 50];

const SIDE_A = [
  { track: 'A1', title: 'Type', desc: 'Bodoni Moda for display, JetBrains Mono for chrome.' },
  { track: 'A2', title: 'Paper and ink', desc: '#f2efe9 and #0e0e0e, one accent, #ff5a1f.' },
  { track: 'A3', title: 'Liquid portrait', desc: 'a WebGL2 fluid sim pours paint over the photo and reveals the drawn version.' },
  { track: 'A4', title: 'Line boil', desc: 'the doodles redraw eight times a second, like hand-drawn animation.' },
];

const SIDE_B = [
  { track: 'B1', title: 'The music', desc: 'ADÉLA, “Nicole Kidman”. The kick drum shakes the ink.' },
  { track: 'B2', title: 'Built with', desc: 'Next.js, React and GSAP, exported as static files.' },
  { track: 'B3', title: 'Pressed by', desc: 'Caddy on a small VPS.' },
  { track: 'B4', title: 'Issue 001', desc: 'Autumn 2026. Written, designed and built by Alhadad.' },
];

export default function LinerNotes() {
  return (
    <div className="liner">
      <span className="liner__disc" aria-hidden="true">
        <svg className="liner__spin" viewBox="0 0 220 220">
          {GROOVES.map((r) => <circle key={r} cx="110" cy="110" r={r} />)}
          <circle className="liner__center" cx="110" cy="110" r="40" />
          <path id="liner-a" d="M110 77a33 33 0 1 1 0 66a33 33 0 1 1 0-66" fill="none" />
          <text textLength="207" lengthAdjust="spacing"><textPath href="#liner-a">SIDE A · ALHADAD · ISSUE 001 ·</textPath></text>
        </svg>
      </span>
      <div className="liner__notes">
        <div className="liner__side">
          <h3 className="eyebrow liner__heading">Side A</h3>
          <ol className="liner__list">
            {SIDE_A.map(({ track, title, desc }) => (
              <li key={track} className="liner__item">
                <span className="liner__track" aria-hidden="true">{track}</span>
                <span className="liner__content">
                  <span className="liner__title">{title}</span> — {desc}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="liner__side">
          <h3 className="eyebrow liner__heading">Side B</h3>
          <ol className="liner__list">
            {SIDE_B.map(({ track, title, desc }) => (
              <li key={track} className="liner__item">
                <span className="liner__track" aria-hidden="true">{track}</span>
                <span className="liner__content">
                  <span className="liner__title">{title}</span> — {desc}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
