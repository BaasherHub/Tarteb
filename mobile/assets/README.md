# Tarteb app assets (EAS Build)

Replace these files with final brand artwork before store submission.

## Required files

| File | Size | Notes |
|------|------|--------|
| `icon.png` | **1024×1024** PNG | App Store / Play Store icon |
| `splash.png` | **1284×2778** PNG (or large portrait) | Splash image via `expo-splash-screen` plugin on `#1565D8` |
| `android-icon-foreground.png` | **1024×1024** PNG | Adaptive icon foreground (keep logo in center ~66% safe zone) |
| `android-icon-background.png` | **1024×1024** PNG | Adaptive icon background |
| `android-icon-monochrome.png` | **1024×1024** PNG | Android 13+ themed icon + notification icon base |
| `favicon.png` | 48×48+ | Web only |

## Current placeholders

- `splash.png` was copied from `splash-icon.png` for EAS config wiring.
- Swap in production splash and icons when design is ready.

## Regenerate after asset changes

```bash
npx expo prebuild --clean   # only if you add native android/ios folders locally
eas build --profile preview --platform all
```
