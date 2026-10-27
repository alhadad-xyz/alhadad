// The painted version of the hero, baked once:
//   dist = distance in texels from the photo's silhouette (contour rings are drawn from it)
//   data = RGBA8 where G = backdrop doodles (graphite, hidden behind the figure)
//          and B = face doodles (white, drawn over the figure)
// The sheet is SHEET_RATIO photo-heights wide, centred on the photo, bottom-aligned.

export const SHEET_RATIO = 2.2;
const W = 1320;
const H = 600;

const HAND = `font-family="'Marker Felt','Comic Sans MS','Segoe Print',cursive"`;
const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2200 1000" width="${W}" height="${H}" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const heart = (x, y, s, fill) =>
  `<path transform="translate(${x} ${y}) scale(${s})" ${fill ? 'fill="#000"' : ''} d="M0 18C-30-2-26-26-10-26-3-26 0-20 0-16 0-20 3-26 10-26 26-26 30-2 0 18Z"/>`;
const spark = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-14V14M-14 0H14M-8-8 8 8M8-8-8 8" stroke-width="4"/>`;
const ask = (x, y, size, r) => `<text x="${x}" y="${y}" font-size="${size}" transform="rotate(${r} ${x} ${y})" fill="#000" stroke="none" ${HAND}>?</text>`;

// Photo spans x 601-1599 of the 2200-wide sheet; doodles stay clear of the figure.
const BACKDROP = svg(`
  <path d="M120 230C110 120 230 50 370 52 520 54 640 130 632 240 624 340 520 402 380 404 300 405 240 392 190 368L120 420 150 340C130 310 122 270 120 230Z"/>
  <path d="M300 330 366 120 438 332M320 266 418 262" stroke-width="14"/>
  ${ask(170, 200, 80, -14)}${ask(520, 170, 64, 12)}${ask(560, 330, 56, 20)}${ask(220, 340, 48, -8)}
  ${heart(140, 560, 2.2, true)}${heart(560, 520, 1.4, false)}
  <path d="M260 640C300 600 360 610 362 650 364 690 310 700 300 668 292 642 330 636 334 652"/>
  <path d="M430 610 640 560 520 680 500 620Z M500 620 640 560"/>
  <path d="M60 780C60 730 140 700 260 702 380 704 460 740 458 790 456 838 380 866 260 864 200 863 150 852 120 836L70 870 86 816C68 806 60 794 60 780Z"/>
  <text x="130" y="806" font-size="64" fill="#000" stroke="none" ${HAND}>hello there</text>
  ${spark(80, 470, 1.6)}${spark(660, 430, 1.1)}${spark(560, 940, 1.3)}

  <path transform="translate(1060 20)" d="M0 50 8 0 30 30 46 -6 62 30 84 0 92 50Z" stroke-width="5"/>
  <path d="M1690 120C1690 70 1790 40 1920 42 2060 44 2150 80 2148 128 2146 176 2060 206 1920 204 1860 203 1800 194 1760 180L1690 220 1716 160C1698 150 1690 136 1690 120Z"/>
  <text x="1748" y="146" font-size="64" fill="#000" stroke="none" ${HAND}>@alhadad</text>
  <path d="M1440 300C1440 262 1490 240 1560 241 1630 242 1680 264 1679 300 1678 336 1628 358 1560 357L1500 390 1512 352C1468 344 1440 326 1440 300Z"/>
  <text x="1500" y="318" font-size="54" fill="#000" stroke="none" ${HAND}>hi :)</text>
  <circle cx="1960" cy="400" r="120"/>
  <path d="M1916 380v6M2004 380v6M1906 432C1940 470 1984 470 2016 432" stroke-width="10"/>
  ${heart(1760, 600, 2.4, true)}${heart(2080, 640, 1.5, false)}${heart(1640, 820, 1.2, true)}
  <path d="M1880 760C1980 740 2080 780 2120 860M1880 790C1960 780 2040 810 2080 870" />
  <path d="M1700 940 1750 900 1800 940 1850 900 1900 940 1950 900" stroke-width="5"/>
  ${spark(1380, 120, 1.4)}${spark(2140, 260, 1.2)}${spark(1560, 470, 1)}${spark(2160, 960, 1.4)}
`);

// Heart eyes, placed on the eyes in the source photo.
const FACE = svg(`${heart(1010, 262, 1.25, false)}${heart(1153, 260, 1.25, false)}`).replace('stroke-width="6"', 'stroke-width="5"');

export async function paintSheet(photo) {
  const ctx = new OffscreenCanvas(W, H).getContext('2d', { willReadFrequently: true });
  const pw = (H * photo.naturalWidth) / photo.naturalHeight;
  const alpha = (draw) => {
    ctx.clearRect(0, 0, W, H);
    draw();
    const px = ctx.getImageData(0, 0, W, H).data;
    const out = new Uint8Array(W * H);
    for (let i = 0; i < out.length; i++) out[i] = px[i * 4 + 3];
    return out;
  };
  const [back, face] = await Promise.all([BACKDROP, FACE].map(load));

  const shape = alpha(() => ctx.drawImage(photo, (W - pw) / 2, 0, pw, H));
  const ink = alpha(() => ctx.drawImage(back, 0, 0, W, H));
  const glow = alpha(() => ctx.drawImage(face, 0, 0, W, H));
  const dist = distance(shape);

  const data = new Uint8Array(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    dist[i] = Math.min(dist[i], 2048); // stays finite as a half float
    data[i * 4 + 1] = ink[i];
    data[i * 4 + 2] = glow[i];
    data[i * 4 + 3] = 255;
  }
  return { data, dist, width: W, height: H };
}

function load(markup) {
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
  const img = new Image();
  img.src = url;
  return img.decode().then(() => img).finally(() => URL.revokeObjectURL(url));
}

// shortcut: two-pass chamfer distance, octagonal not Euclidean; the shader's wobble hides it.
function distance(alpha) {
  const d = new Float32Array(W * H);
  for (let i = 0; i < d.length; i++) d[i] = alpha[i] > 127 ? 0 : 1e6;
  const D = Math.SQRT2;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 1);
      if (y > 0) {
        d[i] = Math.min(d[i], d[i - W] + 1);
        if (x > 0) d[i] = Math.min(d[i], d[i - W - 1] + D);
        if (x < W - 1) d[i] = Math.min(d[i], d[i - W + 1] + D);
      }
    }
  for (let y = H - 1; y >= 0; y--)
    for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x;
      if (x < W - 1) d[i] = Math.min(d[i], d[i + 1] + 1);
      if (y < H - 1) {
        d[i] = Math.min(d[i], d[i + W] + 1);
        if (x < W - 1) d[i] = Math.min(d[i], d[i + W + 1] + D);
        if (x > 0) d[i] = Math.min(d[i], d[i + W - 1] + D);
      }
    }
  return d;
}
