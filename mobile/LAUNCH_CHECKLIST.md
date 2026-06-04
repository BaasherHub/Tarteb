# Tarteb — App Store & Play Store Launch Checklist

Use this before submitting **1.0.0**. Re-run after any native config change (icons, Sentry plugin).

## Critical product fixes

- [x] App icon aligned with in-app brand (`#1A6FFF` + **T** mark) — `npm run generate:assets`
- [x] Phone inputs: E.164 `+971`, live spacing (`+971 50 155 1480`), no `05x` placeholder
- [x] `PhoneNumberField` + auth OTP loading / success animation
- [x] Deep links: `tarteb://candidate/{id}`, `subscription`, `browse`, `unlocks`, `dashboard`
- [x] Push notifications + permission prompt (post-onboarding / first candidate view)
- [x] In-app toast system (RTL, actions)

## Store screenshots

Capture per [`docs/screenshots/README.md`](docs/screenshots/README.md) (8 shots + Play feature graphic).

| # | Asset | Status |
|---|--------|--------|
| 1 | Auth phone (EN) | [ ] |
| 2 | Auth phone (AR / RTL) | [ ] |
| 3 | Employer browse | [ ] |
| 4 | Candidate detail + unlock | [ ] |
| 5 | Subscription plans | [ ] |
| 6 | Candidate dashboard (AR) | [ ] |
| 7 | Refine filters modal | [ ] |
| 8 | Settings + language | [ ] |
| — | Play feature graphic 1024×500 | [ ] |

## Brand & assets

- [x] `assets/icon.png`, splash, Android adaptive + monochrome
- [ ] Swap generated icons if marketing supplies final SVG (`npm run generate:assets`)
- [x] `app.config.ts` — `#1A6FFF`, keyboard resize (Android), Sentry plugin

## Configuration & dev flags (production)

| Flag | Production rule | Verified |
|------|-----------------|----------|
| `EXPO_PUBLIC_SKIP_OTP_VERIFICATION` | **Must be unset** (bypass only works in `__DEV__` anyway) | [ ] |
| `EXPO_PUBLIC_SUPABASE_URL` | Real project URL — not `placeholder.supabase.co` | [ ] |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Production anon key in EAS `production` env | [ ] |
| `EXPO_PUBLIC_SENTRY_DSN` | Set for crash reporting (JS + native after rebuild) | [ ] |
| `EXPO_PUBLIC_ANALYTICS_ENABLED` | Optional `true` when provider wired | [ ] |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Live HTTPS URL | [ ] |
| `__DEV__` / dev client | Store builds must be **production** profile, not `development` | [ ] |

Startup hook `validateProductionConfig()` logs warnings in release builds if misconfigured.

**EAS:** set secrets on `production` environment only — never copy dev OTP bypass vars.

- [ ] Twilio `send-otp` / `verify-otp` deployed on production Supabase
- [ ] Rebuild native app after adding `@sentry/react-native` plugin: `eas build --profile production`

## Observability

- [x] Sentry SDK integrated (`crashReporting.ts`, `index.ts` wrap, `app.config` plugin)
- [ ] Create Sentry project + add `EXPO_PUBLIC_SENTRY_DSN` to EAS production
- [ ] Confirm first test crash/event in Sentry dashboard
- [ ] Optional: `EXPO_PUBLIC_ANALYTICS_ENABLED` + provider in `analytics.ts`

## Legal

- [x] Draft [`../docs/PRIVACY_POLICY.md`](../docs/PRIVACY_POLICY.md)
- [ ] Publish privacy URL (linked from Settings)
- [ ] Terms of service URL (recommended)
- [ ] Apple privacy nutrition labels / Google Data safety form
- [x] iOS `usesNonExemptEncryption: false`

## QA matrix

- [ ] Phone OTP: `+971 50 155 1480` formatting → SMS → verify → success animation
- [ ] Reject invalid numbers (`050…` only without +971 normalization path)
- [ ] Employer: browse → detail → unlock → subscription
- [ ] Candidate: onboarding phones saved as E.164
- [ ] Arabic RTL: auth, browse, filters, settings
- [ ] Deep link cold start → candidate profile (logged in)
- [ ] Push tap → correct screen
- [ ] Offline browse cache + retry
- [ ] Mid-range Android device (production APK/AAB)

## Build & submit

```bash
cd mobile
npm ci
npx tsc --noEmit
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android
```

- [ ] TestFlight / internal testing sign-off
- [ ] Play internal track sign-off
- [ ] App Review notes: demo account, **no OTP bypass** in production build

## Post-launch

- [ ] Sentry crash-free sessions > 99%
- [ ] OTP delivery success rate
- [ ] WhatsApp subscription activation SLA
- [ ] v1.1 from store feedback
