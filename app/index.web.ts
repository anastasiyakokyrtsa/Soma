import { registerRootComponent } from 'expo';

// Web entry only - Metro resolves `index.web.ts` in place of `index.ts` for web
// bundles by filename convention alone, so nothing here is ever reachable from
// a native bundle's dependency graph (see index.ts's comment for why that
// separation, not a runtime `Platform.OS` check, is what actually keeps
// Android/iOS from trying to resolve web-only modules like canvaskit-wasm).
//
// Skia draws through CanvasKit compiled to WASM, which has to be fetched and
// initialised *before* any module touching Skia is evaluated - hence App is
// required lazily, after LoadSkiaWeb resolves, instead of a top-level import.
// public/canvaskit.wasm is the copy served next to index.html (what
// `npx setup-skia-web` would produce; resolved against the page URL because
// the site lives under a sub-path, see app.json baseUrl).
const reset = document.createElement('style');
// Browser defaults that a phone app doesn't have: focus rings (Chrome's blue
// ring on inputs, Safari's on anything focusable), the grey/blue tap flash on
// touch, text selection when dragging, double-tap zoom, rubber-band overscroll.
// Inputs stay selectable. (Keyboard focus visibility is given up on purpose -
// this is a design preview, not a public site.)
reset.textContent = `
  * { -webkit-tap-highlight-color: transparent; }
  :focus, :focus-visible { outline: none !important; }
  html, body { overscroll-behavior: none; }
  body { touch-action: manipulation; -webkit-touch-callout: none; }
  body * { -webkit-user-select: none !important; user-select: none !important; }
  input, textarea { -webkit-user-select: text !important; user-select: text !important; }
`;
document.head.appendChild(reset);

const { LoadSkiaWeb } = require('@shopify/react-native-skia/lib/module/web');
LoadSkiaWeb({ locateFile: (file: string) => new URL(file, document.baseURI).toString() }).then(() => {
  registerRootComponent(require('./App').default);
});
