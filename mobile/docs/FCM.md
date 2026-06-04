# Push notifications (Expo + FCM) — Ops runbook

Tarteb uses **Expo Push Notifications** (`expo-notifications`). On **Android**, FCM requires **`google-services.json`** baked into the native build.

---

## Symptoms

| Symptom | Likely cause |
|--------|----------------|
| Red dev banner: *Unable to get Firebase Messaging instance* | Dev client built **without** `google-services.json`, or stale native binary |
| Push token never saved in Supabase `profiles.push_token` | FCM not configured, permission denied, or Android guard active |
| iOS push fails in production | Missing APNs key on EAS project |

---

## What the app does without FCM (development)

- `app.config.ts` sets `extra.fcmConfigured` only when `mobile/google-services.json` exists.
- **No** `getExpoPushTokenAsync` on Android until configured.
- `expo-notifications` is **lazy-imported** so the native FCM module is not loaded unnecessarily.
- `index.ts` suppresses known LogBox messages from outdated dev clients.
- Console: `[Tarteb] Android push skipped — add google-services.json and rebuild`

**OTA / JS-only updates cannot add FCM** — ops must run a new EAS native build.

---

## Production checklist (Android)

1. [ ] Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. [ ] Android app registered with package **`com.tarteb.app`**
3. [ ] `google-services.json` downloaded to **`mobile/google-services.json`** (gitignored — use EAS Secrets or secure vault)
4. [ ] FCM credentials uploaded to [Expo push credentials](https://docs.expo.dev/push-notifications/fcm-credentials/) for EAS project `626b8ae5-2553-487f-bddf-76ce3015191c` (or current `EAS_PROJECT_ID`)
5. [ ] `eas build --profile production --platform android` (new binary)
6. [ ] Install build → allow notifications → verify `profiles.push_token` populated in Supabase
7. [ ] Send test push from [Expo push tool](https://expo.dev/notifications) using the stored Expo push token

## Production checklist (iOS)

1. [ ] APNs key (.p8) uploaded to Expo project credentials
2. [ ] `UIBackgroundModes` includes `remote-notification` (already in `app.config.ts`)
3. [ ] Test on **physical device** (simulator push is limited)
4. [ ] Production build → allow notifications → verify `push_token` in Supabase

---

## File locations

| File | Purpose |
|------|---------|
| `mobile/google-services.json` | Android FCM (required for native) |
| `mobile/google-services.json.example` | Reminder template — not used at build time |
| `mobile/app.config.ts` | `googleServicesFile` + `extra.fcmConfigured` |
| `mobile/src/core/config/push.ts` | Runtime guards |
| `mobile/src/core/services/notificationsLazy.ts` | Deferred native module load |

---

## Rollback / dev without Firebase

Developers can work on UI without Firebase:

- Do **not** add `google-services.json` locally.
- Use iOS simulator/device for non-push flows, or Android without expecting push.
- Ignore one-time red banner until dev client is rebuilt after adding JSON.

---

## Verify after release

```sql
-- Sample: users with granted permission should have tokens after opening app
SELECT user_id, push_token IS NOT NULL AS has_token
FROM profiles
WHERE role = 'candidate'
LIMIT 20;
```

---

## Support escalation

If users report “no notifications” on Android production:

1. Confirm they are on a build **after** FCM was added (version/build number).
2. Confirm notification permission in OS settings.
3. Check `push_token` in Supabase for their `user_id`.
4. Re-send test push from Expo dashboard using that token.
