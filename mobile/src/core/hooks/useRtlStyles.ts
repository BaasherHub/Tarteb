import { useMemo } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';

export function useRtlStyles() {
  const { isRtl } = useLocale();

  return useMemo(
    () => ({
      isRtl,
      textAlign: (isRtl ? 'right' : 'left') as TextStyle['textAlign'],
      textAlignCenter: 'center' as const,
      row: {
        flexDirection: (isRtl ? 'row-reverse' : 'row') as ViewStyle['flexDirection'],
      },
      writingDirection: (isRtl ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    }),
    [isRtl],
  );
}


