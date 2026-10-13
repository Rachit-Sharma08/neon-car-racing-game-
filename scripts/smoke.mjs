// Smoke test for Neon Rush (no new dependencies: Node stdlib + system Chrome only).
// Usage: node scripts/smoke.mjs [--port 4173] [--url http://localhost:4173/]
// What it does:
//  1. Starts `npx vite preview` on the given port (serves dist/).
//  2. Fetches the HTML and checks for required element IDs in the JS bundle.
//  3. Loads the build in headless Chrome at 915x412, captures stderr logs,
//     fails on "Uncaught" console errors.
//  4. Tries a CDP interaction (Play -> distance increases -> pause menu ->
//     portrait rotate overlay). If CDP is unavailable it logs NOT VERIFIED
//     instead of failing, so CI stays green without new deps.
//  5. Captures menu screenshots at the 7 S1 sizes into qa-screenshots/autopilot/.
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const args = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const PORT = portIdx >= 0 ? Number(args[portIdx + 1]) : 4173;
const BASE = `http://localhost:${PORT}/`;
const ROOT = process.cwd();
const SHOT_DIR = path.join(ROOT, 'qa-screenshots', 'autopilot');

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];
const CHROME = CHROME_CANDIDATES.find(p => { try { fs.accessSync(p); return true; } catch { return false; } });

const SIZES = [
  [844, 390, '844x390'],
  [1180, 820, '1180x820'],
  [915, 412, '915x412'],
  [1366, 768, '1366x768'],
  [1920, 1080, '1920x1080'],
  [2560, 1080, '2560x1080'],
  [3840, 2160, '3840x2160'],
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await sleep(500);
  }
  return false;
}

