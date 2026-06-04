/**
 * Lightweight analytics facade — wire to Expo Insights, PostHog, or Firebase
 * by setting EXPO_PUBLIC_ANALYTICS_ENABLED=true and implementing the TODOs.
 */
import { env } from '@/core/config/env';

type EventProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, props?: EventProps): void {
  if (__DEV__) {
    console.debug('[analytics]', name, props ?? {});
  }
  if (!env.analyticsEnabled) return;
  // TODO: send to your analytics provider
}

export function trackScreen(screenName: string): void {
  trackEvent('screen_view', { screen: screenName });
}
