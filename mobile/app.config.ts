import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tarteb',
  slug: 'tarteb',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tarteb.app',
  },
  android: {
    package: 'com.tarteb.app',
    adaptiveIcon: {
      backgroundColor: '#1565D8',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Tarteb to access your photos for your profile picture.',
        cameraPermission: 'Allow Tarteb to use the camera for your profile picture.',
      },
    ],
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  },
});
