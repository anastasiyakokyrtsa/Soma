"""Composite recorded app frames into the thin phone frame on a dark 1920×1080 canvas, add soft tap rings,
crossfade between segments, and write numbered PNGs for ffmpeg.
Usage: python3 compose_video.py overlay.png out_dir seg1_dir[:start:end] seg2_dir[:start:end] ... (crossfade 15 frames)
Optional env CAPTIONS=file.json: step captions beside the phone, the current step lit, the rest quiet."""
import json, os, sys, math
from PIL import Image, ImageDraw, ImageChops, ImageFont
ov_path, out = sys.argv[1], sys.argv[2]; segs = sys.argv[3:]
ov = Image.open(ov_path).convert('RGBA'); R = json.load(open(ov_path.replace('.png', '.json')))
W, H, BG, XF = 1920, 1080, (5, 8, 22, 255), 15
px, py = round((W - ov.width) / 2), round((H - ov.height) / 2)
sw, sh = round(R['w']), round(R['h']); sx, sy = round(R['x']), round(R['y'])
mask = Image.new('L', (sw * 3, sh * 3), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw * 3 - 1, sh * 3 - 1], radius=R['radius'] * 3, fill=255); mask = mask.resize((sw, sh), Image.LANCZOS)
os.makedirs(out, exist_ok=True)
def load(spec):
    d, *rng = spec.split(':'); fs = sorted(f for f in os.listdir(d) if f.endswith('.png')); a = int(rng[0]) if rng else 0; b = int(rng[1]) if len(rng) > 1 else len(fs)
    taps = json.load(open(os.path.join(d, 'taps.json'))) if os.path.exists(os.path.join(d, 'taps.json')) else {'taps': []}
    return [(os.path.join(d, fs[i]), [t for t in taps['taps'] if 0 <= i - t['frame'] < 14 for t in [dict(t, age=i - t['frame'])]]) for i in range(a, b)]
def screen(path, taps):
    im = Image.open(path).convert('RGBA'); s = sw / 390  # app css px → screen px
    if taps:
        layer = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(layer); k = im.width / 390
        for t in taps:
            p = t['age'] / 13; r = (16 + 22 * p) * k; a = int(150 * (1 - p) ** 1.5); cx, cy = t['x'] * k, t['y'] * k
            dr.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, a // 5), outline=(255, 255, 255, a), width=max(1, round(1.5 * k)))
        im = Image.alpha_composite(im, layer)
    return im.resize((sw, sh), Image.LANCZOS)
CAP = json.load(open(os.environ['CAPTIONS'])) if os.environ.get('CAPTIONS') else None
if CAP:
    FN = {k: ImageFont.truetype(v, CAP['size'][k]) for k, v in CAP['fonts'].items()}
def mix(a, b, t): return tuple(round(x + (y - x) * t) for x, y in zip(a, b))
def captions(c, n):
    if not CAP: return
    d = ImageDraw.Draw(c); lit, dim = (228, 225, 242), (69, 74, 99); sub_lit, sub_dim = (110, 115, 144), (52, 56, 78)
    for st in CAP['steps']:
        on = 1.0 if st['start'] <= n < st['end'] else 0.0
        fade = 10
        if st['start'] <= n < st['start'] + fade: on = (n - st['start']) / fade
        elif st['end'] - fade <= n < st['end'] and not st.get('last'): on = (st['end'] - n) / fade
        x, y, al = st['x'], st['y'], st['align']
        for txt, f, col, dy in [(st['n'], 'num', mix(dim, (168, 156, 248), on), 0), (st['title'], 'title', mix(dim, lit, on), 34), (st['sub'], 'sub', mix(sub_dim, sub_lit, on), 82)]:
            w = d.textlength(txt, font=FN[f]); d.text((x - w if al == 'right' else x, y + dy), txt, font=FN[f], fill=col)
def frame(scr, n=0):
    c = Image.new('RGBA', (W, H), BG); c.paste(scr, (px + sx, py + sy), mask); c.alpha_composite(ov, (px, py)); captions(c, n); return c.convert('RGB')
seqs = [load(s) for s in segs]; n = 0
for si, seq in enumerate(seqs):
    body = seq if si == len(seqs) - 1 else seq[:-XF]
    start = XF if si > 0 else 0
    for path, taps in body[start:]:
        frame(screen(path, taps), n).save(os.path.join(out, f'{n:05d}.png')); n += 1
    if si < len(seqs) - 1:
        a, b = seq[-XF:], seqs[si + 1][:XF]
        for j in range(XF):
            t = (j + 1) / (XF + 1); t = t * t * (3 - 2 * t)
            fa, fb = frame(screen(*a[j]), n), frame(screen(*b[j]), n); Image.blend(fa, fb, t).save(os.path.join(out, f'{n:05d}.png')); n += 1
print('frames', n)
