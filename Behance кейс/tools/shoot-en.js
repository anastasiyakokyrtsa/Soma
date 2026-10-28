// Shoot an app screen (via the DevMenu of the local Expo web build) with a real iPhone top inset,
// Russian texts swapped from a JSON dictionary. App code is untouched.
// Usage: node shoot-en.js "<DevMenu label>" dict.json out.png [dpr]
// Env: CLICK may list several leaf texts separated by '|' · HIDEMOOD=1 (hide Home mood card) · SCROLLTO="<leaf text>|<px below status bar>" · CLICK="<leaf text>" · WHEEL="d,m,y" (wheel picker rows)
//      SWAPIMG="<src substring>=<png path>[;…]" (show a higher-res original in place of an app image, in the browser only)
const puppeteer = require('puppeteer-core'); const fs = require('fs');
const [,, label, dictPath, out, dpr] = process.argv;
const dict = dictPath ? JSON.parse(fs.readFileSync(dictPath, 'utf8')) : {};
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: +(dpr || 6) });
  await p.goto('http://localhost:8099', { waitUntil: 'networkidle0', timeout: 180000 });
  await p.addStyleTag({ content: 'html,body{background:#050816!important} #root{position:absolute!important;top:47px!important;left:0;right:0;height:calc(100% - 47px)!important}' });
  await p.waitForFunction(l => [...document.querySelectorAll('div')].some(d => d.textContent === l), { timeout: 90000 }, label);
  await p.evaluate(l => [...document.querySelectorAll('div')].find(d => d.textContent === l).click(), label);
  await new Promise(r => setTimeout(r, 3000));
  if (process.env.CLICK) { for (const t of process.env.CLICK.split('|')) { await p.evaluate(t => { const els = [...document.querySelectorAll('div')].filter(d => d.textContent === t && d.children.length === 0); const el = els[els.length - 1]; el && el.click(); }, t); await new Promise(r => setTimeout(r, 900)); } }
  if (process.env.HIDEMOOD) await p.evaluate(() => { const leaf = t => [...document.querySelectorAll('div')].find(d => d.textContent === t && d.children.length === 0); let c = leaf('Как ты сегодня?'); const h = leaf('Биоритмы'); while (c.parentElement && !c.parentElement.contains(h)) c = c.parentElement; c.style.setProperty('display', 'none', 'important'); });
  if (process.env.SCROLLTO) { const [txt, off] = process.env.SCROLLTO.split('|'); await p.evaluate((txt, off) => { const el = [...document.querySelectorAll('div')].find(d => d.textContent === txt && d.children.length === 0); let sc = el.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement; sc.scrollTop += el.getBoundingClientRect().top - (47 + Number(off)); }, txt, off); await new Promise(r => setTimeout(r, 1200)); }
  if (process.env.WHEEL) { const target = process.env.WHEEL.split(',').map(Number); await p.evaluate(target => { const sc = [...document.querySelectorAll('div')].filter(d => d.scrollHeight > d.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(d).overflowY) && d.clientHeight < 400); sc.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left); sc.forEach((d, i) => { d.scrollTop = target[i] * 44; d.dispatchEvent(new Event('scroll')); }); }, target); await new Promise(r => setTimeout(r, 1500)); }
  if (process.env.SWAPIMG) { for (const pair of process.env.SWAPIMG.split(';')) { const [sub, file] = pair.split('='); const data = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    const n = await p.evaluate((sub, data) => { let n = 0; document.querySelectorAll('*').forEach(e => { const bg = e.style.backgroundImage; if (bg && bg.includes(sub)) { e.style.backgroundImage = `url("${data}")`; n++; } });
      document.querySelectorAll('img').forEach(i => { if (i.src.includes(sub)) { i.src = data; n++; } }); return n; }, sub, data); console.log('swapped', sub, n); }
    await new Promise(r => setTimeout(r, 1500)); }
  const res = await p.evaluate(dict => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const ns = []; let n; while ((n = w.nextNode())) ns.push(n);
    let swapped = 0; const miss = []; for (const x of ns) { const t = x.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); if (dict[t]) { x.textContent = dict[t]; swapped++; } else if (/[А-Яа-яЁё]/.test(t)) { const r = x.parentElement.getBoundingClientRect(); if (r.width && r.top < 844 && r.bottom > 0) miss.push(t.slice(0, 40)); } }
    return { swapped, miss }; }, dict);
  console.log(JSON.stringify(res)); await new Promise(r => setTimeout(r, 1200));
  await p.screenshot({ path: out }); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
