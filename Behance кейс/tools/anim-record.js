// Record an HTML animation that exposes window.render(t) as a frame sequence (deterministic, no real-time playback).
// Usage: node anim-record.js page.html outDir seconds [fps=30] [width height] [selector=#s]
const puppeteer = require('puppeteer-core'); const fs = require('fs'); const path = require('path');
const [,, page, out, secs, fps = 30, W = 1920, H = 714, sel = '#s'] = process.argv;
(async () => { fs.mkdirSync(out, { recursive: true });
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.setViewport({ width: +W, height: +H, deviceScaleFactor: 1 });
  await p.goto(page.startsWith('file:') ? page : 'file://' + path.resolve(page.split('?')[0]) + (page.includes('?') ? '?' + page.split('?')[1] : ''), { waitUntil: 'networkidle0' }); await p.waitForFunction(() => window.__ready === true, { timeout: 60000 });
  const el = await p.$(sel), n = Math.round(secs * fps);
  for (let i = 0; i < n; i++) { await p.evaluate(t => window.render(t), i / fps); await el.screenshot({ path: path.join(out, String(i).padStart(5, '0') + '.png') }); }
  console.log('frames', n); await b.close(); })().catch(e => { console.error(e); process.exit(1); });
