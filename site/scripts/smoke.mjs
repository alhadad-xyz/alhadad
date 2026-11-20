// Smoke tests the static build in headless Chrome: checks page errors, CSP violations,
// stuck preloader, and missing pins across viewports and failure modes.
// Needs `npm run build` first. Run from site/ via `npm run smoke`.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CADDYFILE = 'deploy/Caddyfile';

const caddyMatch = existsSync(CADDYFILE) && readFileSync(CADDYFILE, 'utf8').match(/Content-Security-Policy "([^"]+)"/);
if (!caddyMatch) {
  console.error('Content-Security-Policy not found in deploy/Caddyfile');
  process.exit(1);
}
const csp = caddyMatch[1];

const MIME = {
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  woff2: 'font/woff2',
  webp: 'image/webp',
  avif: 'image/avif',
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
  m4a: 'audio/mp4',
  txt: 'text/plain',
  json: 'application/json',
  xml: 'application/xml',
  gz: 'application/octet-stream',
};

const REPORTER_SCRIPT = `
(function() {
  const errors = [];
  const csp = [];
  window.addEventListener('error', function(e) { errors.push(e.message || String(e)); });
  window.addEventListener('unhandledrejection', function(e) { errors.push(String(e.reason)); });
  document.addEventListener('securitypolicyviolation', function(e) {
    csp.push(e.violatedDirective + ' ' + e.blockedURI);
  });

  const wait = function(ms) { return new Promise(function(r) { setTimeout(r, ms); }); };

  function report(mode) {
    const body = {
      mode: mode,
      width: window.innerWidth,
      errors: errors,
      csp: csp,
      loading: document.documentElement.classList.contains('is-loading'),
      gl: !!document.querySelector('.hero__portrait.is-gl'),
      pins: document.querySelectorAll('.pin-spacer').length,
      title: document.title,
    };
    fetch('/__report', { method: 'POST', body: JSON.stringify(body) });
  }

  (async function() {
    const mode = new URLSearchParams(location.search).get('mode');
    if (mode === 'first') {
      const start = Date.now();
      let gate = null;
      // Under software WebGL the gate arms 10-20s in, so allow 40s.
      while (Date.now() - start < 40000) {
        gate = document.querySelector('.preloader__gate:not([disabled])');
        if (gate) break;
        await wait(200);
      }
      if (gate) gate.click();
      // Wait for the intro to hand over instead of a fixed delay; the check below catches a stall.
      const clicked = Date.now();
      while (document.documentElement.classList.contains('is-loading') && Date.now() - clicked < 20000) await wait(200);
      await wait(1000);
      let steps = 0;
      while (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 2 && steps < 200) {
        window.scrollBy(0, window.innerHeight * 0.7);
        steps++;
        await wait(100);
      }
      await wait(1000);
      report(mode);
    } else if (mode === 'block') {
      await wait(14000);
      report(mode);
    } else if (mode === '404') {
      await wait(2000);
      report(mode);
    }
  })();
})();
`;

let currentRun = null;
let resolveReport = null;

const server = createServer((req, res) => {
  res.setHeader('Content-Security-Policy', csp);

  const parsed = new URL(req.url, 'http://127.0.0.1');
  const pathname = decodeURIComponent(parsed.pathname);

  if (req.method === 'GET' && pathname === '/__smoke.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end(REPORTER_SCRIPT);
    return;
  }

  if (req.method === 'POST' && pathname === '/__report') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      res.writeHead(204).end();
      try {
        const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (resolveReport) {
          const fn = resolveReport;
          resolveReport = null;
          fn(data);
        }
      } catch {}
    });
    return;
  }

  // Block mode: JS chunks 404 (CSS still loads, as in a real failed deploy) to test the layout.jsx failsafe.
  if (currentRun?.block && pathname.startsWith('/_next/static/chunks/') && pathname.endsWith('.js')) {
    res.writeHead(404).end();
    return;
  }

  let targetPath;
  let status = 200;

  if (pathname === '/') {
    targetPath = join('out', 'index.html');
  } else {
    const rel = pathname.replace(/^\/+/, '');
    const cand1 = join('out', rel);
    if (existsSync(cand1) && statSync(cand1).isFile()) {
      targetPath = cand1;
    } else {
      const cand2 = join('out', `${rel}.html`);
      if (existsSync(cand2) && statSync(cand2).isFile()) {
        targetPath = cand2;
      } else {
        targetPath = join('out', '404.html');
        status = 404;
      }
    }
  }

  if (pathname === '/missing' && status === 404 && currentRun) {
    currentRun.sent404 = true;
  }

  const ext = extname(targetPath).slice(1).toLowerCase();
  let content = readFileSync(targetPath);

  if (ext === 'html') {
    const html = content.toString('utf8').replace('<head>', '<head><script src="/__smoke.js"></script>');
    content = Buffer.from(html, 'utf8');
  }

  res.writeHead(status, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': content.length,
  }).end(content);
});

