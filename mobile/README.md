# Tarteb Mobile (React Native / Expo)

React Native rewrite of Tarteb. Shares the same **Supabase** backend as the Flutter app in the repo root.

## Setup

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (same as Flutter dart-defines).
3. Install and run:
   ```bash
   npm install
   npx expo start
   ```
   Press `a` for Android emulator or scan QR with Expo Go.

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
