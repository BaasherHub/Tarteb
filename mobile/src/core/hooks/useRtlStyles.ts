import { useMemo } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { spacing } from '@/core/theme/spacing';

export function useRtlStyles() {
  const { isRtl } = useLocale();

  return useMemo(
    () => ({
      isRtl,
      textAlign: (isRtl ? 'right' : 'left') as TextStyle['textAlign'],
      textAlignCenter: 'center' as const,
      /** Trailing edge for values in label/value rows */
      textAlignEnd: (isRtl ? 'left' : 'right') as TextStyle['textAlign'],
      writingDirection: (isRtl ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
      row: {
        flexDirection: (isRtl ? 'row-reverse' : 'row') as ViewStyle['flexDirection'],
      },
      /** Horizontal rows with space-between (settings rows, meta rows) */
      rowBetween: {
        flexDirection: (isRtl ? 'row-reverse' : 'row') as ViewStyle['flexDirection'],
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        gap: spacing.md,
      },
    }),
    [isRtl],
  );
}
