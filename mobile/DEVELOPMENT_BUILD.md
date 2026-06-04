# Tarteb — Development Build (expo-dev-client)

A **Development Build** is a custom debug app on your phone that loads JavaScript from your computer’s Metro bundler. You get fast refresh and full native modules (camera, push, etc.) without rebuilding for every code change.

**Expo Go is not used** for day-to-day work on this project once the dev client is installed.

---

## One-time setup

### 1. Local environment

```bash
cd mobile
cp .env.example .env
# Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npm install
```

Optional: create **development** env vars on EAS (same names as `.env`) so cloud builds match local:

```bash
eas env:create --environment development --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co"
eas env:create --environment development --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_ANON_KEY"
```

### 2. Build the Development Client (first time per device platform)

**Physical Android phone (APK):**

```bash
eas build --profile development --platform android
```

When the build finishes, open the build page on [expo.dev](https://expo.dev/accounts/baasher/projects/tarteb/builds), download the **APK**, and install it on your device (allow “Install unknown apps” if prompted).

**Physical iPhone:**

```bash
eas build --profile development --platform ios
```

Install via the link Expo provides (internal distribution). You may need to register your device UDID the first time EAS asks.

**iOS Simulator only (no physical device):**

```bash
eas build --profile development-simulator --platform ios
```

Install the build on the simulator from the Expo build page instructions.

> Re-run `eas build --profile development` only when you add a **new native dependency** or change native config in `app.config.ts` plugins. Pure JS/TS changes do **not** need a new native build.

---

## Daily workflow

### 1. Start Metro for the dev client

```bash
cd mobile
npm run start:dev
```

Or: `npx expo start --dev-client`

Use the same Wi‑Fi network on phone and PC (or USB debugging / tunnel if needed).

### 2. Open the app on your phone

- Launch the **Tarteb** development build you installed (not Expo Go).
- It should connect to Metro automatically, or scan the QR code from the terminal.

### 3. Change code and reload quickly

- Save any `.ts` / `.tsx` file → **Fast Refresh** updates the screen in seconds.
- Shake the device (or press `m` in the terminal) → dev menu → **Reload** if something looks stuck.
- Press `r` in the Metro terminal to reload all clients.

### 4. When a full native rebuild is required

Rebuild the development client if you:

- Run `npx expo install` for a package with native code
- Add or change entries in `app.config.ts` **plugins**
- Change `ios.bundleIdentifier`, `android.package`, or permissions

```bash
eas build --profile development --platform android
# or ios
```

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| App opens but “Could not connect to Metro” | Same Wi‑Fi; try `npx expo start --dev-client --tunnel` |
| Still using Expo Go | Uninstall Expo Go test; open the **Tarteb** dev build APK/IPA |
| Metro ENOENT on Windows after `npm install` | Stop Metro, delete `node_modules`, `npm ci`, restart |
| `CI=true` disables fast refresh | Unset `CI` in your shell before `npm run start:dev` |

---

## Profiles summary (`eas.json`)

| Profile | Use |
|---------|-----|
| `development` | Dev client APK / iOS device (internal) |
| `development-simulator` | Dev client for iOS Simulator only |
| `preview` | Internal QA build (no dev menu, closer to production) |
| `production` | Store release |
