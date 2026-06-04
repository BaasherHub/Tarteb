import type { ComponentType } from 'react';

/** Dev / no-DSN builds — no @sentry/* in the Metro graph. */
export function initCrashReporting(): void {}

export function captureException(
  error: unknown,
  context?: Record<string, string>,
): void {
  if (__DEV__) {
    console.error('[crash]', error, context);
  }
}

export function wrapWithSentry<P extends Record<string, unknown>>(
  RootComponent: ComponentType<P>,
): ComponentType<P> {
  return RootComponent;
}
