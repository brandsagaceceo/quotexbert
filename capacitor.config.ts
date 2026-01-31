import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quotexbert.app',
  appName: 'QuoteXbert',
  webDir: 'out', // Not used since we're using server.url
  server: {
    url: 'https://www.quotexbert.com', // Points to production website
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f87171",
      showSpinner: false
    }
  }
};

export default config;
