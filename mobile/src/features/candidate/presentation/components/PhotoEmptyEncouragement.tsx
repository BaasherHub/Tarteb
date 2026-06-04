import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export function PhotoEmptyEncouragement() {
  const { t } = useLocale();
  const rtl = useRtlStyles();

  return (
    <View style={styles.wrap}>
      <View style={styles.benefits}>
        {t.photoBenefits.map((line) => (
          <View key={line} style={[styles.benefitRow, rtl.row]}>
            <View style={styles.bullet} />
            <Text
              style={[
                styles.benefitText,
                { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
              ]}
            >
              {line}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  benefits: { width: '100%', gap: spacing.md },
  benefitRow: { alignItems: 'flex-start', gap: spacing.sm },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.textSecondary,
    marginTop: 7,
    flexShrink: 0,
  },
  benefitText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
});
