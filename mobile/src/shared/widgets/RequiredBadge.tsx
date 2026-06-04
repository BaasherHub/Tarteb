import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';

/** Small label for required onboarding fields. */
export function RequiredBadge() {
  const { t } = useLocale();
  return (
    <View style={styles.wrap} accessibilityLabel={t.requiredField}>
      <Text style={styles.text}>{t.requiredField}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    backgroundColor: colors.errorTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 0,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
