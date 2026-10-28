// Record a scripted walk through the real app (local Expo web build) as a frame sequence, deterministically.
// Time is virtualised: rAF, timers, performance.now/Date.now and CSS animations advance only when we step,
// so every frame is exactly 1/FPS apart and nothing stutters. Russian text is swapped to English live.
// Usage: node record.js <script.json> <outDir>   (script: { start, dict:[...], fps, dpr, steps:[...] })
const puppeteer = require('puppeteer-core'); const fs = require('fs'); const path = require('path');
const [,, scriptPath, outDir] = process.argv;
const S = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const FPS = S.fps || 30, DT = 1000 / FPS;
const dict = Object.assign({}, ...S.dict.map(f => JSON.parse(fs.readFileSync(path.resolve(path.dirname(scriptPath), f), 'utf8'))));
fs.mkdirSync(outDir, { recursive: true });

const CLOCK = `(() => {
  const R = { st: window.setTimeout.bind(window), ct: window.clearTimeout.bind(window), si: window.setInterval.bind(window), ci: window.clearInterval.bind(window),
    raf: window.requestAnimationFrame.bind(window), caf: window.cancelAnimationFrame.bind(window), pn: performance.now.bind(performance), dn: Date.now };
  let manual = false, now = 0, d0 = 0, seq = 1; const timers = new Map(), rafs = new Map();
  window.__clock = {
    start() { manual = true; now = R.pn(); d0 = R.dn() - now; },
    get now() { return now; },
    step(ms) { const end = now + ms;
      for (;;) { let best = null; for (const [id, t] of timers) if (t.at <= end && (!best || t.at < best[1].at)) best = [id, t];
        if (!best) break; const [id, t] = best; now = t.at; if (t.every) t.at += t.every; else timers.delete(id); try { t.fn(...t.args); } catch (e) { console.error(e); } }
      now = end; const cbs = [...rafs.values()]; rafs.clear(); for (const cb of cbs) { try { cb(now); } catch (e) { console.error(e); } }
      for (const a of document.getAnimations()) { if (a.__v0 === undefined) a.__v0 = now - (a.currentTime || 0); a.pause(); a.currentTime = now - a.__v0; } }
  };
  performance.now = () => manual ? now : R.pn();
  Date.now = () => manual ? Math.floor(d0 + now) : R.dn();
  window.setTimeout = (fn, d = 0, ...args) => { if (!manual || typeof fn !== 'function') return R.st(fn, d, ...args); const id = -(seq++); timers.set(id, { at: now + Math.max(0, +d || 0), fn, args }); return id; };
  window.setInterval = (fn, d = 0, ...args) => { if (!manual || typeof fn !== 'function') return R.si(fn, d, ...args); const id = -(seq++); const e = Math.max(1, +d || 0); timers.set(id, { at: now + e, every: e, fn, args }); return id; };
  window.clearTimeout = window.clearInterval = id => { if (typeof id === 'number' && id < 0) timers.delete(id); else { R.ct(id); R.ci(id); } };
  window.requestAnimationFrame = fn => { if (!manual) return R.raf(fn); const id = -(seq++); rafs.set(id, fn); return id; };
  window.cancelAnimationFrame = id => { if (typeof id === 'number' && id < 0) rafs.delete(id); else R.caf(id); };
})();`;

(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: S.dpr || 2 });
  await p.evaluateOnNewDocument(CLOCK);
  await p.goto('http://localhost:8099', { waitUntil: 'networkidle0', timeout: 180000 });
  await p.addStyleTag({ content: 'html,body{background:#050816!important} #root{position:absolute!important;top:47px!important;left:0;right:0;height:calc(100% - 47px)!important}' });
  // live translation
  await p.evaluate(d => { const norm = s => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    const fix = n => { if (n.nodeType === 3) { const k = norm(n.textContent); if (d[k] && n.textContent !== d[k]) n.textContent = d[k]; } else n.childNodes && n.childNodes.forEach(fix); };
    window.__fix = () => fix(document.body); new MutationObserver(ms => ms.forEach(m => { m.addedNodes.forEach(fix); if (m.type === 'characterData') fix(m.target); })).observe(document.body, { childList: true, subtree: true, characterData: true }); }, dict);
  const leaf = async (t, last = false) => p.evaluateHandle((t, last) => { const norm = s => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim(); const els = [...document.querySelectorAll('body *')].filter(d => norm(d.textContent) === norm(t) && d.children.length === 0 && d.getBoundingClientRect().width > 0); return last ? els[els.length - 1] : els[0]; }, t, last);
  await p.evaluate(l => [...document.querySelectorAll('div')].find(d => d.textContent === l).click(), S.start);
  await new Promise(r => setTimeout(r, 2500)); await p.evaluate(() => window.__fix());
  await p.evaluate(() => window.__clock.start());
  let frame = 0; const taps = [];
  const shoot = async () => { await new Promise(r => setTimeout(r, 25)); await p.evaluate(() => window.__fix());
    await p.screenshot({ path: path.join(outDir, String(frame).padStart(5, '0') + '.png') }); frame++; };
  const advance = async (ms, perFrame) => { const n = Math.round(ms / DT); for (let i = 0; i < n; i++) { if (perFrame) await perFrame(i / Math.max(1, n - 1)); await p.evaluate(dt => window.__clock.step(dt), DT); await shoot(); } };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  for (const st of S.steps) {
    if (st.hold) await advance(st.hold);
    if (st.scroll) { const [anchor, dist, ms] = st.scroll;
      const start = await p.evaluate(a => { const el = [...document.querySelectorAll('div')].filter(d => d.textContent.trim() === a && d.children.length === 0 && d.getBoundingClientRect().width > 0).pop(); let sc = el.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement; window.__sc = sc; return sc.scrollTop; }, anchor);
      await advance(ms, async t => p.evaluate(y => { window.__sc.scrollTop = y; }, start + dist * ease(t))); }
    if (st.tap || st.tapXY) { let x, y; if (st.tapXY) [x, y] = st.tapXY; else { const h = await leaf(st.tap, st.last); const el = h.asElement(); const box = el && await el.boundingBox(); if (!box) throw new Error('no element ' + st.tap);
      x = box.x + box.width / 2 + (st.dx || 0); y = box.y + box.height / 2 + (st.dy || 0); } taps.push({ frame, x, y });
      await p.mouse.move(x, y); await p.mouse.down(); await advance(90); await p.mouse.up(); }
  }
  fs.writeFileSync(path.join(outDir, 'taps.json'), JSON.stringify({ fps: FPS, dpr: S.dpr || 2, taps }));
  console.log('frames', frame); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
