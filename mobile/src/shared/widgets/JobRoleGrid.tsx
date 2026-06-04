import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { usePressScale } from '@/shared/hooks/usePressScale';
import { chipA11yProps } from '@/shared/utils/a11y';
import { useIsCompactScreen } from '@/shared/utils/layout';
import { POPULAR_ROLES, ROLE_CATEGORIES } from '@/features/candidate/domain/constants/candidate';

type Props = {
  selectedRole?: string | null;
  onSelectRole: (role: string) => void;
  counts?: Record<string, number>;
};

function RoleCard({
  role,
  selected,
  count,
  onSelectRole,
  compact,
}: {
  role: string;
  selected: boolean;
  count?: number;
  onSelectRole: (role: string) => void;
  compact: boolean;
}) {
  const { t } = useLocale();
  const a11y = chipA11yProps(role, selected, t);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={() => onSelectRole(role)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      {...a11y}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.card,
          compact && styles.cardCompact,
          selected && styles.cardSelected,
          animatedStyle,
        ]}
      >
        <Text
          style={[styles.label, selected && styles.labelSelected]}
          numberOfLines={2}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1.25}
        >
          {role}
        </Text>
        {count != null && count > 0 && (
          <Text style={[styles.count, selected && styles.countSelected]}>{count}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const JobRoleGrid = memo(function JobRoleGrid({ selectedRole, onSelectRole, counts }: Props) {
  const { lang } = useLocale();
  const rtl = useRtlStyles();
  const compact = useIsCompactScreen();

  return (
    <View style={styles.root}>
      <Text
        style={[styles.sectionHeader, { textAlign: rtl.textAlign }]}
        accessibilityRole="header"
      >
        {lang === 'ar' ? 'الأكثر طلباً' : 'Popular'}
      </Text>
      <View style={[styles.grid, rtl.row]}>
        {POPULAR_ROLES.map((role) => (
          <RoleCard
            key={role}
            role={role}
            selected={selectedRole === role}
            count={counts?.[role]}
            onSelectRole={onSelectRole}
            compact={compact}
          />
        ))}
      </View>

      {ROLE_CATEGORIES.map((cat) => (
        <View key={cat.label} style={styles.category}>
          <Text
            style={[styles.sectionHeader, { textAlign: rtl.textAlign }]}
            accessibilityRole="header"
          >
            {lang === 'ar' ? cat.labelAr : cat.label}
          </Text>
          <View style={[styles.grid, rtl.row]}>
            {cat.roles.map((role) => (
              <RoleCard
                key={role}
                role={role}
                selected={selectedRole === role}
                count={counts?.[role]}
                onSelectRole={onSelectRole}
                compact={compact}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  category: { marginTop: spacing.sm },
  sectionHeader: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  grid: { flexWrap: 'wrap', gap: spacing.md },
  pressable: { minWidth: '47%', flexGrow: 1, flexBasis: '45%' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardCompact: {
    minWidth: '100%',
    flexBasis: '100%',
    paddingVertical: spacing.md,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  label: { ...typography.body, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  labelSelected: { color: colors.primary },
  count: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  countSelected: { color: colors.primary },
});
