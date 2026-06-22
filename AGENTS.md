# Tarteb — Codex Instructions

## Project
UAE blue-collar job marketplace. Employers browse and unlock candidate contacts. Candidates build verified profiles.
Bilingual English / Arabic with full RTL support.

## Structure
| Path | Description |
|------|-------------|
| `mobile/` | Primary app — Expo SDK 56, React Native 0.85, TypeScript |
| `supabase/` | Postgres schema, RLS policies, Edge Functions (OTP, push) |
| `archive/flutter/` | Legacy Flutter scaffold — do not touch |

## Stack
- **Mobile**: Expo React Native, TypeScript, Expo Router / React Navigation
- **Backend**: Supabase (Auth, Postgres, RLS, Edge Functions)
- **OTP**: Twilio via Supabase Edge Functions (`send-otp`, `verify-otp`)
- **Push**: `expo-notifications` with Expo push tokens
- **State**: React context (auth, locale, onboarding drafts)
- **CI**: GitHub Actions (`.github/workflows/ci.yml`)

## Skills to use
- `expo-react-native-coder` — use for all mobile work (screens, navigation, components)
- `supabase` — use for auth, RLS, Edge Functions, migrations

## Key decisions
- Phone OTP only — E.164 format `+971…` (UAE numbers)
- `src/core/` holds theme, i18n, navigation, auth, notifications
- `src/features/` holds employer, candidate, auth, settings
- `src/shared/` holds reusable widgets, hooks, utils
- Never edit `archive/flutter/`

## Dev commands
```bash
cd mobile
npm install
cp .env.example .env
npm run start:dev   # tunnel mode
```
