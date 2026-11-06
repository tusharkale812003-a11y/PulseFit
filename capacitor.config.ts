import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pulsefit.workout',
  appName: 'PulseFit',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#090d16'
  }
};

export default config;
