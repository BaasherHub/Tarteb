# Tarteb

UAE blue-collar job marketplace.

## Active app

The client is **Expo React Native (TypeScript)** in [`mobile/`](mobile/).

```bash
cd mobile
npm install
cp .env.example .env   # Supabase URL and anon key
npx expo start
```

- App docs: [`mobile/README.md`](mobile/README.md)
- Backend: [`supabase/`](supabase/) (migrations and Edge Functions)
- CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

## Repository layout

```
tarteb/
├── mobile/              # Expo app (primary)
├── supabase/            # Database + Edge Functions
├── .github/             # GitHub Actions
├── archive/flutter/     # Legacy Flutter files (archived, not maintained)
└── README.md
```

## Legacy Flutter

Old Flutter scaffold and setup docs were moved to [`archive/flutter/`](archive/flutter/) and are not part of day-to-day development.
