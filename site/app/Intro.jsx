'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { portraitReady, liftCurtain } from './Portrait';
import { drips } from './drips';
import { startMusic } from './Player';
import { crate } from './Crate';

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
// Builds whatever chapter steps are still queued, at once.
let buildChapters = () => {};

// Runs each step inside the matchMedia context, one idle task apiece, and returns a flush for the rest.
function later(context, steps) {
  const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 500 }) : setTimeout(fn, 50));
  const next = () => {
    if (!steps.length) return;
    context.add(steps.shift());
    idle(next);
  };
  idle(next);
  return () => { while (steps.length) context.add(steps.shift()); };
}

function finishLoading() {
  liftCurtain();
  root.classList.remove("is-loading");
  inertBehind(false);
}

// While the curtain is up, the page behind it stays out of the Tab order and the accessibility tree.
function inertBehind(on) {
  document.querySelectorAll("body > :not(.preloader)").forEach((el) => (el.inert = on));
}

function init() {
  root = document.documentElement;
  preloader = document.querySelector(".preloader");
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // ?intro replays the preloader while prototyping.
  const seen = readSeen() && !new URLSearchParams(location.search).has("intro");
  if (!seen) inertBehind(true);
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", (context) => {
    // Seen: layout.jsx already dropped the preloader before first paint, so the cover is
    // on screen; animating it in now would flash it out and back.
    if (seen) {
      finishLoading();
    } else {
      runPreloader();
    }
    // Pins first, in page order: each pushes everything below it down.
    coverTurn();
    // The chapters below the cover are built one per idle task, so hydration stays a short task (Lighthouse TBT).
    // No refresh after: steps built before window load get ScrollTrigger's own, and later ones see final layout.
    buildChapters = later(context, [turningPoint, crate, revealChapters, pasteUp]);
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    if (seen) return finishLoading();
    // No ring, counter or gate: the mark holds, then the curtain fades.
    gsap.set(".preloader__ready, .preloader__enter, .preloader__welcome, .preloader__ring, .preloader__arm", { autoAlpha: 0 });
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
  const panel = preloader.querySelector(".preloader__panel");
  const [track, bar] = ring.querySelectorAll("circle");
  const disc = preloader.querySelector(".preloader__disc");
  const armSvg = preloader.querySelector(".preloader__arm");
  const tonearm = armSvg.querySelector("g");
  const blocks = gsap.utils.shuffle(gsap.utils.toArray(".preloader__blocks svg"));
  const assets = waitForAssets();
  let blink;

  const turbulence = preloader.querySelector("feTurbulence");
  const boil = setInterval(() => turbulence.setAttribute("seed", gsap.utils.random(0, 99, 1)), 125);

  window.scrollTo(0, 0);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  gsap.set(masked, { yPercent: 110 });
  gsap.set(blocks, { autoAlpha: 0 });
  gsap.set([track, bar], { transformOrigin: "50% 50%" });
  gsap.set(disc, { autoAlpha: 0, scale: 0.6 });
  // Swung off the record to the right; svgOrigin is the pivot in the arm's viewBox.
  gsap.set(tonearm, { rotate: -30, svgOrigin: "205 20" });
  gsap.set(armSvg, { autoAlpha: 0 });
  // The record idles slowly while loading; Play spins it up to speed.
  const spin = gsap.to(disc, { rotate: 360, duration: 8, ease: "none", repeat: -1 });
  gsap.utils.toArray(".preloader .invisible").forEach((el) => el.classList.remove("invisible"));

  // Beat 1: the faint track draws in while the ring spins to its 12 o'clock start.
  const intro = gsap.timeline({ delay: 0.2, onComplete: count })
    .fromTo(ring, { rotate: -360 }, { rotate: -90, duration: 1.6, ease: "expo.inOut" }, 0)
    .to(track, { strokeDashoffset: 0, duration: 1.6, ease: "expo.inOut" }, 0)
    .to(disc, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "expo.out" }, 0.6)
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

  // Beat 3: loading is done, the tonearm swings in to the record's edge and the ring becomes a button.
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
      .to(armSvg, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0.4)
      .to(tonearm, { rotate: -8, duration: 1.4, ease: "expo.out" }, 0.4)
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

  // Beat 4: the needle drops and the song starts, the record spins up and flies off pouring paint onto
  // the hero, the chrome swaps its text in place, and the panel drains down off the page.
  function enter() {
    gate.disabled = true;
    blink?.kill();
    startMusic();
    // The pour feeds the liquid's input, so its loop must be running first.
    liftCurtain();
    const out = { yPercent: -110, duration: 0.6, ease: "power3.inOut" };
    // The page must scroll right once the curtain is gone, even if idle time never came.
    gsap.timeline({ onComplete: () => (clearInterval(boil), spin.kill(), buildChapters(), finishLoading()) })
      .to(tonearm, { rotate: 0, duration: 0.3, ease: "power2.in" }, 0)
      .to(spin, { timeScale: 6, duration: 1, ease: "power2.in" }, 0.2)
      .to([ring, disc, armSvg], { scale: 1.6, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 0.35)
      .to(enterText, { ...out, autoAlpha: 1 }, 0)
      .to(welcome, { yPercent: 0, duration: 1, ease: "expo.out" }, 0.3)
      .to([welcome, ready], out, 1.1)
      .to(".preloader__meta .mask > span", { ...out, stagger: 0.04 }, 1.1)
      .to(blocks, { autoAlpha: 0, duration: 0, stagger: 0.06 }, 1.1)
      .add(pour(gate), 1)
      .add(drain(panel), 1.2)
      .add(hook(), 1.6);
  }
}