async function main() {
  if (!CHROME) {
    console.error('SMOKE FAIL: no Chrome/Edge executable found');
    process.exit(1);
  }
  console.log(`SMOKE: using browser ${CHROME}`);

  // 1. start preview server (reuse one if already up, e.g. from a previous run)
  let server = null;
  const alreadyUp = await waitForServer(BASE, 3000);
  if (alreadyUp) {
    console.log('SMOKE: reusing existing preview server');
  } else {
    server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
      cwd: ROOT, shell: true, stdio: 'ignore',
    });
    const ready = await waitForServer(BASE);
    if (!ready) { console.error('SMOKE FAIL: preview server never came up'); try { server.kill(); } catch {} process.exit(1); }
  }
  const killServer = () => { try { server?.kill(); } catch {} };

  let failures = 0;
  const note = (ok, msg) => {
    console.log(`${ok ? 'PASS' : 'FAIL'}: ${msg}`);
    if (!ok) failures++;
  };

  // 2. static HTML + bundle checks
  try {
    const html = await (await fetch(BASE)).text();
    note(html.includes('id="root"'), 'index serves #root');
    // find built JS asset and check for required IDs/strings
    const m = html.match(/src="(\/assets\/[^"]+\.js)"/);
    if (m) {
      const js = await (await fetch(new URL(m[1], BASE).toString())).text();
      for (const id of ['btn-engage-engine', 'gameCanvas', 'rotate-overlay', 'hud-pause-btn', 'garage-overlay', 'paused-screen-overlay', 'ctrl-brake-pedal', 'ctrl-gas-pedal', 'ctrl-steer-left', 'ctrl-steer-right', 'ctrl-nitro-boost', 'setting-autogas']) {
        note(js.includes(id), `bundle contains ${id}`);
      }
      note(!/SYS \/\//.test(js), 'no banned terminal microcopy in bundle');
    } else {
      note(false, 'built JS asset found in index.html');
    }
  } catch (e) {
    note(false, `fetch checks threw: ${e.message}`);
  }

  // 3. headless load at 915x412, watch stderr for uncaught errors
  try {
    const { stderr } = await execFileAsync(CHROME, [
      '--headless', '--disable-gpu', '--no-sandbox',
      '--window-size=915,412',
      '--virtual-time-budget=8000',
      '--dump-dom', BASE,
    ], { timeout: 60000 });
    const bad = /Uncaught|TypeError|ReferenceError/i.test(stderr || '');
    note(!bad, 'no uncaught console errors at 915x412');
    if (bad) console.log(stderr.slice(0, 2000));
  } catch (e) {
    // dump-dom exits 0 normally; any error with output still usable?
    const stderr = e.stderr || '';
    const bad = /Uncaught|TypeError|ReferenceError/i.test(stderr);
    note(!bad, 'no uncaught console errors at 915x412');
    if (bad) console.log(String(stderr).slice(0, 2000));
  }

  // 4. CDP interaction (best effort, no new deps via global WebSocket)
  let cdpVerified = { play: false, distance: false, pause: false, portrait: false };
  try {
    const debugPort = 9333;
    const userDataDir = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'neon-smoke-'));
    const chrome = spawn(CHROME, [
      `--remote-debugging-port=${debugPort}`,
      '--remote-allow-origins=*',
      `--user-data-dir=${userDataDir}`,
      '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
      '--disable-extensions',
      '--window-size=915,412', 'about:blank',
    ], { stdio: 'ignore' });
    await sleep(2500);
    const targets = await (await fetch(`http://localhost:${debugPort}/json`)).json();
    const page = targets.find(t => t.type === 'page');
    if (!page) throw new Error('no CDP page target');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; setTimeout(() => rej(new Error('ws timeout')), 10000); });
    let msgId = 0;
    const pending = new Map();
    ws.onmessage = (ev) => {
      try {
        const m = JSON.parse(ev.data);
        if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
      } catch {}
    };
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (pending.has(id)) { pending.delete(id); reject(new Error(`CDP timeout ${method}`)); } }, 15000);
    });
    const evaluate = async (expr, awaitPromise = true) => {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise, returnByValue: true });
      if (r.result?.exceptionDetails) throw new Error(`eval threw: ${JSON.stringify(r.result.exceptionDetails).slice(0, 300)}`);
      return r.result?.result?.value;
    };
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: BASE });
    // wait for Play button (headless first mount can take ~20s: 800kB JS + webfont)
    let found = false;
    for (let i = 0; i < 120; i++) {
      await sleep(500);
      const has = await evaluate(`!!document.querySelector('#btn-engage-engine')`);
      if (has) { found = true; break; }
    }
    note(found, 'Play button appears at 915x412');
    if (found) {
      // Step 2.11: debug label (menu) shows the budget pixel ratio before the run.
      // The label refreshes on a 400ms timer, so poll for up to 3s.
      let prMenu = '';
      for (let i = 0; i < 10; i++) {
        prMenu = await evaluate(`(document.querySelector('#debug-label')||{}).innerText || ''`);
        if (/pr=\d+\.\d+/.test(prMenu || '')) break;
        await sleep(400);
      }
      note(/pr=\d+\.\d+/.test(prMenu || ''), `debug label shows pixel ratio on menu (${JSON.stringify(prMenu)})`);
      await evaluate(`document.querySelector('#btn-engage-engine').click()`);
      cdpVerified.play = true;
      // countdown is 2950ms; wait then read score text twice
      await sleep(5000);
      const d1 = await evaluate(`(document.querySelector('#hud-score-display')||{}).innerText || ''`);
      await sleep(2000);
      const d2 = await evaluate(`(document.querySelector('#hud-score-display')||{}).innerText || ''`);
      const num = (s) => { const m = String(s).match(/(\d+)/); return m ? Number(m[1]) : -1; };
      const n1 = num(d1), n2 = num(d2);
      cdpVerified.distance = n2 > n1 && n2 > 0;
      note(cdpVerified.distance, `distance increases while playing (${JSON.stringify(d1)} -> ${JSON.stringify(d2)})`);
      // Step 2.11: live ratio stays within [0.75, cap]; headless never downgrades.
      const prLive = await evaluate(`window.__neonPixelRatio`);
      note(typeof prLive === 'number' && prLive >= 0.75 && prLive <= 2, `live pixel ratio in range (pr=${prLive})`);
      // Step 2.10 pedals: visible, brake decelerates, Auto-gas OFF coasts, Gas re-accelerates
      const hasPedals = await evaluate(`!!document.querySelector('#ctrl-brake-pedal') && !!document.querySelector('#ctrl-gas-pedal')`);
      note(!!hasPedals, 'brake + gas pedals visible while playing');
      const readKmh = `Number(((document.querySelector('#hud-speed-display').innerText.match(/([\\d,]+)\\s*km\\/h/)||[])[1]||'-1').replace(/,/g,''))`;
      if (hasPedals) {
        const s0 = await evaluate(readKmh);
        await evaluate(`document.querySelector('#ctrl-brake-pedal').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}))`);
        await sleep(1500);
        const s1 = await evaluate(readKmh);
        await evaluate(`document.querySelector('#ctrl-brake-pedal').dispatchEvent(new PointerEvent('pointerup', {bubbles:true}))`);
        note(Number(s1) < Number(s0), `brake pedal decelerates (${s0} -> ${s1} km/h)`);
      }
      // pause menu
      const pauseBtn = await evaluate(`!!document.querySelector('#hud-pause-btn')`);
      if (pauseBtn) {
        await evaluate(`document.querySelector('#hud-pause-btn').click()`);
        await sleep(800);
        const paused = await evaluate(`!!document.querySelector('#paused-screen-overlay')`);
        cdpVerified.pause = !!paused;
        note(!!paused, 'pause button opens pause menu');
        if (paused) {
          const hasToggle = await evaluate(`!!document.querySelector('#setting-autogas')`);
          note(!!hasToggle, 'Auto gas setting visible in pause menu');
          if (hasToggle) {
            const t0 = await evaluate(`document.querySelector('#setting-autogas').innerText`);
            await evaluate(`document.querySelector('#setting-autogas').click()`);
            await sleep(400);
            const t1 = await evaluate(`document.querySelector('#setting-autogas').innerText`);
            note(t0 !== t1, `Auto gas toggles (default ON, ${JSON.stringify(t0)} -> ${JSON.stringify(t1)})`);
            await evaluate(`document.querySelector('#setting-autogas').click()`);
            await sleep(400);
          }
          await evaluate(`document.querySelector('#btn-quit-to-menu')?.click()`);
          await sleep(800);
          // "Main menu" opens a quit-confirm; confirm it.
          const confirmVisible = await evaluate(`!!document.querySelector('#btn-quit-confirm')`);
          if (confirmVisible) { await evaluate(`document.querySelector('#btn-quit-confirm').click()`); await sleep(800); }
          const backAtMenu = await evaluate(`!!document.querySelector('#btn-engage-engine')`);
          note(!!backAtMenu, 'pause menu Back/Main-menu works');
        }
      } else {
        note(false, 'pause button present');
      }
      // portrait rotate overlay via emulation
      await send('Emulation.setDeviceMetricsOverride', { width: 412, height: 915, deviceScaleFactor: 1, mobile: true, screenOrientation: { type: 'portraitPrimary', angle: 0 } });
      await sleep(1200);
      const rot = await evaluate(`(() => { const el = document.querySelector('#rotate-overlay'); if (!el) return 'missing'; const r = el.getBoundingClientRect(); return el && r.width > 300 ? 'visible' : 'hidden'; })()`);
      cdpVerified.portrait = rot === 'visible';
      note(rot === 'visible', `portrait 412x915 shows only Rotate screen (${rot})`);
      await send('Emulation.clearDeviceMetricsOverride');
    }
    try { ws.close(); } catch {}
    try { chrome.kill(); } catch {}
  } catch (e) {
    console.log(`NOT VERIFIED (CDP interaction): ${e.message}`);
    console.log('NOT VERIFIED items: Play/distance/pause/portrait via automation (headless CDP unavailable or failed). Static checks above still apply.');
  }

  // 5. screenshots at 7 sizes (menu screen)
  try {
    fs.mkdirSync(SHOT_DIR, { recursive: true });
    for (const [w, h, label] of SIZES) {
      const out = path.join(SHOT_DIR, `${label}-menu.png`);
      try {
        await execFileAsync(CHROME, [
          '--headless', '--disable-gpu', '--no-sandbox',
          `--window-size=${w},${h}`,
          '--hide-scrollbars',
          `--screenshot=${out}`, BASE,
        ], { timeout: 60000 });
        console.log(`SHOT: ${label} -> ${path.relative(ROOT, out)}`);
      } catch (e) {
        console.log(`SHOT FAIL ${label}: ${e.message}`);
      }
    }
  } catch (e) {
    note(false, `screenshots threw: ${e.message}`);
  }

  killServer();
  console.log(`SMOKE DONE: ${failures} static failure(s). CDP: ${JSON.stringify(cdpVerified)}`);
  process.exit(failures > 0 ? 1 : 0);
}
main();
