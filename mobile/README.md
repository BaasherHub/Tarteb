# Tarteb Mobile

Expo React Native app for **Tarteb** — a UAE-focused blue-collar job marketplace connecting employers with candidates.

## Features

- **Employers** — Browse by role, refine filters, unlock phone/WhatsApp contacts, subscription tiers
- **Candidates** — Guided onboarding (photo, visa, salary, availability), profile dashboard
- **Auth** — Phone OTP (E.164 `+971…`) or email OTP via Supabase
- **Arabic & English** — Full RTL layout, localized strings
- **Push & deep links** — `tarteb://candidate/{id}`, subscription success, browse/unlocks tabs
- **Polish** — Design system, accessibility, offline browse cache, in-app toasts

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Expo SDK 56, React Native 0.85, React 19 |
| Navigation | React Navigation (native stack + bottom tabs) |
| Backend | Supabase (Auth, Postgres, Edge Functions) |
| SMS OTP | Twilio via `send-otp` / `verify-otp` functions |
| Push | `expo-notifications` (Expo push tokens → `profiles.push_token`) |
| State | React context (auth, locale, onboarding drafts) |

## Quick start

```bash
cp .env.example .env   # EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run start:dev      # Development build + tunnel — see DEVELOPMENT_BUILD.md
```

Web preview: `npx expo start --web`

## Brand assets

Icons match the in-app **AppBrand** mark (`#1A6FFF`, white **T**):

```bash
npm run generate:assets
```

Outputs under `assets/` (icon, splash, Android adaptive, favicon). Rebuild native binaries after changing icons.

## Project structure

```
src/
├── core/          # theme, i18n, navigation, auth, notifications
├── features/      # employer, candidate, auth, settings, app
└── shared/        # widgets, hooks, utils (phone E.164, a11y)
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `EXPO_PUBLIC_SKIP_OTP_VERIFICATION` | Dev only — bypass SMS |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Store / settings link |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry (enabled in release when DSN set; rebuild native after plugin) |
| `EXPO_PUBLIC_ANALYTICS_ENABLED` | Optional analytics (`true`) |

## Screenshots

<!-- Add before store submission -->
| Screen | Path |
|--------|------|
| Browse (EN) | `docs/screenshots/browse-en.png` |
| Candidate detail | `docs/screenshots/candidate-detail.png` |
| Auth (AR) | `docs/screenshots/auth-ar.png` |

## Launch

See **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** and **[../docs/PRIVACY_POLICY.md](../docs/PRIVACY_POLICY.md)**.

## Backend

Database migrations and Edge Functions: [`../supabase/`](../supabase/).
