import type { ComponentType } from 'react';

/**
 * Metro must not statically resolve @sentry/react-native in dev.
 * __DEV__ is inlined at bundle time so only one implementation is included.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const impl = __DEV__
  ? require('./crashReporting.stub')
  : require('./crashReporting.prod');

export const initCrashReporting: () => void = impl.initCrashReporting;

export const captureException: (
  error: unknown,
  context?: Record<string, string>,
) => void = impl.captureException;

export const wrapWithSentry: <P extends Record<string, unknown>>(
  RootComponent: ComponentType<P>,
) => ComponentType<P> = impl.wrapWithSentry;
