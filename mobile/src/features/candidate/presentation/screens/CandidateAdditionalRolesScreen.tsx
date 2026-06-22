import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { supabase } from '@/core/lib/supabase';
import { RootStackParamList } from '@/core/navigation/types';
import { layout } from '@/core/theme/layout';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { ScreenFooter } from '@/shared/widgets/ScreenFooter';
import { SectionHint, SectionLabel } from '@/shared/widgets/SectionLabel';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { TabScreenScroll } from '@/shared/widgets/TabScreenScroll';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import {
  JobRoleGrid,
  type JobRoleGridFilterState,
} from '@/shared/widgets/JobRoleGrid';
import type { RoleCategoryId } from '@/features/candidate/domain/constants/candidate';
import {
  MAX_ADDITIONAL_ROLES_EXPORT,
  normalizeAdditionalRoles,
  parseAdditionalRoles,
  toggleAdditionalRole,
} from '@/shared/utils/candidateRoles';
import { getErrorMessage } from '@/shared/utils/errors';
import { useAppAlert } from '@/shared/hooks/useAppAlert';
import { ErrorState } from '@/shared/widgets/ErrorState';
import { ScreenLoading } from '@/shared/widgets/ScreenLoading';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateAdditionalRoles'>;

export function CandidateAdditionalRolesScreen({ navigation }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { showError } = useAppAlert();
  const [primaryRole, setPrimaryRole] = useState<string | null>(null);
  const [additionalRoles, setAdditionalRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<RoleCategoryId | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = userData.user?.id;
      if (!userId) throw new Error(t.errorGeneric);

      const { data: row, error } = await supabase
        .from('candidates')
        .select('role, additional_roles')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!row?.role) {
        navigation.replace('CandidateOnboarding', {});
        return;
      }

      const primary = String(row.role);
      setPrimaryRole(primary);
      setAdditionalRoles(
        normalizeAdditionalRoles(primary, parseAdditionalRoles(row.additional_roles)),
      );
    } catch (e) {
      setLoadError(getErrorMessage(e, t.errorGeneric));
    } finally {
      setLoading(false);
    }
  }, [navigation, t.errorGeneric]);

  useEffect(() => {
    load();
  }, [load]);

  const filter: JobRoleGridFilterState = useMemo(
    () => ({
      query,
      categoryId,
      onQueryChange: setQuery,
      onCategoryChange: setCategoryId,
    }),
    [query, categoryId],
  );

  const atCap = additionalRoles.length >= MAX_ADDITIONAL_ROLES_EXPORT;
  const listBanner = atCap ? t.jobRoleAdditionalCap : null;

  const toggleRole = (role: string) => {
    if (!primaryRole) return;
    setAdditionalRoles((prev) =>
      normalizeAdditionalRoles(
        primaryRole,
        toggleAdditionalRole(primaryRole, prev, role),
      ),
    );
  };

  const removeRole = (role: string) => {
    setAdditionalRoles((prev) => prev.filter((r) => r !== role));
  };

  const save = async () => {
    if (!primaryRole) return;
    setSaving(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not signed in');

      const normalized = normalizeAdditionalRoles(primaryRole, additionalRoles);
      const { error } = await supabase
        .from('candidates')
        .update({ additional_roles: normalized })
        .eq('user_id', userId);

      if (error) throw error;
      navigation.goBack();
    } catch (e) {
      showError(t.errorTitle, getErrorMessage(e, t.errorGeneric));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ContentWidth style={styles.flex}>
        <ScreenHeader title={t.candidateAdditionalRolesScreenTitle} onBack={() => navigation.goBack()} />
        <ScreenLoading message={t.loading} />
      </ContentWidth>
    );
  }

  if (loadError || !primaryRole) {
    return (
      <ContentWidth style={styles.flex}>
        <ScreenHeader title={t.candidateAdditionalRolesScreenTitle} onBack={() => navigation.goBack()} />
        <ErrorState
          title={t.errorTitle}
          message={loadError ?? t.errorGeneric}
          actionLabel={t.retry}
          onAction={() => void load()}
          secondaryLabel={t.back}
          onSecondary={() => navigation.goBack()}
        />
      </ContentWidth>
    );
  }

  return (
    <View style={styles.flex}>
      <ContentWidth style={styles.flex}>
        <ScreenHeader
          title={t.candidateAdditionalRolesScreenTitle}
          onBack={() => navigation.goBack()}
        />
        <TabScreenScroll keyboardShouldPersistTaps="handled">
          <Text style={[styles.intro, { textAlign: rtl.textAlign }]}>
            {t.candidateAdditionalRolesScreenIntro}
          </Text>

          <SurfaceCard inset style={styles.primaryBlock}>
            <Text style={[styles.primaryLabel, { textAlign: rtl.textAlign }]}>
              {t.candidatePrimaryRoleTitle}
            </Text>
            <Text style={[styles.primaryValue, { textAlign: rtl.textAlign }]}>
              {primaryRole}
            </Text>
            <Text style={[styles.primaryNote, { textAlign: rtl.textAlign }]}>
              {t.candidatePrimaryRoleEditNote}
            </Text>
          </SurfaceCard>

          <SectionLabel>{t.candidateAdditionalRolesTitle}</SectionLabel>
          <SectionHint>{t.candidateAdditionalRolesHint}</SectionHint>

          {additionalRoles.length > 0 ? (
            <View style={[styles.chips, rtl.row]}>
              {additionalRoles.map((r) => (
                <View key={r} style={[styles.chip, rtl.row]}>
                  <Text style={styles.chipText} numberOfLines={1}>
                    {r}
                  </Text>
                  <Pressable
                    onPress={() => removeRole(r)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={t.removeRole(r)}
                    style={({ pressed }) => [pressed && styles.pressed]}
                  >
                    <Text style={styles.chipClear}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.empty, { textAlign: rtl.textAlign }]}>
              {t.candidateAdditionalRolesEmpty}
            </Text>
          )}

          <JobRoleGrid
            filter={filter}
            selectionMode="multi"
            selectedRoles={additionalRoles}
            excludedRoles={[primaryRole]}
            maxSelections={MAX_ADDITIONAL_ROLES_EXPORT}
            onSelectRole={toggleRole}
            listBanner={listBanner}
          />
        </TabScreenScroll>

        <ScreenFooter>
          <PrimaryButton label={t.saveProfile} onPress={save} loading={saving} />
        </ScreenFooter>
      </ContentWidth>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  primaryBlock: {
    marginBottom: spacing.lg,
  },
  primaryLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  primaryValue: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  primaryNote: {
    ...typography.caption,
    color: colors.placeholder,
    marginTop: spacing.sm,
  },
  chips: { flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryTint,
    borderRadius: layout.cardRadius,
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: `${colors.primary}44`,
    maxWidth: '100%',
  },
  chipText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
    flexShrink: 1,
  },
  chipClear: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: spacing.sm,
  },
  empty: {
    ...typography.caption,
    color: colors.placeholder,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  pressed: { opacity: interaction.pressed },
});
