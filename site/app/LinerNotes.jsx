const GROOVES = [74, 66, 58, 50];

const SIDE_A = [
  { track: 'A1', title: 'Philosophy', desc: 'Subtractive engineering — cut unnecessary abstractions until only raw utility remains.' },
  { track: 'A2', title: 'Execution', desc: 'Working binary over architecture diagrams. Prototype early, test under real load.' },
  { track: 'A3', title: 'Architecture', desc: 'Lean distributed systems, deterministic state machines, and high-concurrency Go services.' },
  { track: 'A4', title: 'Standards', desc: 'Sub-50ms p95 latencies, zero-dependency CLIs, and strict type safety across boundaries.' },
];

const SIDE_B = [
  { track: 'B1', title: 'Primary tools', desc: 'Go, TypeScript, Next.js, Rust/Wasm, PostgreSQL, and custom local AI agents.' },
  { track: 'B2', title: 'Current focus', desc: 'Autonomous enterprise workflows, local AI tools, and trustless web3 contracts.' },
  { track: 'B3', title: 'Working model', desc: 'Deep async focus, direct founder-to-code iteration, zero bureaucracy.' },
  { track: 'B4', title: 'Availability', desc: 'Selected high-impact engineering architecture & venture builds for 2026.' },
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
