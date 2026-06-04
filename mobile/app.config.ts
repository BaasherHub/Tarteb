import { ExpoConfig, ConfigContext } from 'expo/config';

const BRAND_PRIMARY = '#1A6FFF';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tarteb',
  slug: 'tarteb',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'tarteb',
  icon: './assets/icon.png',
  description:
    'Tarteb connects UAE employers with blue-collar job seekers — browse candidates, unlock contacts, and hire faster.',
  primaryColor: BRAND_PRIMARY,
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.tarteb.app',
    buildNumber: '1',
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      UIBackgroundModes: ['remote-notification'],
      NSPhotoLibraryUsageDescription:
        'Tarteb uses your photo library so you can add a profile picture.',
      NSCameraUsageDescription:
        'Tarteb uses the camera so you can take a profile picture.',
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.tarteb.app',
    versionCode: 1,
    softwareKeyboardLayoutMode: 'resize',
    adaptiveIcon: {
      backgroundColor: BRAND_PRIMARY,
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
    '@sentry/react-native',
    'expo-dev-client',
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: BRAND_PRIMARY,
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
        color: BRAND_PRIMARY,
      },
    ],
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    supportsRTL: true,
    privacyPolicyUrl:
      process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? 'https://tarteb.app/privacy',
    eas: {
      projectId:
        process.env.EAS_PROJECT_ID ?? '626b8ae5-2553-487f-bddf-76ce3015191c',
    },
  },
});
