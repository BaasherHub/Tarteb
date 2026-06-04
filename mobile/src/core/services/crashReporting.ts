import type { ComponentType } from 'react';
import { env } from '@/core/config/env';

type SentryModule = typeof import('@sentry/react-native');

let sentryModule: SentryModule | null = null;
let initialized = false;

function getSentry(): SentryModule | null {
  if (!env.crashReportingEnabled) return null;
  if (!sentryModule) {
    // Lazy load so dev bundles never pull @sentry/* (avoids Metro tracing path issues).
    sentryModule = require('@sentry/react-native') as SentryModule;
  }
  return sentryModule;
}

/** Production-only when EXPO_PUBLIC_SENTRY_DSN is set. No-op in __DEV__. */
export function initCrashReporting(): void {
  const Sentry = getSentry();
  if (!Sentry || initialized) return;

  Sentry.init({
    dsn: env.crashReportingDsn,
    enabled: true,
    debug: false,
    attachStacktrace: true,
    enableAutoSessionTracking: true,
    enableAutoPerformanceTracing: false,
    tracesSampleRate: 0,
  });

  initialized = true;
}

export function captureException(
  error: unknown,
  context?: Record<string, string>,
): void {
  if (__DEV__) {
    console.error('[crash]', error, context);
    return;
  }

  const Sentry = getSentry();
  if (!Sentry || !initialized) return;

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

export function wrapWithSentry<P extends Record<string, unknown>>(
  RootComponent: ComponentType<P>,
): ComponentType<P> {
  if (!env.crashReportingEnabled) return RootComponent;

  const Sentry = getSentry();
  if (!Sentry) return RootComponent;

  return Sentry.wrap(RootComponent) as ComponentType<P>;
}
