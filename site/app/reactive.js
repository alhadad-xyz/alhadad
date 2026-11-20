let ctx;
let analyser;
let data;
let target;
let wired = false;
let rafId = 0;
let level = 0;
let avg = 0;
const GAIN = 4;

export function react(audio) {
  if (!audio) return;

  if (wired) {
    // Browsers suspend audio contexts after inactivity or tab switches.
    if (ctx) ctx.resume().catch(() => {});
    return;
  }

  // Web Audio APIs can be blocked or missing in restricted environments.
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;

    // Audio elements only produce sound through Web Audio once routed to the destination.
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    data = new Uint8Array(analyser.frequencyBinCount);
    target = document.querySelector('#boil-loop feDisplacementMap');
    wired = true;

    const start = () => {
      // Respect accessibility settings by disabling ink turbulence for motion sensitivity.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      level = 0;
      if (target) target.setAttribute('scale', '2');
    };

    const tick = () => {
      // Paused playback should release the frame loop and restore the baseline filter scale.
      if (audio.paused) {
        stop();
        return;
      }

      analyser.getByteFrequencyData(data);
      // Bins 0-1 at fftSize 256 are roughly 0-375 Hz: the kick, not the vocals.
      const v = (data[0] + data[1]) / (2 * 255);
      // The song's low end is always loud, so react to the jump above its running average, not the level.
      avg = avg * 0.95 + v * 0.05;
      const hit = Math.min(1, Math.max(0, v - avg) * GAIN);

      // Fast attack hits on kicks while slow release keeps the displacement decay organic.
      level = hit > level ? hit : level * 0.92;
      const scale = 2 + level * 5;
      if (!target) target = document.querySelector('#boil-loop feDisplacementMap');
      if (target) target.setAttribute('scale', scale.toFixed(2));

      rafId = requestAnimationFrame(tick);
    };

    audio.addEventListener('play', start);
    audio.addEventListener('pause', stop);

    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    if (!audio.paused) start();
  } catch {}
}