// A spiral of synthetic pointer moves out from the gate, fed through the liquid's own input,
// so the hero opens with paint already running down it.
function pour(gate) {
  const { left, top, width, height } = gate.getBoundingClientRect();
  const r = Math.min(innerWidth, innerHeight) * 0.22;
  const s = { t: 0 };
  return gsap.to(s, {
    t: 1,
    duration: 0.8,
    ease: "power1.in",
    onUpdate: () => {
      const a = s.t * Math.PI * 3;
      dispatchEvent(new PointerEvent("pointermove", {
        clientX: left + width / 2 + Math.cos(a) * r * s.t,
        clientY: top + height / 2 + Math.sin(a) * r * s.t,
      }));
    },
  });
}

// The panel drains off the page, its top edge hanging back in strands like the hero's drips.
function drain(panel) {
  gsap.set(panel, { clipPath: "url(#drain)" });
  return drips(document.querySelector("#drain path"), 2);
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

// The hero's entrance: name and chrome rise into the slots the preloader just vacated.
function hook() {
  // Hidden elements (the hint on touch screens) can't be measured into lines.
  // aria "none": the default puts aria-label on the <p>s, which ARIA prohibits; the split text stays readable.
  const lines = (sel) =>
    gsap.utils.toArray(sel).filter((el) => el.offsetParent)
      .flatMap((el) => SplitText.create(el, { type: "lines", mask: "lines", aria: "none" }).lines);
  const rise = { yPercent: 105, duration: 1.1, ease: "expo.out" };
  return gsap.timeline()
    .from(".hero__portrait", { autoAlpha: 0, scale: 1.04, duration: 1.6, ease: "expo.out" }, 0)
    .from(lines(".wordmark"), rise, 0)
    .from(lines("#hook h1"), { ...rise, stagger: 0.09 }, 0.35)
    .from(lines(".hero__lead"), rise, 0.4)
    // Links aren't masked: a mask would clip their focus ring.
    .from(".hero__lines a", { y: 24, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.06 }, 0.5)
    .from(lines(".hero .eyebrow"), { ...rise, stagger: 0.06 }, 0.45)
    .from(".player", { y: 24, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0.6);
}

// The cover holds still and sinks back while chapter 1 slides up over it, like turning to page one.
// No pin spacing: the slide happens over chapter 1's own scroll, so nothing below moves. Once the cover
// unpins it's off screen, and the liquid's IntersectionObserver stops rendering it.
function coverTurn() {
  gsap.to("#hook", {
    scale: 0.94,
    "--dim": 0.45,
    ease: "none",
    scrollTrigger: { trigger: "#hook", start: "top top", end: "bottom top", scrub: true, pin: true, pinSpacing: false },
  });
}

// Chapter 2: a proof edit, scrubbed while the section pins. The pen strikes the old question through twice, it
// greys out, a caret goes in, and the new question rises in word by word. Then the page is torn out along its
// margin and lifts away while chapter 3 scrolls up under it. Strokes, opacity and transforms only; the torn edge
// is cut once per refresh.
function turningPoint() {
  const section = document.querySelector("#turning-point");
  const sheet = section.querySelector(".proof__sheet");
  const lift = section.querySelector(".proof__lift");
  const shade = section.querySelector(".proof__shade");
  const stub = section.querySelector(".proof__stub");
  const work = document.querySelector("#work");
  const notebook = document.querySelector(".notebook");
  const cut = () => {
    // The ruled page runs on from the notebook's, as if one sheet: offset its rules by the notebook's height.
    section.style.setProperty("--rule-from", `${notebook.offsetHeight}px`);
    // Chapter 3 tucks under the pin's last screen, so it scrolls in beneath the page as it tears away.
    work.style.marginTop = `${-innerHeight}px`;
    // A ragged edge just right of the margin line.
    const x = Math.max(12, parseFloat(getComputedStyle(sheet).paddingLeft) - 8);
    const edge = Array.from({ length: 81 }, (_, i) => [x + gsap.utils.random(-7, 7), i * 1.25]);
    const pts = (dx) => edge.map(([ex, y]) => `${(ex + dx).toFixed(1)}px ${y}%`);
    sheet.style.clipPath = `polygon(100% 0, 100% 100%, ${pts(0).reverse().join(",")})`;
    stub.style.clipPath = `polygon(0 0, ${pts(4).join(",")}, 0 100%)`;
    // The shadow starts at the torn edge, so none falls on the stub.
    shade.style.left = `${x + 12}px`;
  };
  cut();
  ScrollTrigger.addEventListener("refreshInit", cut);

  const words = SplitText.create(section.querySelector(".proof__words"), { type: "words", mask: "words", aria: "none" }).words;
  // autoRound off, as in revealChapters: rounding snaps the 1-to-0 draw.
  const draw = { strokeDashoffset: 1, autoRound: false, ease: "power1.inOut" };
  // 250%: the edit takes the first 150 (timeline 0–4.5), the tear the last 100 (4.5–7.5), as chapter 3 rises.
  gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "+=250%", scrub: 0.5, pin: true } })
    .from(section.querySelectorAll(".proof__strike path"), { ...draw, duration: 1, stagger: 0.8 })
    .to(section.querySelector(".proof__old > span"), { opacity: 0.4, duration: 0.6 }, "<")
    .from(section.querySelectorAll(".proof__caret path"), { ...draw, duration: 0.5 })
    .from(words, { yPercent: 110, duration: 0.8, stagger: 0.25, ease: "power3.out" }, "-=0.1")
    .from(section.querySelector(".proof__stamp"), { opacity: 0, y: 8, duration: 0.5 })
    // The rip: a small tug against the binding, then the page swings up and away from its torn edge.
    .to(lift, { x: "1.5vw", rotation: 1.2, duration: 0.6, ease: "power1.in" }, 4.5)
    .to(shade, { opacity: 0.22, duration: 0.6 }, 4.5)
    .to(lift, { yPercent: -120, xPercent: 6, rotation: -8, duration: 2, ease: "power2.in" }, 5.1)
    .to(stub, { opacity: 0, duration: 0.4 }, 7.1);

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", cut);
    work.style.marginTop = sheet.style.clipPath = stub.style.clipPath = shade.style.left = "";
  };
}

