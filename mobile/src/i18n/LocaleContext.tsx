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
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const STORAGE_KEY = 'app_language';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'ar' || stored === 'en') {
        setLangState(stored);
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(stored === 'ar');
      }
    });
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(next === 'ar');
  }, []);

  const value = useMemo(
    () => ({
      lang,
      t: strings(lang),
      setLang,
      isRtl: lang === 'ar',
    }),
    [lang, setLang],
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
