const root = document.documentElement;
const preloader = document.querySelector(".preloader");

function finishLoading() {
  root.classList.remove("is-loading");
  preloader?.remove();
}

// If the CDN fails, never leave the visitor stuck behind the preloader.
if (!window.gsap) {
  finishLoading();
} else {
  init();
}

function init() {
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

  // ?intro replays the preloader while prototyping.
  const seen = readSeen() && !new URLSearchParams(location.search).has("intro");
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (seen) {
      finishLoading();
      playHook();
    } else {
      runPreloader();
    }
    revealChapters();
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    if (seen) return finishLoading();
    // Same beats, no travel: name holds, then the curtain fades.
    gsap.set([".preloader__word"], { visibility: "visible" });
    waitForAssets(() => {}).then(() =>
      gsap.to(preloader, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: finishLoading })
    );
    markSeen();
  });
}

function runPreloader() {
  const images = gsap.utils.toArray(".preloader__images img");
  const letters = gsap.utils.toArray(".preloader__word span");
  const word = preloader.querySelector(".preloader__word");
  const counter = preloader.querySelector(".preloader__count span");
  const wordmark = document.querySelector(".wordmark");

  window.scrollTo(0, 0);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  gsap.timeline({
    delay: 0.2,
    defaults: { duration: 0.7, ease: "expo.out" },
    onStart: () => {
      preloader.querySelector(".preloader__images").classList.remove("invisible");
      word.classList.remove("invisible");
    },
  })
    .fromTo(images, { scale: 0, rotate: 0 }, { scale: 1, rotate: () => gsap.utils.random(-14, 14), stagger: 0.14 })
    .fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: { each: 0.07, from: "random" } }, 0.1);

  // Counter follows real asset progress, but never outruns a minimum reading time.
  const MIN_MS = 2400;
  const start = performance.now();
  let real = 0;
  let shown = 0;
  let done = false;
  const render = () => (counter.textContent = String(Math.round(shown)).padStart(3, "0"));

  waitForAssets((p) => (real = p));

  const tick = () => {
    const cap = Math.min(100, ((performance.now() - start) / MIN_MS) * 100);
    shown += (Math.min(real, cap) - shown) * 0.12;
    if (real === 100 && cap === 100 && shown > 99.5) {
      shown = 100;
      render();
      gsap.ticker.remove(tick);
      if (!done) (done = true), exit();
      return;
    }
    render();
  };
  gsap.ticker.add(tick);

  function exit() {
    markSeen();
    gsap.timeline({ defaults: { force3D: true } })
      .to(counter, { yPercent: -100, autoAlpha: 0, duration: 0.5, ease: "power3.in" })
      .to(images, { scale: 0, rotate: () => gsap.utils.random(-14, 14), duration: 0.5, ease: "expo.in", stagger: { each: 0.06, from: "end" } }, 0)
      .to(".preloader__panel", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" }, 0.35)
      // The name doesn't leave: it docks into the header and stays as the site's signature.
      .add(Flip.fit(word, wordmark, { scale: true, duration: 1.2, ease: "expo.inOut" }), 0.35)
      .add(playHook, 0.95)
      .call(finishLoading);
  }
}

function playHook() {
  const split = SplitText.create("#hook h1", { type: "lines", mask: "lines" });
  gsap.from(split.lines, { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.09 });
}

function revealChapters() {
  gsap.utils.toArray(".chapter:not(#hook)").forEach((chapter) => {
    gsap.from(chapter.querySelectorAll(".reveal"), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: chapter, start: "top 70%" },
    });
  });
}

// Resolves when fonts and preloader images are ready; failed images count as done.
function waitForAssets(onProgress) {
  const jobs = [
    document.fonts.ready,
    ...[...preloader.querySelectorAll("img")].map((img) => img.decode().catch(() => {})),
  ];
  let loaded = 0;
  jobs.forEach((j) => j.then(() => onProgress((++loaded / jobs.length) * 100)));
  // shortcut: hard 8s cap so a hung request can't trap the visitor; tune once real assets exist.
  return Promise.race([Promise.all(jobs), new Promise((r) => setTimeout(r, 8000))]).then(() => onProgress(100));
}

function readSeen() {
  try { return sessionStorage.getItem("intro-seen") === "1"; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem("intro-seen", "1"); } catch {}
}
