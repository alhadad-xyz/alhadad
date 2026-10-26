import Intro from './Intro';

const images = [1011, 1027, 1035, 1043, 1062, 1074];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#hook">Alhadad</a>
      </header>

      <div className="preloader" aria-hidden="true">
        <div className="preloader__panel"></div>
        <div className="preloader__images invisible">
          {images.map((id) => (
            <img key={id} src={`https://picsum.photos/id/${id}/450/600`} width="450" height="600" alt="" />
          ))}
        </div>
        <div className="preloader__center">
          <div className="preloader__word invisible">
            {'ALHADAD'.split('').map((c, i) => <span key={i}>{c}</span>)}
          </div>
          <div className="preloader__count"><span>000</span></div>
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
