import { LogBox, Platform } from 'react-native';

/** Suppress FCM native warning when google-services.json is not in the dev client build. */
if (Platform.OS !== 'web') {
  LogBox.ignoreLogs([
    /Unable to get Firebase Messaging/i,
    /Default FirebaseApp is not initialized/i,
    /googleServices/i,
    /Firebase Messaging/i,
  ]);
}

import { registerRootComponent } from 'expo';
import App from './App';
import {
  initCrashReporting,
  wrapWithSentry,
} from '@/core/services/crashReporting';

initCrashReporting();
registerRootComponent(wrapWithSentry(App));
