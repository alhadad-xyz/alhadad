import Intro from './Intro';
import Portrait from './Portrait';
import RunningHead from './RunningHead';
import Player from './Player';
import Riso from './Riso';
import CopyEmail from './CopyEmail';
import Crate from './Crate';
import LinerNotes from './LinerNotes';
import { HEART, SPARK } from './doodles';

// Cover lines on the hero and the running header's index, one per chapter section below.
// Back-cover barcode: bar and gap widths, alternating, starting with a bar.
const BARCODE = [2, 1, 1, 2, 3, 1, 1, 1, 2, 2, 1, 3, 1, 1, 3, 2, 1, 1, 2, 1, 1, 2, 2, 1, 3];

// Fine-liner shapes for the margin doodles. Each path is pathLength 1 so Intro can draw it in.
const CIRCLE = { box: '0 0 100 40', paths: ['M58 4C30 1 4 9 3 21c-1 13 30 17 55 16 26-1 40-8 39-18C96 8 70 2 42 5'] };
const UNDERLINE = { box: '0 0 100 10', paths: ['M2 6C20 3 38 8 55 5s30-2 43 1'] };
const ARROW = { box: '0 0 80 50', paths: ['M76 4C58 2 30 12 8 42', 'M8 42l1-12M8 42l11-4'] };

function Doodle({ shape, className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox={shape.box} preserveAspectRatio="none" aria-hidden="true">
      {shape.paths.map((d) => <path key={d} d={d} pathLength="1" />)}
    </svg>
  );
}

// A margin aside: a short handwritten line with an arrow pointing down-left at what it annotates.
function Note({ children, className = '' }) {
  return (
    <span className={`note ${className}`} aria-hidden="true">
      <span>{children}</span>
      <Doodle shape={ARROW} />
    </span>
  );
}

