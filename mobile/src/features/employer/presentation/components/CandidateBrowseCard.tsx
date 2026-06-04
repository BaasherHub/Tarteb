import { memo } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { usePressScale } from '@/shared/hooks/usePressScale';
import { candidateCardA11yLabel } from '@/shared/utils/a11y';
import { VisaChip } from '@/shared/widgets/VisaChip';

type Props = {
  item: Record<string, unknown>;
  onPress: () => void;
};

function CandidateBrowseCardInner({
  item,
  onPress,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const name = String(item.name ?? '—');
  const role = String(item.role ?? '');
  const location = String(item.location ?? '');
  const nationality = String(item.nationality ?? '');
  const visa = String(item.visa_status ?? '');
  const salary = item.salary_expectation;
  const photoUrl = item.photo_url as string | undefined;
  const unlocked = item.phone != null;
  const lastActiveAt = item.last_active_at as string | undefined;
  const activeDays = lastActiveAt
    ? Math.floor((Date.now() - new Date(lastActiveAt).getTime()) / 86_400_000)
    : null;
  const activeAgo = activeDays !== null ? t.activeAgo(activeDays) : undefined;

  const a11yLabel = candidateCardA11yLabel(t, {
    name,
    role,
    location:
      salary != null
        ? `${location}. ${t.salaryPerMonth(String(salary))}`
        : location,
    nationality: nationality || undefined,
    unlocked,
    activeAgo,
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={t.a11yOpensCandidateProfile}
    >
      <Animated.View
        style={[styles.row, rtl.row, animatedStyle]}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.initials}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.meta}>
          <View style={[styles.nameRow, rtl.row]}>
            <Text
              style={[styles.name, { textAlign: rtl.textAlign }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
            {unlocked ? (
              <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedText} numberOfLines={1}>
                  {t.unlockedBadge}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            style={[styles.role, { textAlign: rtl.textAlign }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {role}
          </Text>
          <View style={[styles.chipRow, rtl.row]}>
            {visa ? <VisaChip label={visa} /> : null}
            {nationality ? (
              <Text
                style={[styles.nat, { textAlign: rtl.textAlign }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {nationality}
              </Text>
            ) : null}
          </View>
          <Text
            style={[styles.sub, { textAlign: rtl.textAlign }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {location}
            {salary != null ? ` · ${t.salaryPerMonth(String(salary))}` : ''}
          </Text>
          {activeAgo ? (
            <Text
              style={[
                styles.activeAgo,
                { textAlign: rtl.textAlign },
                activeDays !== null && activeDays <= 3 && styles.activeAgoFresh,
              ]}
              numberOfLines={1}
            >
              {activeAgo}
            </Text>
          ) : null}
        </View>
        <Text style={styles.chevron} importantForAccessibility="no">
          {rtl.isRtl ? '‹' : '›'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export const CandidateBrowseCard = memo(
  CandidateBrowseCardInner,
  (prev, next) => prev.item === next.item && prev.onPress === next.onPress,
);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.md,
    minHeight: 84,
  },
  photo: { width: 56, height: 56, borderRadius: 12, flexShrink: 0 },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: { fontSize: 22, fontWeight: '700', color: colors.primary },
  meta: { flex: 1, minWidth: 0 },
  nameRow: {
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  name: { ...typography.h3, flexShrink: 1, minWidth: 0 },
  role: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  chipRow: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  nat: { ...typography.caption, color: colors.textSecondary, flexShrink: 1, maxWidth: '100%' },
  sub: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: '300',
    flexShrink: 0,
    paddingHorizontal: spacing.xs,
  },
  unlockedBadge: {
    backgroundColor: `${colors.secondary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    flexShrink: 0,
  },
  unlockedText: { fontSize: 11, fontWeight: '700', color: colors.secondary },
  activeAgo: { fontSize: 11, color: colors.textSecondary, marginTop: spacing.xs },
  activeAgoFresh: { color: colors.secondary, fontWeight: '600' },
});
