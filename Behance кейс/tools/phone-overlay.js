// Render the thin iPhone frame (Мокапы/phone-thin.html) with a TRANSPARENT screen, at a given phone height,
// and report the screen rect + corner radius, so video frames can be slotted underneath it.
// Usage: node phone-overlay.js <Мокапы dir> <phoneHeightPx> <screenAspect w/h> out.png
const puppeteer = require('puppeteer-core'); const path = require('path'); const fs = require('fs');
const [,, dir, hPx, aspect, out] = process.argv;
(async () => { const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); const scrW = 377, phoneCssH = scrW / +aspect + 2 * (9 + 2.5), k = +hPx / phoneCssH;
  await p.setViewport({ width: 520, height: 1100, deviceScaleFactor: k });
  const blank = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${1000 / +aspect}"/>`);
  await p.goto(`file://${dir}/phone-thin.html?img=${encodeURIComponent(blank)}`, { waitUntil: 'networkidle0' });
  await p.addStyleTag({ content: '.scr{background:#FF00FF!important} .scr img{opacity:0}' }); // magenta screen, keyed out afterwards
  const r = await p.evaluate(() => { const ph = document.getElementById('p').getBoundingClientRect(), s = document.querySelector('.scr').getBoundingClientRect(); return { x: s.left - ph.left, y: s.top - ph.top, w: s.width, h: s.height, pw: ph.width, ph: ph.height }; });
  const el = await p.$('#p'); await el.screenshot({ path: out, omitBackground: true });
  require('child_process').execFileSync('python3', [require('path').join(__dirname, 'key_magenta.py'), out]);
  const res = { k, x: r.x * k, y: r.y * k, w: r.w * k, h: r.h * k, radius: 52.5 * k, pw: r.pw * k, ph: r.ph * k };
  fs.writeFileSync(out.replace(/\.png$/, '.json'), JSON.stringify(res)); console.log(JSON.stringify(res)); await b.close(); })();
