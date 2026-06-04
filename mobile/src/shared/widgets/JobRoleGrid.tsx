import React, { memo, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { chipA11yProps } from '@/shared/utils/a11y';
import {
  POPULAR_ROLES,
  SORTED_CANDIDATE_ROLES,
} from '@/features/candidate/domain/constants/candidate';

type Props = {
  selectedRole?: string | null;
  onSelectRole: (role: string) => void;
  counts?: Record<string, number>;
};

function matchesQuery(role: string, query: string): boolean {
  return role.toLowerCase().includes(query.trim().toLowerCase());
}

export const JobRoleGrid = memo(function JobRoleGrid({
  selectedRole,
  onSelectRole,
  counts,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const [query, setQuery] = useState('');

  const popularSet = useMemo(() => new Set(POPULAR_ROLES), []);

  const filteredPopular = useMemo(() => {
    if (!query.trim()) return POPULAR_ROLES;
    return POPULAR_ROLES.filter((r) => matchesQuery(r, query));
  }, [query]);

  const filteredOther = useMemo(() => {
    const base = SORTED_CANDIDATE_ROLES.filter((r) => !popularSet.has(r));
    if (!query.trim()) return base;
    return base.filter((r) => matchesQuery(r, query));
  }, [query, popularSet]);

  const showPopular = filteredPopular.length > 0;
  const showAll = filteredOther.length > 0;

  return (
    <View style={styles.root}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t.jobRoleSearchPlaceholder}
        placeholderTextColor={colors.placeholder}
        style={[styles.search, { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection }]}
        accessibilityLabel={t.jobRoleSearchPlaceholder}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {selectedRole ? (
        <View style={[styles.selectedBar, rtl.row]}>
          <Text style={[styles.selectedLabel, { textAlign: rtl.textAlign }]} numberOfLines={1}>
            {t.roleSelected}
          </Text>
          <Text style={[styles.selectedValue, { textAlign: rtl.textAlignEnd }]} numberOfLines={1}>
            {selectedRole}
          </Text>
        </View>
      ) : null}

      {showPopular ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: rtl.textAlign }]}>
            {t.popularRoles}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.popularRow, rtl.row]}
            keyboardShouldPersistTaps="handled"
          >
            {filteredPopular.map((role) => {
              const selected = selectedRole === role;
              const a11y = chipA11yProps(role, selected, t);
              return (
                <Pressable
                  key={role}
                  onPress={() => onSelectRole(role)}
                  style={({ pressed }) => [
                    styles.popularChip,
                    selected && styles.popularChipSelected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  {...a11y}
                >
                  <Text
                    style={[styles.popularChipText, selected && styles.popularChipTextSelected]}
                    numberOfLines={1}
                  >
                    {role}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      {showAll ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: rtl.textAlign }]}>
            {t.allJobRoles}
          </Text>
          <View style={styles.list}>
            {filteredOther.map((role, index) => {
              const selected = selectedRole === role;
              const count = counts?.[role];
              const a11y = chipA11yProps(role, selected, t);
              return (
                <Pressable
                  key={role}
                  onPress={() => onSelectRole(role)}
                  style={({ pressed }) => [
                    styles.listRow,
                    rtl.row,
                    index > 0 && styles.listRowBorder,
                    selected && styles.listRowSelected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  {...a11y}
                >
                  <Text
                    style={[styles.listLabel, selected && styles.listLabelSelected]}
                    numberOfLines={2}
                  >
                    {role}
                  </Text>
                  <View style={[styles.listMeta, rtl.row]}>
                    {count != null && count > 0 ? (
                      <Text style={styles.count}>{count}</Text>
                    ) : null}
                    {selected ? (
                      <AppIcon name="checkmark-circle" size={22} color={colors.primary} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {!showPopular && !showAll ? (
        <Text style={[styles.empty, { textAlign: rtl.textAlignCenter }]}>{t.jobRoleNoMatch}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  search: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
    color: colors.textPrimary,
  },
  selectedBar: {
    backgroundColor: colors.primaryTint,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
  },
  selectedLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    flexShrink: 0,
  },
  selectedValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    flex: 1,
  },
  section: { gap: spacing.sm },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  popularRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  popularChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.divider,
    maxWidth: 200,
  },
  popularChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  popularChipText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  popularChipTextSelected: {
    color: colors.primary,
  },
  list: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  listRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
    gap: spacing.md,
  },
  listRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  listRowSelected: {
    backgroundColor: colors.primaryTint,
  },
  listLabel: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  listLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  listMeta: {
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  pressed: { opacity: interaction.pressed },
  empty: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingVertical: spacing.xl,
  },
});
