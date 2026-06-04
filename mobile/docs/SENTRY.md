# Sentry + Metro (Tarteb mobile)

## Problem

Metro failed with:

`Unable to resolve module ./tracing/utils.js from @sentry/core/build/esm/index.js`

`@sentry/core` ESM uses internal `./tracing/*` paths that are not in the package `"exports"` map.

## Solution (two layers)

### 1. Dev bundle excludes Sentry

`src/core/services/crashReporting.ts` loads:

- `crashReporting.stub.ts` when `__DEV__` is true (no `@sentry/*` in the graph)
- `crashReporting.prod.ts` when `__DEV__` is false (production / EAS release)

So `npx expo start` / dev client does not need to resolve `@sentry/core` at all.

### 2. Production bundle uses CJS

`metro.config.js`:

- `getSentryExpoConfig` from `@sentry/react-native/metro`
- `unstable_enablePackageExports: false`
- Custom `resolveRequest` → `@sentry/core`, `@sentry/react`, `@sentry/browser` **CJS** entry files

## Verify locally

```bash
cd mobile
npx tsc --noEmit
npx expo start --clear
# In another terminal (optional):
npx expo export --platform android --dev
EXPO_PUBLIC_SENTRY_DSN=https://example@o0.ingest.sentry.io/0 npx expo export --platform android
```

## Production

- Set `EXPO_PUBLIC_SENTRY_DSN` on EAS **production** only
- Rebuild native after `@sentry/react-native` plugin: `eas build --profile production`
- Confirm an event in the Sentry dashboard from a release build

## If Metro still errors

1. Delete `.expo` and `node_modules/.cache`
2. Confirm `metro.config.js` exists at `mobile/metro.config.js`
3. Confirm no file imports `@sentry/react-native` except `crashReporting.prod.ts`
4. Run `npm install` and `npx expo start --clear`

Do **not** import `@sentry/core` or tracing helpers directly in app code.
