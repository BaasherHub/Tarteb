import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as
  | { supabaseUrl?: string; supabaseAnonKey?: string }
  | undefined;

/** TESTING ONLY — see archive/flutter/TESTING_OTP_BYPASS.md. Never true in production builds. */
export const env = {
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra?.supabaseUrl ?? '',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra?.supabaseAnonKey ?? '',
  /** Never enabled in production builds — dev + explicit env only. */
  skipOtpVerification:
    typeof __DEV__ !== 'undefined' &&
    __DEV__ === true &&
    process.env.EXPO_PUBLIC_SKIP_OTP_VERIFICATION === 'true',
};

export function assertEnv(): void {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in mobile/.env',
    );
  }
}


