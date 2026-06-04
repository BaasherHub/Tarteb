# Temporary OTP bypass (testing only)

Twilio Verify costs ~$0.70 per SMS during QA. Use this bypass only while testing app flows.

## React Native (`mobile/`)

1. In `mobile/.env` set:
   ```
   EXPO_PUBLIC_SKIP_OTP_VERIFICATION=true
   ```
2. Restart Expo (`npx expo start --web`).
3. Phone login shows **Continue** — no SMS is sent.

**Turn off before production:** remove the line or set `false`, restart Expo.

**Note:** In RN builds, bypass only works when `__DEV__` is true **and** the env var is `true`. Production/release builds ignore the env flag even if it is set.

## Flutter (`lib/`)

Run with:

```powershell
flutter run -d edge `
  --dart-define=SUPABASE_URL=... `
  --dart-define=SUPABASE_ANON_KEY=... `
  --dart-define=SKIP_OTP_VERIFICATION=true
```

`run_web.ps1` can add the last `--dart-define` while testing.

## Supabase Edge (optional)

If something still calls `send-otp` / `verify-otp`, set Edge secret:

- `OTP_BYPASS_ENABLED` = `true`

Redeploy functions. **Remove the secret before launch.**

## Re-enable real OTP

1. `EXPO_PUBLIC_SKIP_OTP_VERIFICATION=false` (or delete) in `mobile/.env`
2. Remove `SKIP_OTP_VERIFICATION` dart-define from Flutter runs
3. Remove `OTP_BYPASS_ENABLED` from Supabase secrets
4. Redeploy `send-otp` and `verify-otp`
