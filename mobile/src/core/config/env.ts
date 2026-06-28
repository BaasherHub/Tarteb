import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as
  | {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
      apiUrl?: string;
      privacyPolicyUrl?: string;
    }
  | undefined;

const isProductionJsBundle = process.env.NODE_ENV === 'production';
const allowInternalTestFlags =
  !isProductionJsBundle ||
  (typeof __DEV__ !== 'undefined' && __DEV__);

/**
 * Dev-only flags — never true in release builds regardless of env vars.
 * @see validateProductionConfig()
 */
export const env = {
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra?.supabaseUrl ?? '',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra?.supabaseAnonKey ?? '',
  apiUrl:
    process.env.EXPO_PUBLIC_API_URL ?? extra?.apiUrl ?? 'https://tarteb-production.up.railway.app',
  /**
   * OTP bypass for internal/preview testing. Never active in release bundles,
   * even if a production environment is misconfigured.
   */
  skipOtpVerification:
    allowInternalTestFlags && process.env.EXPO_PUBLIC_SKIP_OTP_VERIFICATION === 'true',
  showDevOtpBanner:
    allowInternalTestFlags && process.env.EXPO_PUBLIC_SKIP_OTP_VERIFICATION === 'true',
  analyticsEnabled: process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === 'true',
  crashReportingDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  /** Sentry runs in release builds when DSN is set (disabled in __DEV__). */
  crashReportingEnabled:
    typeof __DEV__ !== 'undefined' &&
    !__DEV__ &&
    Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN?.trim()),
  privacyPolicyUrl:
    process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ??
    extra?.privacyPolicyUrl ??
    'https://tarteb.app/privacy',
  isDevelopment: typeof __DEV__ !== 'undefined' && __DEV__ === true,
};

export function assertEnv(): void {
  if (!env.apiUrl) {
    throw new Error('Set EXPO_PUBLIC_API_URL in mobile/.env');
  }
}

/** Call on startup; logs critical misconfiguration in release builds. */
export function validateProductionConfig(): string[] {
  const issues: string[] = [];

  if (env.isDevelopment) return issues;

  if (env.skipOtpVerification) {
    issues.push('EXPO_PUBLIC_SKIP_OTP_VERIFICATION must not be set in production');
  }

  if (!env.apiUrl) {
    issues.push('EXPO_PUBLIC_API_URL must be set');
  }

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    issues.push('EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set');
  }

  if (!env.crashReportingDsn) {
    issues.push('EXPO_PUBLIC_SENTRY_DSN recommended for production crash reporting');
  }

  return issues;
}
