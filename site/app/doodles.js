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
  ${heart(140, 560, 2.2, false)}${heart(146, 556, 2.1, false).replace('<path', '<path stroke-width="3" opacity=".6"')}${heart(560, 520, 1.4, false)}
  <path d="M260 640C300 600 360 610 362 650 364 690 310 700 300 668 292 642 330 636 334 652"/>
  <path d="M430 610 640 560 520 680 500 620Z M500 620 640 560"/>
  <path d="M60 780C60 730 140 700 260 702 380 704 460 740 458 790 456 838 380 866 260 864 200 863 150 852 120 836L70 870 86 816C68 806 60 794 60 780Z"/>
  <text x="130" y="806" font-size="64" fill="#000" stroke="none" ${HAND}>hello there</text>
  ${spark(80, 470, 1.6)}${spark(660, 430, 1.1)}${spark(560, 940, 1.3)}

  <path d="M1690 120C1690 70 1790 40 1920 42 2060 44 2150 80 2148 128 2146 176 2060 206 1920 204 1860 203 1800 194 1760 180L1690 220 1716 160C1698 150 1690 136 1690 120Z"/>
  <text x="1748" y="146" font-size="64" fill="#000" stroke="none" ${HAND}>@alhadad</text>
  <path d="M1440 300C1440 262 1490 240 1560 241 1630 242 1680 264 1679 300 1678 336 1628 358 1560 357L1500 390 1512 352C1468 344 1440 326 1440 300Z"/>
  <text x="1500" y="318" font-size="54" fill="#000" stroke="none" ${HAND}>hi :)</text>
  <path d="M2010 300C1920 310 1890 400 1920 450 1950 500 2020 510 2060 480 2000 480 1960 440 1960 390 1960 340 1990 310 2010 300Z"/>
  <path d="M2000 312C1934 326 1910 400 1932 446 1956 490 2010 498 2044 486" stroke-width="3" opacity=".6"/>
  ${spark(1890, 330, 1.2)}${spark(2120, 420, 0.8)}<circle cx="1860" cy="470" r="4" fill="#000"/>
  ${heart(1760, 600, 2.4, false)}${heart(1766, 596, 2.3, false).replace('<path', '<path stroke-width="3" opacity=".6"')}${heart(2080, 640, 1.5, false)}${heart(1640, 820, 1.2, true)}
  <path d="M1880 760C1980 740 2080 780 2120 860M1880 790C1960 780 2040 810 2080 870" />
  <path d="M1700 940 1750 900 1800 940 1850 900 1900 940 1950 900" stroke-width="5"/>
  ${spark(1380, 120, 1.4)}${spark(2140, 260, 1.2)}${spark(1560, 470, 1)}${spark(2160, 960, 1.4)}
`);

// Fine-liner marks drawn on the person, placed on features of the source photo
// (eyes y~253, nose 1111/299, mouth 1111/351, collar y~451-576, seam x~1128, pocket edge y~823).
// Doubled strokes at lower opacity read as a second pass of the pen.
const thin = (d, w = 3, o = 1) => `<path d="${d}" stroke-width="${w}" opacity="${o}"/>`;
const dot = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" stroke="none"/>`;
const star = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-16C2-4 4-2 16 0 4 2 2 4 0 16-2 4-4 2-16 0-4-2-2-4 0-16Z" stroke-width="2.5"/>`;
const leaf = (x, y, r) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0C14-14 38-14 52 0 38 12 14 12 0 0ZM4 0H44" stroke-width="2.5"/>`;
const flower = (x, y) => `<g transform="translate(${x} ${y})" stroke-width="2.5">${[0, 72, 144, 216, 288]
  .map((r) => `<path transform="rotate(${r})" d="M0-4C-9-12-8-26 0-28 8-26 9-12 0-4Z"/>`).join('')}${dot(0, 0, 3.5)}</g>`;

const FACE = svg(`
  ${thin('M985 44C990 22 1060 14 1110 16 1170 18 1222 28 1218 44 1214 60 1150 66 1100 66 1040 66 982 60 985 44', 3.5)}
  ${thin('M994 38C1006 24 1070 20 1116 22 1176 25 1210 34 1212 48', 2, 0.6)}
  ${thin('M962 122C934 100 904 104 884 132')}${thin('M948 204C912 192 886 212 872 242', 2.5, 0.8)}
  ${thin('M1240 112C1270 92 1300 98 1318 126')}${thin('M1262 212C1296 206 1320 226 1330 254', 2.5, 0.8)}
  ${thin('M1042 92C1022 140 1012 190 1002 240', 2, 0.7)}${thin('M1162 88C1192 132 1206 182 1212 232', 2, 0.7)}
  ${star(1004, 134, 0.7)}${star(1226, 164, 0.55)}${star(1206, 286, 0.5)}

  ${thin('M986 248L972 238M991 241L983 227M997 237L995 223', 2.5)}
  ${thin('M1186 245L1200 235M1181 238L1189 224M1175 234L1177 220', 2.5)}
  ${dot(1062, 302)}${dot(1074, 293, 2)}${dot(1086, 305, 2.2)}${dot(1050, 314, 2)}
  ${dot(1138, 302, 2.2)}${dot(1150, 293)}${dot(1162, 305, 2)}${dot(1174, 314, 2)}
  ${thin('M1026 334L1036 318M1038 336L1048 320M1050 337L1060 321', 2.2, 0.8)}
  ${thin('M1164 337L1174 321M1176 336L1186 320M1188 334L1198 318', 2.2, 0.8)}
  ${star(1064, 376, 0.4)}

  <path d="M995 470C1020 540 1070 568 1112 570 1156 568 1204 540 1228 470" stroke-width="4" stroke-dasharray="1 10"/>
  ${thin('M1112 570V582', 2)}${thin('M1102 584A15 15 0 1 0 1124 606 12 12 0 1 1 1102 584Z', 2.5)}

  ${thin('M1128 1000C1100 950 1150 900 1124 850 1100 800 1150 760 1128 700 1110 660 1132 640 1128 624', 3)}
  ${thin('M1134 998C1108 948 1156 902 1130 852', 1.8, 0.5)}
  ${leaf(1124, 850, 200)}${leaf(1132, 762, -20)}${leaf(1120, 930, 196)}${leaf(1130, 672, -26)}${leaf(1116, 712, 210)}
  ${flower(1128, 612)}
  ${thin('M1262 642L1302 622 1342 662 1332 722 1392 742M1342 662 1292 702', 1.8, 0.7)}
  ${dot(1262, 642, 4)}${dot(1302, 622, 3)}${dot(1342, 662, 4.5)}${dot(1332, 722, 3)}${dot(1392, 742, 3.5)}${dot(1292, 702, 2.5)}
  <path d="M1140 812H1336V876" stroke-width="3" stroke-dasharray="9 9" opacity=".85"/>
  <text x="820" y="920" font-size="44" transform="rotate(-8 820 920)" fill="#000" stroke="none" opacity=".9" ${HAND}>alhadad.</text>
  ${star(842, 612, 0.8)}${star(884, 650, 0.5)}${dot(864, 600, 2.5)}${dot(812, 650, 2)}
  ${thin('M1400 900C1410 880 1436 884 1436 904 1436 926 1404 932 1394 910 1384 884 1420 864 1446 880', 2.5, 0.85)}
`);

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
