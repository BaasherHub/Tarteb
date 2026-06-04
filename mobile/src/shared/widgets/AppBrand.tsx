import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

type Props = {
  showTagline?: boolean;
  centered?: boolean;
};

export function AppBrand({ showTagline = true, centered = true }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  return (
    <View style={[styles.wrap, centered && styles.centered]}>
      <View style={[styles.markRow, rtl.row, centered && styles.markRowCentered]}>
        <View style={styles.mark}>
          <Text style={styles.markLetter}>T</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {t.appName}
        </Text>
      </View>
      {showTagline ? (
        <Text style={[styles.tagline, { writingDirection: rtl.writingDirection }]} numberOfLines={2}>
          {t.splashTagline}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.xl },
  centered: { alignItems: 'center' },
  markRow: { alignItems: 'center', gap: spacing.md },
  markRowCentered: { justifyContent: 'center' },
  mark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markLetter: { color: '#fff', fontSize: 22, fontWeight: '800' },
  name: { ...typography.brand, color: colors.textPrimary, flexShrink: 1 },
  tagline: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
});
