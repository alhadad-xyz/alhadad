import Intro from './Intro';

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#hook">Alhadad</a>
      </header>

      <div className="preloader">
        <div className="preloader__panel"></div>
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
            <span className="preloader__blocks"><span>▊</span><span>▊</span><span>▊</span></span>
            <span className="mask"><span>V-001</span></span>
          </p>
        </div>
      </div>

      <main>
        <section className="chapter" id="hook">
          <p className="eyebrow">Chapter 0</p>
          <h1 className="reveal">Your name. One line that says who you are.</h1>
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
