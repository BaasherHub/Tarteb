# Tarteb

UAE blue-collar job marketplace.

## Main app

The active client is **Expo React Native (TypeScript)** in [`mobile/`](mobile/).

```bash
cd mobile
npm install
cp .env.example .env   # add your Supabase URL and anon key
npm start
```

See [`mobile/README.md`](mobile/README.md) and [`SETUP.md`](SETUP.md) for backend and environment setup. Supabase migrations live in [`supabase/`](supabase/).

## Repository layout

```
tarteb/
├── mobile/     # Expo React Native app (primary)
├── supabase/   # Database migrations and Edge Functions
└── ...
```
