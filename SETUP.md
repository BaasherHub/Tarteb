# Tarteb — Setup

**Project path:** `C:\Projects\tarteb` (local disk — not OneDrive)

UAE blue-collar job marketplace (Flutter + Supabase).

## Project layout

```
tarteb/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── constants/     # app_colors, app_strings
│   │   └── supabase/      # Supabase client init
│   └── features/
│       ├── auth/
│       ├── candidate/
│       ├── employer/
│       └── shared/
└── supabase/
    └── migrations/        # SQL schema + RLS
```

## Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration:
   - **Dashboard:** SQL Editor → paste `supabase/migrations/20260530000000_initial_schema.sql` → Run
   - **CLI:** `supabase link` then `supabase db push`
3. Enable **Phone** auth (Authentication → Providers → Phone) and configure an SMS provider (Twilio, etc.).
4. Create storage bucket `candidate-photos` if the migration bucket insert did not run (usually handled by migration).

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Links `auth.users` to `candidate` or `employer` |
| `candidates` | Worker profiles (contact hidden until unlock) |
| `employers` | Company accounts + `credits_balance` |
| `unlocks` | AED 50 unlock records (1 credit per unlock) |
| `payments` | Stripe payment log (`pending` / `completed` / `failed`) |

### Key RPCs

- `unlock_candidate(candidate_id)` — **atomic** transaction: `FOR UPDATE` lock on employer → deduct 1 credit → insert unlock (rolls back both on any failure)
- `add_employer_credits(...)` — call from Edge Function after Stripe webhook (service role)

### Browse view

`candidate_browse` exposes active candidates; `phone` / `whatsapp` are null until the current employer has unlocked them.

## Flutter

```powershell
cd C:\Projects\tarteb
flutter pub get
flutter run --dart-define=SUPABASE_URL=https://YOUR_PROJECT.supabase.co --dart-define=SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Replace placeholders in `lib/core/supabase/supabase_client.dart` or always pass `--dart-define`.

## Business rules (implemented in schema)

- **Unlock cost:** AED 50 → 1 credit per unlock
- **Candidates:** free; employers pay for credits (Stripe later)
- **RLS:** users only manage their own rows; employers browse active candidates without phone/whatsapp until unlock

## Later integrations

- **Stripe:** webhook Edge Function → `payments` + `add_employer_credits`
- **OneSignal:** push when profile viewed / unlocked
