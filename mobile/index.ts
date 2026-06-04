import { registerRootComponent } from 'expo';
import App from './App';
import {
  initCrashReporting,
  wrapWithSentry,
} from '@/core/services/crashReporting';

initCrashReporting();
registerRootComponent(wrapWithSentry(App));
