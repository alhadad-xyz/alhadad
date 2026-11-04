// Bakes the hero's painted sheet into public/sheet.bin.gz: headless Chrome runs paintSheet() from
// app/doodles.js on hero.webp and posts the bytes back here. Run from site/ via `npm run bake`.
// Set CHROME to Chrome's binary if it isn't in the macOS default place.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = 'public/sheet.bin.gz';

const page = `<!doctype html><script type="module">
import { paintSheet } from '/doodles.js';
const img = new Image();
img.src = '/hero.webp';
await img.decode();
await fetch('/sheet', { method: 'POST', body: await paintSheet(img) });
</script>`;
const files = {
  '/': ['text/html', () => page],
  '/doodles.js': ['text/javascript', () => readFileSync('app/doodles.js')],
  '/hero.webp': ['image/webp', () => readFileSync('public/hero.webp')],
};

const profile = mkdtempSync(join(tmpdir(), 'bake-sheet-'));
let chrome;
const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/sheet') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks);
      writeFileSync(OUT, gzipSync(raw, { level: 9 }));
      console.log(`${OUT}: ${raw.length} bytes raw, ${readFileSync(OUT).length} gzipped`);
      res.end();
      done(0);
    });
    return;
  }
  const file = files[req.url];
  if (!file) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': file[0] }).end(file[1]());
});

function done(code) {
  chrome?.kill();
  server.close();
  rmSync(profile, { recursive: true, force: true });
  process.exitCode = code;
}

server.listen(0, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${server.address().port}/`;
  chrome = spawn(CHROME, ['--headless=new', '--no-first-run', `--user-data-dir=${profile}`, url], { stdio: 'ignore' });
  chrome.on('exit', () => process.exitCode ?? (console.error('Chrome exited before posting the sheet.'), done(1)));
});
