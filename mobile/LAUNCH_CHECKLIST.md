# Tarteb — App Store & Play Store Launch Checklist

Use this before submitting **1.0.0**. Re-run after any native config change (icons, Sentry plugin, permissions).

**Last updated:** Launch blocker pass — Sentry Metro verified, OTP success haptics, screenshot guide.

---

## Production build readiness

| Area | Status | Notes |
|------|--------|--------|
| TypeScript | ✅ Run `npx tsc --noEmit` before each EAS build | |
| Metro / dev (`expo start`) | ✅ Sentry **excluded** in `__DEV__` via `crashReporting.stub` | See [`docs/SENTRY.md`](docs/SENTRY.md) |
| Metro / release bundle | ✅ CJS resolver in `metro.config.js` + `crashReporting.prod` | |
| Native Sentry plugin | ⚠️ Requires **new** `eas build --profile production` after SDK add | |
| EAS production env | ⬜ Manual | Supabase, DSN, no OTP bypass |
| Store screenshots | ⬜ Manual | [`docs/screenshots/README.md`](docs/screenshots/README.md) |

---

## Critical product fixes

- [x] App icon aligned with in-app brand (`#1A6FFF` + **T** mark)
- [x] Phone inputs: E.164 `+971 5X XXX XXXX`, live spacing, UAE mobile validation
- [x] OTP: auto-submit, resend, `AuthSuccessPulse` + haptic (`expo-haptics`) on phone & email
- [x] Optional WhatsApp: empty state, `validateOptionalUaeMobile`, E.164 save
- [x] Deep links, push, toasts, error boundaries
- [x] **Sentry:** `metro.config.js` + dev/prod crash reporting split — **Metro error resolved**

## Sentry (observability)

- [x] SDK + plugin in `app.config.ts`
- [x] `crashReporting.ts` → stub in dev / prod in release only
- [x] `metro.config.js` — `getSentryExpoConfig`, CJS `resolveRequest`, `unstable_enablePackageExports: false`
- [x] Documented in [`docs/SENTRY.md`](docs/SENTRY.md)
- [ ] `EXPO_PUBLIC_SENTRY_DSN` on EAS **production** environment
- [ ] Production build installed; trigger test crash → event in Sentry dashboard

**Cache reset if Metro regresses:**

```bash
cd mobile && rm -rf .expo node_modules/.cache && npm install && npx expo start --clear
```

## Auth flow consistency

| Flow | OTP success | Errors |
|------|-------------|--------|
| Phone OTP | Green checkmark + haptic + subtitle | `InfoBanner` + `FieldError` |
| Email OTP | Same | Same |
| Role selection | — | `InfoBanner` |
| Onboarding | — | Per-field + WhatsApp optional rules |

**Manual QA (production build):**

- [ ] Phone: `+971 5x` → SMS → success pulse → role/home
- [ ] Email: code → success pulse → role/home
- [ ] Invalid / partial phone → `errPhoneInvalid`
- [ ] WhatsApp empty on step 3 → `null` in DB
- [ ] WhatsApp partial `+971` only → error
- [ ] Change phone / email resets OTP step

## Take real screenshots

**Status:** ⬜ **Not started** — use production build, **light mode**, EN + AR per [`docs/screenshots/README.md`](docs/screenshots/README.md).

| # | Filename | EN/AR | iOS | Android | Done |
|---|----------|-------|-----|---------|------|
| 1 | `01-auth-phone-en.png` | EN | [ ] | [ ] | [ ] |
| 2 | `02-auth-phone-ar.png` | AR | [ ] | [ ] | [ ] |
| 3 | `03-employer-browse-en.png` | EN | [ ] | [ ] | [ ] |
| 4 | `04-candidate-detail-en.png` | EN | [ ] | [ ] | [ ] |
| 5 | `05-subscription-en.png` | EN | [ ] | [ ] | [ ] |
| 6 | `06-candidate-dashboard-ar.png` | AR | [ ] | [ ] | [ ] |
| 7 | `07-filters-modal-en.png` | EN | [ ] | [ ] | [ ] |
| 8 | `08-settings-trust-en.png` | EN | [ ] | [ ] | [ ] |
| — | `play-feature-graphic.png` | — | — | [ ] | [ ] |

**Capture rules:** physical device preferred; **light mode only**; no dev OTP banner; realistic demo data.

## Configuration & dev flags (production)

| Flag | Production rule | Verified |
|------|-----------------|----------|
| `EXPO_PUBLIC_SKIP_OTP_VERIFICATION` | **Unset** | [ ] |
| `EXPO_PUBLIC_SUPABASE_URL` | Real project | [ ] |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | EAS production | [ ] |
| `EXPO_PUBLIC_SENTRY_DSN` | Set | [ ] |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Live HTTPS | [ ] |
| EAS profile | **production** (not development) | [ ] |

- [ ] Twilio `send-otp` / `verify-otp` on production Supabase
- [ ] `eas build --profile production --platform all`
- [ ] TestFlight + Play internal QA sign-off
- [ ] Review notes: demo accounts, no OTP bypass

## Legal

- [x] Draft [`../docs/PRIVACY_POLICY.md`](../docs/PRIVACY_POLICY.md)
- [ ] Published privacy URL in Settings
- [ ] Terms of service (recommended)
- [ ] Apple privacy labels / Google Data safety
- [x] iOS `usesNonExemptEncryption: false`

## QA matrix (production build)

- [ ] OTP success + haptic on real device (not simulator-only)
- [ ] OTP resend
- [ ] Employer: browse → unlock → subscription
- [ ] Candidate: onboarding + empty WhatsApp
- [ ] Arabic RTL on auth, browse, settings
- [ ] Deep links + push
- [ ] Offline browse cache
- [ ] Android mid-range + iPhone TestFlight

## Build & submit

```bash
cd mobile
npm ci
npx tsc --noEmit
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android
```

## Post-launch

- [ ] Sentry crash-free > 99%
- [ ] OTP delivery rate
- [ ] WhatsApp subscription SLA
