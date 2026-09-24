import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
//
// Web only (shareable link): Skia draws through CanvasKit compiled to WASM, which
// has to be fetched and initialised *before* any module touching Skia is
// evaluated - hence App is required lazily, after LoadSkiaWeb resolves, instead
// of a top-level import. public/canvaskit.wasm is the copy served next to
// index.html (what `npx setup-skia-web` would produce; resolved against the
// page URL because the site lives under a sub-path, see app.json baseUrl). Native platforms
// take the unchanged direct path.
if (Platform.OS === 'web') {
  // Browser defaults that a phone app doesn't have: focus rings (Chrome's blue
  // ring on inputs, Safari's on anything focusable), the grey/blue tap flash on
  // touch, text selection when dragging, double-tap zoom, rubber-band overscroll.
  // Inputs stay selectable. (Keyboard focus visibility is given up on purpose -
  // this is a design preview, not a public site.)
  const reset = document.createElement('style');
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
} else {
  registerRootComponent(require('./App').default);
}
