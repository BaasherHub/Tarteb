# Flutter → React Native migration plan

## Repo layout

```
tarteb/
  lib/           # Flutter (legacy — freeze when RN reaches parity)
  mobile/        # Expo React Native (active)
  supabase/      # Shared backend
```

## Steps

### Step 1 — Scaffold ✅
- Expo TypeScript in `mobile/`
- Supabase client + env
- React Navigation native stack
- Locale context (EN/AR)

### Step 2 — Auth ✅
- Splash → session check
- Phone OTP via Edge Functions
- Role selection → `profiles` insert
- `authNavigation` routing

### Step 3 — Employer ✅ (MVP)
- Company onboarding
- Browse list (`candidate_browse`)
- Candidate detail + `unlock_candidate` (subscription gate)
- Subscription screen + WhatsApp
- My unlocks list
- Bottom tabs (native tab bar)

### Step 4 — Candidate ✅
- [x] 4-step onboarding (photo upload, role, visa, salary, availability)
- [x] Dashboard (pause, views, edit profile)
- [x] `candidate-photos` storage upload

### Step 5 — Polish ✅ (MVP)
- [x] Filter modal on browse
- [x] Email OTP fallback (Supabase magic link)
- [ ] RTL layout pass after language change (may need app restart)
- [ ] Error copy / offline banner
- [ ] EAS Build for TestFlight / Play Store

## Cutover

1. Internal test RN build with real Supabase.
2. Feature parity checklist vs Flutter.
3. Stop shipping Flutter; archive `lib/` or move to `legacy-flutter/` branch.
