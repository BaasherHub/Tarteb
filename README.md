# Tarteb

**Tarteb** (رتّب) is a job marketplace for the UAE blue-collar sector — employers discover candidates by role, unlock verified contact details, and candidates build profiles employers can trust.

## Repository

| Path | Description |
|------|-------------|
| [`mobile/`](mobile/) | **Primary app** — Expo React Native (TypeScript), iOS & Android |
| [`supabase/`](supabase/) | Postgres schema, RLS, Edge Functions (OTP, notifications) |
| [`docs/`](docs/) | Privacy policy draft and store assets |
| [`archive/flutter/`](archive/flutter/) | Legacy Flutter scaffold (not maintained) |

## Get started

```bash
cd mobile
npm install
cp .env.example .env
npm run start:dev
```

Full mobile docs: **[mobile/README.md](mobile/README.md)**  
Store launch steps: **[mobile/LAUNCH_CHECKLIST.md](mobile/LAUNCH_CHECKLIST.md)**

## Highlights

- Bilingual **English / Arabic** with RTL
- **Supabase** backend shared across platforms
- **Expo** push notifications and `tarteb://` deep links
- Employer subscription via WhatsApp activation workflow
- CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

## Screenshots

Add marketing screenshots under `mobile/docs/screenshots/` before App Store / Play submission (see mobile README).

## Legal

Draft privacy policy: [`docs/PRIVACY_POLICY.md`](docs/PRIVACY_POLICY.md) — publish to your domain before release.

## License

Proprietary — Tarteb. All rights reserved.
