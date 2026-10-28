// Screenshot ONE app component as a transparent PNG (stars background hidden), texts swapped to English.
// Usage: node shoot-part.js "<DevMenu label>" dict.json out.png <mode> [dpr]
// mode: mood (onboarding mood picker: label → shape → slider → scale) | ring (Care ResourceRing) | quote (Home QuoteCard)
// Env: CLICK="<leaf text>" clicks the last leaf with that text first (e.g. pick a mood).
const puppeteer = require('puppeteer-core'); const fs = require('fs');
const [,, label, dictPath, out, mode, dpr] = process.argv;
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: mode === 'quote' ? 2600 : 844, deviceScaleFactor: +(dpr || 6) });
  await p.goto('http://localhost:8099', { waitUntil: 'networkidle0', timeout: 180000 });
  await p.waitForFunction(l => [...document.querySelectorAll('div')].some(d => d.textContent === l), { timeout: 90000 }, label);
  await p.evaluate(l => [...document.querySelectorAll('div')].find(d => d.textContent === l).click(), label);
  await new Promise(r => setTimeout(r, 3000));
  if (process.env.CLICK) {
    await p.evaluate(t => { const els = [...document.querySelectorAll('div')].filter(d => d.textContent === t && d.children.length === 0); const el = els[els.length - 1]; el && el.click(); }, process.env.CLICK);
    await new Promise(r => setTimeout(r, 1500));
  }
  const box = await p.evaluate((dict, mode) => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const ns = []; let n; while ((n = w.nextNode())) ns.push(n);
    for (const x of ns) { const t = x.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); if (dict[t]) x.textContent = dict[t]; }
    document.querySelectorAll('svg').forEach(s => { if (s.querySelectorAll('circle').length > 40) s.style.visibility = 'hidden'; });
    document.querySelectorAll('canvas').forEach(c => c.style.visibility = 'hidden');
    document.querySelectorAll('*').forEach(e => { if (getComputedStyle(e).backgroundColor === 'rgb(5, 8, 22)') e.style.backgroundColor = 'transparent'; });
    document.documentElement.style.background = 'transparent'; document.body.style.background = 'transparent';
    const leaves = t => [...document.querySelectorAll('div')].filter(d => d.textContent.trim() === t && d.children.length === 0);
    const R = e => e.getBoundingClientRect();
    if (mode === 'mood') {
      const labels = ['Awful', 'Great'].map(t => leaves(t)).flat();
      const lt = Math.min(...labels.map(l => R(l).top)), lb = Math.max(...labels.map(l => R(l).bottom));
      const top = lt - 350; return { x: 0, y: top, width: 390, height: lb + 16 - top };
    }
    if (mode === 'ring') { let e = leaves('42')[0]; while (e && R(e).width < 200) e = e.parentElement; const r = R(e); const pad = 60; return { x: r.left - pad, y: r.top - pad, width: r.width + 2 * pad, height: r.height + 2 * pad }; }
    if (mode === 'quote') {
      // the card is nearly full-width, so its glow doesn't fit in 390pt: pin it (same size) and widen the viewport afterwards
      let e = leaves('Confucius')[0]; while (e && !(parseFloat(getComputedStyle(e).borderTopLeftRadius) > 10)) e = e.parentElement;
      const r = R(e), pad = 80; let g = e; while (g.parentElement && getComputedStyle(g).boxShadow === 'none' && R(g.parentElement).width < r.width + 40) g = g.parentElement;
      const gr = R(g), dx = r.left - gr.left, dy = r.top - gr.top;
      Object.assign(g.style, { position: 'fixed', left: pad - dx + 'px', top: pad - dy + 'px', width: gr.width + 'px', height: gr.height + 'px', margin: 0, zIndex: 9999 });
      document.body.style.visibility = 'hidden'; g.style.visibility = 'visible';
      window.__shadow = getComputedStyle(g).boxShadow + ' | ' + getComputedStyle(e).boxShadow;
      return { x: 0, y: 0, width: r.width + 2 * pad, height: r.height + 2 * pad, wide: true };
    }
  }, dict, mode);
  if (box.wide) { delete box.wide; await p.setViewport({ width: Math.ceil(box.width), height: 2600, deviceScaleFactor: +(dpr || 6) }); console.log('shadow', await p.evaluate(() => window.__shadow)); }
  else { box.width -= Math.max(0, -box.x); box.x = Math.max(0, box.x); box.width = Math.min(box.width, 390 - box.x); }
  await new Promise(r => setTimeout(r, 800));
  await p.screenshot({ path: out, clip: box, omitBackground: true }); console.log(mode, JSON.stringify(box)); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
