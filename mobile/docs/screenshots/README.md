# Store screenshots — Tarteb 1.0.0

Capture on a **production EAS build** (not Expo Go, not dev client with OTP bypass). Use realistic UAE data (AED salaries, emirates, visa types). Per-shot navigation: [`placeholders/`](placeholders/).

---

## Device & appearance (recommended)

| Setting | Recommendation |
|---------|----------------|
| **Primary device** | Physical iPhone 14 Pro / 15 Pro / 16 Pro (6.7") **or** Pixel 7 / 8 (Android) |
| **Secondary** | One platform is enough for v1; export same PNGs to both stores if aspect ratio matches |
| **Theme** | **Light mode only** — app uses `userInterfaceStyle: 'light'`; do not capture dark mode |
| **Locale** | **English** for shots 1, 3–5, 7–8 · **Arabic (RTL)** for shots 2 and 6 |
| **Status bar** | Full battery, Wi‑Fi or LTE, no low-power banner; time ~9:41 or 10:00 |
| **Account** | Demo employer + demo candidate; no real personal numbers in committed PNGs |

### Simulator (acceptable fallback)

- iOS: iPhone 15 Pro Max simulator → **1290×2796** (Cmd+S)
- Android: Pixel 7 API 34 emulator → **1080×1920** (extended controls screenshot)

Production **physical device** looks best for store review trust.

---

## Required assets

| # | Filename | Scene |
|---|----------|--------|
| 1 | `01-auth-phone-en.png` | Phone OTP — English |
| 2 | `02-auth-phone-ar.png` | Phone OTP — Arabic (RTL) |
| 3 | `03-employer-browse-en.png` | Employer browse |
| 4 | `04-candidate-detail-en.png` | Candidate detail / unlock |
| 5 | `05-subscription-en.png` | Subscription tiers |
| 6 | `06-candidate-dashboard-ar.png` | Candidate dashboard — Arabic |
| 7 | `07-filters-modal-en.png` | Refine filters modal |
| 8 | `08-settings-trust-en.png` | Settings + language |

Save PNGs in **`docs/screenshots/`**. Also create **`play-feature-graphic.png`** (1024×500) — see [`placeholders/play-feature-graphic.md`](placeholders/play-feature-graphic.md).

### Store sizes

| Store | Asset | Size |
|-------|--------|------|
| App Store | iPhone 6.7" | **1290 × 2796** |
| Play Store | Phone | **1080 × 1920** min |
| Play Store | Feature graphic | **1024 × 500** |

---

## Capture workflow

### Before you start

1. `eas build --profile production` and install on device.
2. EAS **production** env: real Supabase keys, `EXPO_PUBLIC_SENTRY_DSN`, **no** `EXPO_PUBLIC_SKIP_OTP_VERIFICATION`.
3. Sign out; confirm **no yellow dev OTP banner** on phone screen.

### English pass (light mode)

1. Device language can stay English; app language English (default).
2. Capture: **01**, **03**, **04**, **05**, **07**, **08**.
3. For **01**: phone step with `+971 50 …` formatted field and **Send OTP** (do not show bypass).

### Arabic pass (light mode)

1. Open app → **Settings** → switch to **العربية**.
2. Sign out if needed; capture **02** (phone OTP, RTL layout).
3. Sign in as **candidate** demo; capture **06** (dashboard RTL).
4. Optionally re-capture **07** / **08** if Arabic copy should appear in store listing.

### After capture

- Rename files exactly as in the table.
- Blur real phone numbers if using personal test SIM.
- Tick boxes in [`LAUNCH_CHECKLIST.md`](../../LAUNCH_CHECKLIST.md) → **Take real screenshots**.

---

## App Store / Play copy hints

- **EN:** UAE `+971` sign-in, employer browse & filters, candidate dashboard, bilingual RTL.
- **Review notes:** Demo accounts; OTP via Twilio on production; no OTP bypass in store build.

---

## Placeholder briefs

Each file under [`placeholders/`](placeholders/) lists route, UI state, and caption until the PNG exists.
