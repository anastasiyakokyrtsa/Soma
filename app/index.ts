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
  const { LoadSkiaWeb } = require('@shopify/react-native-skia/lib/module/web');
  LoadSkiaWeb({ locateFile: (file: string) => new URL(file, document.baseURI).toString() }).then(() => {
    registerRootComponent(require('./App').default);
  });
} else {
  registerRootComponent(require('./App').default);
}
