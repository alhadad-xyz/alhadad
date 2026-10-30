'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

let audio;
const VOLUME = 0.2;

// Intro calls this from the preloader's Play click: browsers only allow sound after a gesture.
export function startMusic() {
  if (!audio || readPaused()) return;
  audio.volume = 0;
  audio.play().then(() => gsap.to(audio, { volume: VOLUME, duration: 2, ease: 'power1.in' })).catch(() => {});
}

// The record's stand-in once the preloader is gone: a chrome caption that pauses and plays the song.
export default function Player() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { audio = ref.current; }, []);

  const toggle = () => {
    const a = ref.current;
    gsap.killTweensOf(a);
    a.volume = VOLUME;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
    // A pause is remembered, so the next visit's Play click doesn't start it again.
    savePaused(a.paused);
  };

  return (
    <>
      <button className="player" type="button" onClick={toggle} aria-pressed={playing} aria-label="Music: ADÉLA, Nicole Kidman">
        <span className="player__bars" aria-hidden="true"><span /><span /><span /><span /></span>
        <span aria-hidden="true">{playing ? 'Now playing' : 'Paused'}</span>
        <span className="player__title" aria-hidden="true">ADÉLA — Nicole Kidman</span>
      </button>
      <audio ref={ref} src="/audio/adela-nicole-kidman.m4a" loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    </>
  );
}

function readPaused() {
  try { return localStorage.getItem('music-paused') === '1'; } catch { return false; }
}
function savePaused(on) {
  try { on ? localStorage.setItem('music-paused', '1') : localStorage.removeItem('music-paused'); } catch {}
}
