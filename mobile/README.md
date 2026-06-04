# Tarteb Mobile (React Native / Expo)

Expo React Native client for Tarteb. Shares the **Supabase** backend in [`../supabase/`](../supabase/).

## Setup

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (same as Flutter dart-defines).
3. Install and run:
   ```bash
   npm install
   npm run start:dev
   ```
   For **Development Build** on a real device (recommended), see **[DEVELOPMENT_BUILD.md](./DEVELOPMENT_BUILD.md)**.

   Web-only quick test: `npx expo start --web`

## Migration status

| Step | Status |
|------|--------|
| 1. Scaffold + Supabase + navigation | Done |
| 2. Auth (splash, phone OTP, role) | Done |
| 3. Employer browse, detail, unlock, subscription | Done (basic) |
| 4. Candidate onboarding + dashboard | Done |
| 5. AR/RTL, filters, polish | Filters + email OTP done; RTL restart note in MIGRATION_PLAN |

## Backend

- Run migration `supabase/migrations/20260530600000_employer_subscription.sql` if not applied.
- Activate subscription after WhatsApp payment:
  ```bash
  flutter run -t lib/admin/activate_subscription.dart --dart-define=...
  ```
  (or call `activate_employer_subscription` RPC with service role)

## Native feel

Uses **React Navigation native stack** (iOS slide, Android material transitions) and platform-aware tab bar / buttons.
