"""Key the magenta screen out of a phone-overlay PNG, keeping the white status bar and the black island with soft edges."""
import sys, numpy as np
from PIL import Image
p = sys.argv[1]; a = np.asarray(Image.open(p).convert('RGBA')).astype(float)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3] / 255
mag = (np.minimum(r, b) - g > 50) & (np.abs(r - b) < 90)  # pixels touched by the magenta screen (grey frame pixels have g≈r≈b and stay)
alpha = np.clip(np.maximum(g / 255, 1 - np.minimum(r, b) / 255), 0, 1)  # white text: g; black island: 1-r
fg = np.clip((a[..., :3] - (1 - alpha)[..., None] * np.array([255, 0, 255])) / np.maximum(alpha, 1e-4)[..., None], 0, 255)
out = a.copy(); out[..., :3] = np.where(mag[..., None], fg, a[..., :3]); out[..., 3] = np.where(mag, alpha * al * 255, a[..., 3])
Image.fromarray(out.round().astype('uint8')).save(p)