// Chapter 3. shortcut: dummy entries and placeholder images until the real projects land (task 3).
const PROJECTS = [1, 2, 3, 4, 5].map((n) => ({
  title: `Placeholder project ${['one', 'two', 'three', 'four', 'five'][n - 1]}`,
  role: ['Design, front end', 'Front end', 'Product design', 'Design, build', 'Creative direction'][n - 1],
  year: 2027 - n,
  img: `/work/0${n}.svg`,
  alt: `Placeholder image for project ${n}`,
  problem: 'Placeholder copy: the problem, in one or two sentences.',
  did: 'Placeholder copy: what you did about it.',
  result: 'Placeholder copy: the result, ideally with a number.',
}));

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
        <a className="wordmark" href="#hook" aria-label="A. Alhadad">A.</a>
      </header>
      <RunningHead chapters={CHAPTERS} />
      <Player />
      <Riso />

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
        <button className="preloader__gate invisible" type="button" aria-label="Enter site and play music" disabled>
          {/* The record: grooves and a label that spins while the page loads. First, so the mark sits on the label. */}
          <svg className="preloader__disc" viewBox="0 0 220 220" aria-hidden="true">
            {[74, 66, 58, 50].map((r) => <circle key={r} cx="110" cy="110" r={r} />)}
            <circle className="preloader__label" cx="110" cy="110" r="40" />
            <path id="label-text" d="M110 77a33 33 0 1 1 0 66a33 33 0 1 1 0-66" fill="none" />
            <text textLength="207" lengthAdjust="spacing"><textPath href="#label-text">SIDE A · ALHADAD · ISSUE 001 ·</textPath></text>
          </svg>
          <span className="preloader__mark" aria-hidden="true">A</span>
          <span className="mask" aria-hidden="true"><span className="preloader__enter">Play</span></span>
          <span className="mask" aria-hidden="true"><span className="preloader__welcome">Welcome</span></span>
          <svg className="preloader__ring" viewBox="0 0 220 220" aria-hidden="true">
            <circle cx="110" cy="110" r="108" pathLength="100" />
            <circle cx="110" cy="110" r="108" pathLength="100" />
          </svg>
          {/* Tonearm, pivoting from the top-right corner. Intro swings it to the edge on Ready and drops the needle on Play. */}
          <svg className="preloader__arm" viewBox="0 0 220 220" aria-hidden="true">
            <g>
              <circle cx="205" cy="20" r="7" />
              <path d="M209 6L205 20L197 112L172 148" />
              <path className="preloader__needle" d="M166 143L177 152" />
            </g>
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

      {/* Looping line boil for the margin doodles and back cover; the preloader's #boil stops once the intro ends. */}
      <svg className="svg-defs" aria-hidden="true">
        <filter id="boil-loop" x="-10%" y="-50%" width="120%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1">
            <animate attributeName="seed" values="0;1;2;3;4;5;6;7" dur="1s" calcMode="discrete" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <main>
        <section className="hero" id="hook">
          {/* Masthead first so the cut-out portrait paints over it. */}
          <h1 className="hero__name">Alhadad</h1>
          <Portrait />
          <p className="eyebrow hero__issue">Issue 001 — Autumn 2026</p>
          <p className="hero__lead">An AI engineer who turns complex ideas into lean, working products.</p>
          <nav className="hero__lines" aria-label="Chapters">
            <ol>
              {CHAPTERS.map(([id, title], i) => (
                <li key={id}><a href={`#${id}`}><span aria-hidden="true">0{i + 1}</span>{title}</a></li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow hero__eyebrow">Chapter 0 — The cover</p>
          <p className="eyebrow hero__hint" aria-hidden="true">Move to pour</p>
        </section>

        {/* Opening pages: huge number, title, drop cap, and a pull quote set over the number. */}
        <section className="chapter opener" id="origin">
          <p className="opener__num" aria-hidden="true">01</p>
          <header className="opener__head">
            <p className="eyebrow">Chapter 1 — Origin</p>
            <h2 className="reveal">Where it <span className="circled">started<Doodle shape={CIRCLE} /></span>.</h2>
          </header>
          <div className="opener__body">
            <p className="reveal dropcap">Every builder has a first door. Mine was a game. In junior high I wanted to make one instead of playing one, so I taught myself to code.</p>
            <p className="reveal">My first project was a tiny browser adventure. It barely held together, but it ran, and that was enough. The game was the excuse. The code was the point.</p>
          </div>
          <blockquote className="pull reveal">
            <p>“He came for the games and stayed for the code.”</p>
            <Note className="note--pull">the line to remember</Note>
          </blockquote>
        </section>

        {/* The page flips: ink pours down over it (Intro scrubs the drips), then one sentence lights up word by word.
            Without motion the ink is simply there. */}
        <section className="chapter flip" id="turning-point">
          <div className="flip__paint" aria-hidden="true"></div>
          <svg className="svg-defs" aria-hidden="true">
            <clipPath id="flip" clipPathUnits="objectBoundingBox"><path d="M0 0Z" /></clipPath>
          </svg>
          <p className="eyebrow">Chapter 2 — Turning point</p>
          <h2>The <span className="underlined">moment<Doodle shape={UNDERLINE} /></span> that shaped the work.</h2>
          <p className="flip__sentence">In 2020, AI turned “can I build this?” into “what should I build next?”</p>
        </section>

        <section className="chapter" id="work">
          <p className="eyebrow">Chapter 3 — The work</p>
          <h2 className="reveal">Selected projects.</h2>
          <div className="work">
            <Crate projects={PROJECTS} />
            <Note className="note--work">flip through, pull one out</Note>
          </div>
        </section>

        <section className="chapter opener" id="values">
          <p className="opener__num" aria-hidden="true">04</p>
          <header className="opener__head">
            <p className="eyebrow">Chapter 4 — What I stand for</p>
            <h2 className="reveal">How I <span className="circled">work<Doodle shape={CIRCLE} /></span>.</h2>
          </header>
          <div className="opener__body">
            <p className="reveal dropcap">Placeholder copy. One paragraph on how you approach the work, leading into the principles below.</p>
            <ol className="principles">
              <li className="reveal"><h3>Principle one, set as a headline.</h3><p>Placeholder copy: one sentence on what it means in practice.</p></li>
              <li className="reveal"><h3>Principle two, set as a headline.</h3><p>Placeholder copy: one sentence on what it means in practice.</p></li>
              <li className="reveal"><h3>Principle three, set as a headline.</h3><p>Placeholder copy: one sentence on what it means in practice.</p></li>
            </ol>
          </div>
          <blockquote className="pull reveal">
            <p>“Placeholder pull quote: the belief everything else follows from.”</p>
            <Note className="note--pull">in this order</Note>
          </blockquote>
        </section>

        <section className="chapter back-cover" id="contact">
          <p className="eyebrow">Chapter 5 — Let’s talk</p>
          <h2 className="reveal">Let&apos;s talk.</h2>
          <CopyEmail address="alhadad.xyz@gmail.com">
            <Note className="note--mail">say hi</Note>
          </CopyEmail>
          <LinerNotes />
          <div className="back-cover__barcode" aria-hidden="true">
            <svg viewBox={`0 0 ${BARCODE.reduce((a, b) => a + b * 3, 0)} 40`} preserveAspectRatio="none">
              {BARCODE.map((w, i, all) => {
                if (i % 2) return null;
                const x = all.slice(0, i).reduce((a, b) => a + b * 3, 0) + w * 1.5;
                return <path key={i} d={`M${x} 2V38`} strokeWidth={w * 2} />;
              })}
            </svg>
            <p>Issue 001 · V-001</p>
          </div>
        </section>
      </main>

      <Intro />
    </>
  );
}
