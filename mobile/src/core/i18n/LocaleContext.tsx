import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lang, strings } from './strings';

type LocaleContextValue = {
  lang: Lang;
  t: ReturnType<typeof strings>;
  setLang: (lang: Lang) => void;
  isRtl: boolean;
  /** AsyncStorage read finished. */
  isHydrated: boolean;
  /** User completed the first-run language screen (or changed language in Settings). */
  hasCompletedLanguageSelection: boolean;
  /** Undo first-run completion so the user can pick language again. */
  resetLanguageSelection: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
export const LANGUAGE_STORAGE_KEY = 'app_language';
/** Separate from app_language so an old saved locale does not skip the picker. */
export const LANGUAGE_SELECTION_DONE_KEY = 'language_selection_done_v1';
/** Set to true when Arabic RTL glitches are resolved and the language option is ready. */
export const ARABIC_ENABLED = false;

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
      AsyncStorage.getItem(LANGUAGE_SELECTION_DONE_KEY),
    ]).then(([stored, done]) => {
      const lang: Lang = ARABIC_ENABLED && stored === 'ar' ? 'ar' : 'en';
      setLangState(lang);
      I18nManager.allowRTL(ARABIC_ENABLED);
      I18nManager.forceRTL(ARABIC_ENABLED && lang === 'ar');
      setHasCompletedLanguageSelection(done === '1');
      setIsHydrated(true);
    });
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    setHasCompletedLanguageSelection(true);
    void AsyncStorage.multiSet([
      [LANGUAGE_STORAGE_KEY, next],
      [LANGUAGE_SELECTION_DONE_KEY, '1'],
    ]);
    I18nManager.allowRTL(ARABIC_ENABLED);
    I18nManager.forceRTL(ARABIC_ENABLED && next === 'ar');
  }, []);

  const resetLanguageSelection = useCallback(() => {
    setHasCompletedLanguageSelection(false);
    void AsyncStorage.removeItem(LANGUAGE_SELECTION_DONE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      t: strings(lang),
      setLang,
      isRtl: lang === 'ar',
      isHydrated,
      hasCompletedLanguageSelection,
      resetLanguageSelection,
    }),
    [lang, setLang, isHydrated, hasCompletedLanguageSelection, resetLanguageSelection],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
