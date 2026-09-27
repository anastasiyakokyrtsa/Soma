import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately.
//
// Native only - see index.web.ts for the web entry (Skia/CanvasKit setup,
// browser-default resets). Metro picks the entry file per platform by its own
// filename convention (index.ios.ts/index.android.ts -> this plain index.ts as
// the native fallback; index.web.ts for web), so this file is never bundled
// together with index.web.ts's require graph - that's the actual fix for a real
// bug found on a real device (2026-09-27): a `Platform.OS === 'web'` runtime
// check here did NOT stop Metro's *dev-server* bundler (unlike `expo export`'s
// production bundle, which does eliminate that branch) from statically
// resolving `@shopify/react-native-skia/lib/module/web` for every platform,
// which pulls in canvaskit-wasm, which does `require('fs')` for a Node-only
// code path Android/iOS have no polyfill for - "Unable to resolve module fs".
registerRootComponent(App);
