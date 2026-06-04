/**
 * Crash reporting facade — dev always uses stub (no @sentry in Metro graph).
 * Production EAS bundles resolve this file to crashReporting.prod.ts via metro.config.js.
 */
export {
  initCrashReporting,
  captureException,
  wrapWithSentry,
} from './crashReporting.stub';
