@AGENTS.md

## Feature Flags

### Arabic / RTL support — currently disabled

Arabic is implemented but disabled while RTL layout glitches are being ironed out.

**To re-enable:** set `ARABIC_ENABLED = true` in [`src/core/i18n/LocaleContext.tsx`](src/core/i18n/LocaleContext.tsx).

That single flag controls:
- Whether the Arabic option appears in the language picker (`LanguageSelectionScreen.tsx`)
- Whether previously saved `'ar'` locale is honoured on app start (currently falls back to `'en'`)
- Whether `I18nManager.forceRTL` is ever called (currently always off)

Do **not** remove the Arabic row from `LanguageSelectionScreen.tsx` or the `'ar'` branch from `LocaleContext.tsx` — the code is intentionally kept in comments/conditionals so it can be restored with a one-line change.
