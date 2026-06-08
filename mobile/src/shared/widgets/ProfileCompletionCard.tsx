import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { layout } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import type { ProfileCompletionResult } from '@/shared/utils/profileCompletion';

type Props = {
  completion: ProfileCompletionResult;
  onImprove?: () => void;
  variant?: 'candidate' | 'employer';
};

export function ProfileCompletionCard({
  completion,
  onImprove,
  variant = 'candidate',
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { percent, nextItem } = completion;
  const complete = percent >= 100;

  const isEmployer = variant === 'employer';
  const milestoneKey = nextItem?.id ?? 'complete';
  const milestoneLabel = t.profileMilestoneLabel(milestoneKey);
  const headline = complete
    ? isEmployer
      ? t.employerProfileCompleteHeadline
      : t.profileCompleteHeadline
    : isEmployer
      ? t.employerProfileCompletionHeadline(percent)
      : t.profileCompletionHeadline(percent);
  const sub = complete
    ? isEmployer
      ? t.employerProfileCompleteCelebration
      : t.profileCompleteCelebration
    : t.profileCompletionNext(milestoneLabel);

  const accent = variant === 'employer' ? colors.secondary : colors.primary;

  return (
    <Pressable
      onPress={!complete && onImprove ? onImprove : undefined}
      disabled={complete || !onImprove}
      style={[styles.card, complete && styles.cardComplete]}
      accessibilityRole={onImprove && !complete ? 'button' : 'text'}
      accessibilityLabel={headline}
    >
      <View style={[styles.row, rtl.row]}>
        <View style={styles.textCol}>
          {complete ? (
            <View style={[styles.celebrateRow, rtl.row]}>
              <AppIcon name="checkmark-circle" size={22} color={colors.secondary} />
              <Text style={[styles.headline, { textAlign: rtl.textAlign }]}>{headline}</Text>
            </View>
          ) : (
            <Text style={[styles.headline, { textAlign: rtl.textAlign }]}>{headline}</Text>
          )}
          <Text
            style={[
              styles.sub,
              { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
            ]}
          >
            {sub}
          </Text>
        </View>
        <View style={[styles.ring, { borderColor: accent }]}>
          <Text style={[styles.percent, { color: accent }]}>{percent}%</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: accent }]} />
      </View>
      {!complete && onImprove ? (
        <Text style={[styles.cta, { textAlign: rtl.textAlignEnd, color: accent }]}>
          {isEmployer ? t.employerProfileCompletionCta : t.profileCompletionCta}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    padding: layout.cardPadding,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  cardComplete: {
    borderColor: `${colors.secondary}50`,
    backgroundColor: colors.secondaryTint,
  },
  row: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  textCol: { flex: 1, minWidth: 0 },
  celebrateRow: { alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  headline: { ...typography.h3 },
  sub: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
  ring: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.scaffold,
  },
  percent: { fontSize: 15, fontWeight: '800' },
  track: {
    height: 6,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
  cta: { ...typography.caption, fontWeight: '700', marginTop: spacing.sm },
});
