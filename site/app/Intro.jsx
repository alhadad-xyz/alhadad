'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Strict mode mounts effects twice in dev; the intro must run once per page load.
let started = false;

export default function Intro() {
  useEffect(() => {
    if (started) return;
    started = true;
    init();
  }, []);
  return null;
}

let root, preloader;

function finishLoading() {
  root.classList.remove("is-loading");
}

function init() {
  root = document.documentElement;
  preloader = document.querySelector(".preloader");
  gsap.registerPlugin(ScrollTrigger, SplitText);

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
    // No ring, counter or gate: the mark holds, then the curtain fades.
    gsap.set(".preloader__ready, .preloader__enter, .preloader__welcome, .preloader__ring", { autoAlpha: 0 });
    gsap.utils.toArray(".preloader .invisible").forEach((el) => el.classList.remove("invisible"));
    waitForAssets().then(() =>
      gsap.to(preloader, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: finishLoading })
    );
    markSeen();
  });
}

function runPreloader() {
  const masked = gsap.utils.toArray(".preloader .mask > span");
  const counter = preloader.querySelector(".preloader__count");
  const ready = preloader.querySelector(".preloader__ready");
  const gate = preloader.querySelector(".preloader__gate");
  const mark = preloader.querySelector(".preloader__mark");
  const enterText = preloader.querySelector(".preloader__enter");
  const welcome = preloader.querySelector(".preloader__welcome");
  const ring = preloader.querySelector(".preloader__ring");
  const [track, bar] = ring.querySelectorAll("circle");
  const blocks = gsap.utils.shuffle(gsap.utils.toArray(".preloader__blocks span"));
  const assets = waitForAssets();
  let blink;

  window.scrollTo(0, 0);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  gsap.set(masked, { yPercent: 110 });
  gsap.set(blocks, { autoAlpha: 0 });
  gsap.set([track, bar], { transformOrigin: "50% 50%" });
  gsap.utils.toArray(".preloader .invisible").forEach((el) => el.classList.remove("invisible"));

  // Beat 1: the faint track draws in while the ring spins to its 12 o'clock start.
  const intro = gsap.timeline({ delay: 0.2, onComplete: count })
    .fromTo(ring, { rotate: -360 }, { rotate: -90, duration: 1.6, ease: "expo.inOut" }, 0)
    .to(track, { strokeDashoffset: 0, duration: 1.6, ease: "expo.inOut" }, 0)
    .to(counter, { yPercent: 0, duration: 1.4, ease: "expo.out" }, 1.4)
    .to(".preloader__meta .mask > span", { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.08 }, 0.4);
  blocks.forEach((b, i) => intro.add(flicker(b), 0.7 + i * 0.05));

  // Beat 2: the counter jumps in uneven steps; the bar fills backwards around the track.
  function count() {
    const values = steps();
    const dt = 1.5 / values.length;
    const tl = gsap.timeline({ onComplete: arm });
    values.forEach((v, i) =>
      tl.to(bar, {
        strokeDashoffset: 100 + v,
        duration: dt,
        ease: "power2.inOut",
        onStart: () => (counter.textContent = String(v).padStart(2, "0")),
      }, i * dt)
    );
    // Hold short of 100 until fonts and images are actually in.
    tl.addPause((values.length - 1) * dt, () => assets.then(() => tl.resume()));
  }

  // Beat 3: loading is done, the ring becomes a button and waits for the visitor.
  function arm() {
    markSeen();
    gsap.timeline()
      .set(track, { strokeDasharray: "0.3 0.3" }, 0)
      .to(counter, { yPercent: -110, duration: 0.6, ease: "power3.inOut" }, 0)
      .to(ready, { yPercent: 0, duration: 1.2, ease: "expo.out" }, 0.4)
      .to(mark, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 0)
      .to(enterText, { yPercent: 0, duration: 1.2, ease: "expo.out" }, 0.6)
      .to(track, { scale: 0.8, duration: 1.6, ease: "expo.out" }, 0.3)
      .to(bar, { scale: 0.88, duration: 1.6, ease: "expo.out" }, 0.5)
      .call(() => {
        gate.disabled = false;
        gate.focus({ preventScroll: true });
        blink = gsap.timeline({ repeat: -1, repeatDelay: 1 })
          .to(enterText, { autoAlpha: 0, duration: 0.3, ease: "none" })
          .to(enterText, { autoAlpha: 1, duration: 0.3, ease: "none" });
      }, null, 0.8);

    const squeeze = (t, b) => {
      gsap.to(track, { scale: t, duration: 0.6, ease: "expo.out", overwrite: true });
      gsap.to(bar, { scale: b, duration: 0.6, ease: "expo.out", overwrite: true });
    };
    gate.addEventListener("pointerenter", () => !gate.disabled && squeeze(0.9, 0.7));
    gate.addEventListener("pointerleave", () => !gate.disabled && squeeze(0.8, 0.88));
    gate.addEventListener("click", enter, { once: true });
  }

  // Beat 4: the whole screen shrinks to a card and wipes off to the left.
  function enter() {
    gate.disabled = true;
    blink?.kill();
    gsap.timeline({ onComplete: finishLoading })
      .to(ring, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0)
      .to(enterText, { yPercent: -110, autoAlpha: 1, duration: 0.6, ease: "power3.inOut" }, 0)
      .to(welcome, { yPercent: 0, duration: 1.4, ease: "expo.out" }, 0.4)
      .to([".preloader__top", ".preloader__meta"], { opacity: 0.3, duration: 1.4, ease: "expo.out" }, 0.1)
      .to(preloader, { scale: 0.8, duration: 1.4, ease: "expo.out" }, 0.1)
      .to(preloader, { clipPath: "inset(0% 100% 0% 0%)", duration: 1.8, ease: "expo.inOut" }, 1)
      .add(playHook, 1.6);
  }
}

// 5-7 rising stops that always land on 100, so every visit counts differently.
function steps() {
  const n = gsap.utils.random(5, 7, 1);
  const out = [];
  let v = 0;
  for (let i = 1; i < n; i++) out.push((v = Math.min(99, gsap.utils.random(v + 1, v + 100 / n + 10, 1))));
  return [...out, 100];
}

// Hard on/off flicker, like a terminal cursor waking up.
function flicker(el, times = 3, step = 0.08) {
  const tl = gsap.timeline();
  for (let i = 0; i < times; i++) tl.set(el, { autoAlpha: 1 }, i * step * 1.7).set(el, { autoAlpha: 0 }, i * step * 1.7 + step);
  return tl.set(el, { autoAlpha: 1 }, times * step * 1.7);
}

function playHook() {
  const split = SplitText.create("#hook h1", { type: "lines", mask: "lines" });
  gsap.from(split.lines, { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.09 });
  gsap.from(".hero__portrait", { autoAlpha: 0, scale: 1.04, duration: 1.6, ease: "expo.out" });
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

// Resolves when fonts and page images are ready; failed images count as done.
function waitForAssets() {
  const jobs = [
    document.fonts.ready,
    ...[...document.images].map((img) => img.decode().catch(() => {})),
  ];
  // shortcut: hard 8s cap so a hung request can't trap the visitor; tune once real assets exist.
  return Promise.race([Promise.all(jobs), new Promise((r) => setTimeout(r, 8000))]);
}

function readSeen() {
  try { return sessionStorage.getItem("intro-seen") === "1"; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem("intro-seen", "1"); } catch {}
}