function revealChapters() {
  gsap.utils.toArray(".chapter:not(#hook)").forEach((chapter) => {
    playAt(0.7, chapter,
      // The flipping crate places its own sleeves.
      gsap.from(chapter.querySelectorAll(".reveal:not(.is-flipping *)"), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        paused: true,
      }),
      // Margin doodles draw themselves in after the copy lands.
      // autoRound off: GSAP rounds px to whole numbers, which snaps the 1-to-0 draw (pathLength 1) instead of drawing it.
      gsap.from(chapter.querySelectorAll(".doodle:not(.proof__mark) path"), {
        strokeDashoffset: 1,
        autoRound: false,
        duration: 0.9,
        stagger: 0.2,
        delay: 0.4,
        ease: "power2.inOut",
        paused: true,
      }),
    );
  });
}

// Plays the tweens once the trigger's top is above `line` (a fraction down the viewport), like a play-once
// ScrollTrigger, but an IntersectionObserver doesn't force a layout for each one as it's built (Lighthouse TBT).
function playAt(line, trigger, ...tweens) {
  const io = new IntersectionObserver(([e]) => {
    if (e.boundingClientRect.top > innerHeight * line) return;
    io.disconnect();
    tweens.forEach((t) => t.play());
  }, { rootMargin: `0px 0px ${-(1 - line) * 100}% 0px` });
  io.observe(trigger);
}

// Chapter 4: each principle is slapped onto the wall as it scrolls in, its accent plate printed off register,
// and the plate settles into register as the sheet rises. Without motion the sheets are simply in register.
function pasteUp() {
  gsap.utils.toArray(".sheet").forEach((sheet) => {
    playAt(0.85, sheet, gsap.from(sheet, { scale: 1.06, y: -24, opacity: 0, duration: 0.5, ease: "back.out(2)", paused: true }));
    gsap.fromTo(sheet, { "--plate": 10 }, { "--plate": 0, ease: "none", scrollTrigger: { trigger: sheet, start: "top bottom", end: "center 55%", scrub: true } });
  });
}

// Resolves when fonts, page images and the liquid portrait are ready; failures count as done.
function waitForAssets() {
  const jobs = [
    document.fonts.ready,
    portraitReady,
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