const RUNS = [
  { name: 'first @ 1440x900', path: '/?intro&mode=first', width: 1440, height: 900, block: false, mode: 'first' },
  { name: 'first @ 390x844', path: '/?intro&mode=first', width: 390, height: 844, block: false, mode: 'first' },
  { name: 'block @ 1440x900', path: '/?mode=block', width: 1440, height: 900, block: true, mode: 'block' },
  { name: '404 @ 1440x900', path: '/missing?mode=404', width: 1440, height: 900, block: false, mode: '404' },
];

async function runChrome(run, port) {
  currentRun = { ...run, sent404: false };
  const profile = mkdtempSync(join(tmpdir(), 'smoke-'));

  const reportPromise = new Promise((resolve) => {
    resolveReport = resolve;
  });

  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timeout: true }), 90000);
  });

  const url = `http://127.0.0.1:${port}${run.path}`;
  const args = [
    '--headless=new',
    '--no-first-run',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    `--window-size=${run.width},${run.height}`,
    `--user-data-dir=${profile}`,
    url,
  ];

  const chrome = spawn(CHROME, args, { stdio: 'ignore' });
  chrome.on('error', (err) => {
    if (resolveReport) {
      const fn = resolveReport;
      resolveReport = null;
      fn({ error: err });
    }
  });

  const result = await Promise.race([reportPromise, timeoutPromise]);
  clearTimeout(timer);
  resolveReport = null;

  if (chrome.exitCode === null) {
    await new Promise((resolve) => {
      chrome.once('exit', resolve);
      chrome.kill('SIGKILL');
      setTimeout(resolve, 500);
    });
  }
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {}

  return { run: currentRun, result };
}

function check(run, result) {
  const reasons = [];

  if (result.timeout) {
    reasons.push('timeout (90s)');
    return { ok: false, reasons, pins: null };
  }
  if (result.error) {
    reasons.push(result.error.message || String(result.error));
    return { ok: false, reasons, pins: null };
  }

  const r = result;

  if (run.mode !== 'block') {
    if (r.errors?.length > 0) reasons.push(`errors: ${r.errors.join('; ')}`);
  }
  if (r.csp?.length > 0) reasons.push(`csp: ${r.csp.join('; ')}`);

  if (run.mode === 'first') {
    if (r.loading !== false) reasons.push(`loading is ${r.loading}`);
    if (r.gl !== true) reasons.push(`gl is ${r.gl}`);
    if (run.width === 1440 && (r.pins ?? 0) < 3) reasons.push(`pins (${r.pins}) < 3`);
  } else if (run.mode === 'block') {
    if (r.loading !== false) reasons.push(`loading is ${r.loading}`);
  } else if (run.mode === '404') {
    if (!run.sent404) reasons.push('server did not send 404 for /missing');
  }

  return {
    ok: reasons.length === 0,
    reasons,
    pins: r.pins,
  };
}

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

let failed = false;

for (const runConfig of RUNS) {
  const { run, result } = await runChrome(runConfig, port);
  const res = check(run, result);

  const pinText = run.mode === 'first' ? ` (${res.pins ?? 0} pins)` : '';
  if (res.ok) {
    console.log(`ok    ${run.name}${pinText}`);
  } else {
    failed = true;
    console.log(`FAIL  ${run.name}${pinText}: ${res.reasons.join(', ')}`);
  }
}

server.closeAllConnections?.();
server.close();
process.exit(failed ? 1 : 0);
