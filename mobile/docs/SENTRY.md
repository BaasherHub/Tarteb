# Sentry + Metro (Tarteb mobile)

## Problem

Metro error:

`Unable to resolve module ./tracing/utils.js from @sentry/core/build/esm/index.js`

`@sentry/core` ESM uses internal paths not exposed in package `"exports"`.

## Solution (three layers)

### 1. App source — no Sentry in dev graph

- `crashReporting.ts` re-exports **only** `crashReporting.stub.ts` (no `require('./crashReporting.prod')`).
- `crashReporting.prod.ts` is swapped in only for production Metro (EAS / `NODE_ENV=production`).

### 2. Metro dev — stub all `@sentry/*`

When `expo start` (dev bundle):

- `metro.config.js` uses Expo `getDefaultConfig` (not `getSentryExpoConfig`).
- `resolveRequest` returns `metro/sentry-stub.js` for any `@sentry/*` import.
- `blockList` blocks `@sentry/**/build/esm/**` and `crashReporting.prod.ts`.

### 3. Metro production — real SDK via CJS

When `eas build` (`EAS_BUILD=true`):

- `getSentryExpoConfig` enabled.
- `crashReporting.ts` resolves to `crashReporting.prod.ts`.
- `@sentry/core` / `@sentry/react` / `@sentry/browser` forced to **CJS** entry files.

## Verify

```bash
cd mobile
npx tsc --noEmit
npx expo start --clear
```

Production bundle (optional):

```bash
set EAS_BUILD=true
set NODE_ENV=production
set EXPO_PUBLIC_SENTRY_DSN=https://example@o0.ingest.sentry.io/0
npx expo export --platform android
```

## Cache reset

**Windows (PowerShell):**

```powershell
cd C:\Projects\tarteb\mobile
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npm install
npx expo start --clear
```

**macOS / Linux:**

```bash
cd mobile
rm -rf .expo node_modules/.cache
npm install
npx expo start --clear
watchman watch-del-all   # optional
```

## Rules

- Do **not** `import '@sentry/react-native'` outside `crashReporting.prod.ts`.
- Do **not** import `@sentry/core` tracing helpers in app code.
- Set `EXPO_PUBLIC_SENTRY_DSN` on EAS **production** only.
