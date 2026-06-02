import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.couchbase.grocery.ionic',
  appName: 'Grocery Inventory',
  webDir: 'dist',
  // Serve the WKWebView from https://localhost instead of capacitor://localhost.
  // The default capacitor:// scheme is a custom URL scheme that some CDNs
  // (S3, Cloudinary) treat as an unknown origin and reject image GETs from.
  // Using https://localhost makes the WebView present as a normal HTTPS origin
  // and avoids hotlink-protection-style rejections.
  server: {
    iosScheme: 'https',
    androidScheme: 'https',
  },
};

export default config;
