import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as
  | {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
      privacyPolicyUrl?: string;
    }
  | undefined;

const PLACEHOLDER_SUPABASE = 'placeholder.supabase.co';

/**
 * Dev-only flags — never true in release builds regardless of env vars.
 * @see validateProductionConfig()
 */
export const env = {
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra?.supabaseUrl ?? '',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra?.supabaseAnonKey ?? '',
  /**
   * OTP bypass for internal/preview testing. Controlled purely by env var —
   * production EAS profile must not set EXPO_PUBLIC_SKIP_OTP_VERIFICATION.
   */
  skipOtpVerification:
    process.env.EXPO_PUBLIC_SKIP_OTP_VERIFICATION === 'true',
  showDevOtpBanner:
    process.env.EXPO_PUBLIC_SKIP_OTP_VERIFICATION === 'true',
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
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in mobile/.env',
    );
  }
}

/** Call on startup; logs critical misconfiguration in release builds. */
export function validateProductionConfig(): string[] {
  const issues: string[] = [];

  if (env.isDevelopment) return issues;

  if (env.skipOtpVerification) {
    issues.push('EXPO_PUBLIC_SKIP_OTP_VERIFICATION must not be set in production');
  }

  if (!env.supabaseUrl || env.supabaseUrl.includes(PLACEHOLDER_SUPABASE)) {
    issues.push('EXPO_PUBLIC_SUPABASE_URL must point to a real Supabase project');
  }

  if (!env.supabaseAnonKey || env.supabaseAnonKey.length < 20) {
    issues.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing or invalid');
  }

  if (!env.crashReportingDsn) {
    issues.push('EXPO_PUBLIC_SENTRY_DSN recommended for production crash reporting');
  }

  return issues;
}
