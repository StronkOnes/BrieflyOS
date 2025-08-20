import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.briefly.ai',
  appName: 'brieflyai---complete-business-automation-os',
  webDir: 'build',
  server: {
    // For development - allows connecting to local API
    cleartext: true,
    androidScheme: 'http',
    allowNavigation: ['192.168.18.4:5000', 'localhost:5000']
  }
};

export default config;
