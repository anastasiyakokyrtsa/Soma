// Render screens into the thin iPhone frame (Мокапы/phone-thin.html) as transparent PNG @4x.
// Usage: node thin.js "<Мокапы dir>" screen.png=out.png ...
const puppeteer = require('puppeteer-core'); const path = require('path');
const [,, dir, ...pairs] = process.argv;
(async () => { const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.setViewport({ width: 520, height: 1000, deviceScaleFactor: 4 });
  for (const pr of pairs) { const [scr, out] = pr.split('='); await p.goto(`file://${dir}/phone-thin.html?img=${encodeURIComponent(path.join(dir, 'screens', scr))}`, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 400));
    const el = await p.$('#p'); await el.screenshot({ path: `${dir}/thin/${out}`, omitBackground: true }); console.log('ok', out); }
  await b.close(); })();
