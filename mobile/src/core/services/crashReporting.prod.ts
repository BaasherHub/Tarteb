import type { ComponentType } from 'react';
import { env } from '@/core/config/env';

type SentryRN = {
  init(options: Record<string, unknown>): void;
  wrap<P>(component: ComponentType<P>): ComponentType<P>;
  captureException(error: unknown): void;
  withScope(callback: (scope: { setExtra: (k: string, v: string) => void }) => void): void;
};

// Loaded only when Metro resolves this file (production / EAS). Never imported in dev source.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Sentry = require('@sentry/react-native') as SentryRN;

let initialized = false;

export function initCrashReporting(): void {
  if (initialized || !env.crashReportingEnabled) return;

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
  if (!initialized) return;

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
  return Sentry.wrap(RootComponent);
}
