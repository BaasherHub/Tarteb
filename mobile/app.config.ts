import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tarteb',
  slug: 'tarteb',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'tarteb',
  icon: './assets/icon.png',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.tarteb.app',
    buildNumber: '1',
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      UIBackgroundModes: ['remote-notification'],
    },
  },
  android: {
    package: 'com.tarteb.app',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#1565D8',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    permissions: [
      'INTERNET',
      'CAMERA',
      'READ_MEDIA_IMAGES',
      'READ_EXTERNAL_STORAGE',
      'POST_NOTIFICATIONS',
      'VIBRATE',
    ],
  },
  locales: {
    en: './locales/en.json',
    ar: './locales/ar.json',
  },
  plugins: [
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#1565D8',
      },
    ],
    [
      'expo-localization',
      {
        supportedLocales: {
          ios: ['en', 'ar'],
          android: ['en', 'ar'],
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow Tarteb to access your photos for your profile picture.',
        cameraPermission:
          'Allow Tarteb to use the camera for your profile picture.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/android-icon-monochrome.png',
        color: '#1565D8',
      },
    ],
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    supportsRTL: true,
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '',
    },
  },
});
