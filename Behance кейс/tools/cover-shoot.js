// Render Behance project cover options: node cover-shoot.js page.html outDir id1,id2,... → outDir/cover-<id>.png (1616×1264) + feed.png
const puppeteer = require('puppeteer-core');
(async () => { const [,, page, out, ids] = process.argv;
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.setViewport({ width: 1700, height: 1400 });
  await p.goto('file://' + page + '?full=1', { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready);
  for (const id of ids.split(',')) { const el = await p.$('#' + id); await el.screenshot({ path: out + '/cover-' + id + '.png' }); }
  const q = await b.newPage(); await q.setViewport({ width: 2200, height: 900 }); await q.goto('file://' + page, { waitUntil: 'networkidle0' });
  const f = await q.$('#feed'); await f.screenshot({ path: out + '/feed.png' }); await b.close(); })();
