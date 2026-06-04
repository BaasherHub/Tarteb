import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';

type Props = {
  showTagline?: boolean;
  centered?: boolean;
};

export function AppBrand({ showTagline = true, centered = true }: Props) {
  const { t } = useLocale();
  return (
    <View style={[styles.wrap, centered && styles.centered]}>
      <View style={styles.markRow}>
        <View style={styles.mark}>
          <Text style={styles.markLetter}>T</Text>
        </View>
        <Text style={styles.name}>{t.appName}</Text>
      </View>
      {showTagline ? <Text style={styles.tagline}>{t.splashTagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  centered: { alignItems: 'center' },
  markRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markLetter: { color: '#fff', fontSize: 22, fontWeight: '800' },
  name: { ...typography.brand, color: colors.textPrimary },
  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});


