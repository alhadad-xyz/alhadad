import Intro from './Intro';
import Portrait from './Portrait';
import RunningHead from './RunningHead';
import { HEART, SPARK } from './doodles';

// Cover lines on the hero and the running header's index, one per chapter section below.
const CHAPTERS = [
  ['origin', 'Origin'],
  ['turning-point', 'Turning point'],
  ['work', 'The work'],
  ['values', 'What I stand for'],
  ['contact', 'Let’s talk'],
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#hook" aria-label="Alhadad">A.</a>
      </header>
      <RunningHead chapters={CHAPTERS} />

      <div className="preloader">
        <div className="preloader__panel"></div>
        {/* Line boil for the ring, mark and doodles (Intro re-seeds it 8 times a second like the hero's drawing),
            and the drain mask Intro redraws as the panel falls off the hero. */}
        <svg className="preloader__defs" aria-hidden="true">
          <filter id="boil" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="0" />
            <feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id="drain" clipPathUnits="objectBoundingBox"><path d="M0 0H1V1H0Z" /></clipPath>
        </svg>
        <p className="preloader__top invisible" aria-hidden="true">
          <span className="mask"><span className="preloader__count">00</span></span>
          <span className="mask"><span className="preloader__ready">Ready</span></span>
        </p>
        <button className="preloader__gate invisible" type="button" aria-label="Enter site" disabled>
          <span className="preloader__mark" aria-hidden="true">A</span>
          <span className="mask" aria-hidden="true"><span className="preloader__enter">Enter</span></span>
          <span className="mask" aria-hidden="true"><span className="preloader__welcome">Welcome</span></span>
          <svg className="preloader__ring" viewBox="0 0 220 220" aria-hidden="true">
            <circle cx="110" cy="110" r="108" pathLength="100" />
            <circle cx="110" cy="110" r="108" pathLength="100" />
          </svg>
        </button>
        <div className="preloader__meta invisible" aria-hidden="true">
          <p>
            <span className="mask"><span>Alhadad</span></span>
            <span className="mask"><span>Personal site</span></span>
          </p>
          <p>
            <span className="mask"><span>Index:</span></span>
            <span className="mask"><span>05 Chapters</span></span>
          </p>
          <p>
            <span className="preloader__blocks">
              <svg viewBox="-16 -16 32 32"><path d={SPARK} /></svg>
              <svg viewBox="-32 -30 64 52"><path d={HEART} /></svg>
              <svg viewBox="250 595 124 115"><path d="M260 640C300 600 360 610 362 650 364 690 310 700 300 668 292 642 330 636 334 652" /></svg>
            </span>
            <span className="mask"><span>V-001</span></span>
          </p>
        </div>
      </div>

      <main>
        <section className="hero" id="hook">
          {/* Masthead first so the cut-out portrait paints over it. */}
          <h1 className="hero__name">Alhadad</h1>
          <Portrait />
          <p className="eyebrow hero__issue">Issue 001 — Autumn 2026</p>
          <p className="hero__lead">One line that says who you are.</p>
          <nav className="hero__lines" aria-label="Chapters">
            <ol>
              {CHAPTERS.map(([id, title], i) => (
                <li key={id}><a href={`#${id}`}><span>0{i + 1}</span>{title}</a></li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow hero__eyebrow">Chapter 0 — The cover</p>
          <p className="eyebrow hero__hint" aria-hidden="true">Move to pour</p>
        </section>

        <section className="chapter" id="origin">
          <p className="eyebrow">Chapter 1 — Origin</p>
          <h2 className="reveal">Where it started.</h2>
          <p className="reveal">Placeholder copy.</p>
        </section>

        <section className="chapter" id="turning-point">
          <p className="eyebrow">Chapter 2 — Turning point</p>
          <h2 className="reveal">The moment that shaped the work.</h2>
          <p className="reveal">Placeholder copy.</p>
        </section>

        <section className="chapter" id="work">
          <p className="eyebrow">Chapter 3 — The work</p>
          <h2 className="reveal">Selected projects.</h2>
          <ol className="projects">
            <li className="reveal">Project one — problem, what I did, result.</li>
            <li className="reveal">Project two — problem, what I did, result.</li>
            <li className="reveal">Project three — problem, what I did, result.</li>
          </ol>
        </section>

        <section className="chapter" id="values">
          <p className="eyebrow">Chapter 4 — What I stand for</p>
          <h2 className="reveal">How I work.</h2>
          <p className="reveal">Placeholder copy.</p>
        </section>

        <section className="chapter" id="contact">
          <p className="eyebrow">Chapter 5</p>
          <h2 className="reveal">Let&apos;s talk.</h2>
          <a className="reveal cta" href="mailto:alhadad.xyz@gmail.com">alhadad.xyz@gmail.com</a>
        </section>
      </main>

      <Intro />
    </>
  );
}
