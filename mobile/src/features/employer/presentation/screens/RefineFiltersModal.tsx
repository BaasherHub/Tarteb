import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import {
  BrowseFilters,
  SALARY_FILTER_MAX,
  filtersForRole,
} from '@/features/employer/data/services/candidateBrowse';
import { filterNationalities, resolveNationality } from '@/shared/constants/nationalities';
import { colors } from '@/core/theme/colors';
import { layout, layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { SectionLabel } from '@/shared/widgets/SectionLabel';
import { FormField } from '@/shared/widgets/FormField';
import { LocationFilterSection } from '@/features/employer/presentation/components/LocationFilterSection';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { SelectableChip } from '@/shared/widgets/SelectableChip';
import { AutocompleteField } from '@/shared/widgets/AutocompleteField';
import {
  EXPERIENCE_OPTIONS,
  LANGUAGE_OPTIONS,
  POPULAR_LANGUAGES,
  VISA_STATUSES,
} from '@/features/candidate/domain/constants/candidate';

type Props = {
  visible: boolean;
  role: string;
  initial: BrowseFilters;
  onClose: () => void;
  onApply: (filters: BrowseFilters) => void;
};

function RefineFiltersModalInner({
  visible,
  role,
  initial,
  onClose,
  onApply,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const [filters, setFilters] = useState(initial);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [nationalityQuery, setNationalityQuery] = useState(initial.nationalitySearch);

  useEffect(() => {
    if (visible) {
      setFilters(initial);
      setNationalityQuery(initial.nationalitySearch);
    }
  }, [visible, initial]);

  const nationalityOptions = useMemo(
    () => filterNationalities(nationalityQuery),
    [nationalityQuery],
  );

  const visibleLanguages = showAllLanguages ? LANGUAGE_OPTIONS : POPULAR_LANGUAGES;
  const moreLanguages = LANGUAGE_OPTIONS.filter((l) => !POPULAR_LANGUAGES.includes(l));

  const toggleList = useCallback(
    <K extends keyof BrowseFilters>(
      key: K,
      value: BrowseFilters[K] extends (infer U)[] ? U : never,
    ) => {
      setFilters((f) => {
        const list = f[key] as unknown[];
        const set = new Set(list);
        if (set.has(value)) set.delete(value);
        else set.add(value);
        return { ...f, [key]: [...set] as BrowseFilters[K] };
      });
    },
    [],
  );

  const apply = useCallback(() => {
    const nationality =
      resolveNationality(nationalityQuery) ?? nationalityQuery.trim();
    onApply({ ...filters, roles: [role], nationalitySearch: nationality });
    onClose();
  }, [filters, nationalityQuery, onApply, onClose, role]);

  const reset = useCallback(() => {
    const base = filtersForRole(role);
    setFilters(base);
    setNationalityQuery('');
  }, [role]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <SafeAreaView
        style={styles.sheet}
        edges={['top', 'bottom']}
        accessibilityLabel={t.a11yFilterModal}
      >
        <View style={styles.header} accessibilityRole="header">
          <Text
            style={[styles.title, { textAlign: rtl.textAlign }]}
            numberOfLines={2}
            accessibilityRole="header"
            maxFontSizeMultiplier={1.3}
          >
            {t.browseRefine}
          </Text>
          <Text
            style={[styles.roleLine, { textAlign: rtl.textAlign }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {t.candidatesForRole(role)}
          </Text>
          <Text
            style={[styles.optionalHint, { textAlign: rtl.textAlign }]}
            numberOfLines={3}
          >
            {t.filterOptionalHint}
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <Section title={t.nationality} first>
            <AutocompleteField
              label={t.nationality}
              value={nationalityQuery}
              onChangeText={setNationalityQuery}
              onSelect={(n) => {
                setNationalityQuery(n);
                setFilters((f) => ({ ...f, nationalitySearch: n }));
              }}
              options={nationalityOptions}
            />
          </Section>

          <Section title={t.location}>
            <LocationFilterSection
              locations={filters.locations}
              onChange={(locations) => setFilters((f) => ({ ...f, locations }))}
            />
          </Section>

          <Section title={t.filterVisa}>
            <ChipRow
              options={VISA_STATUSES}
              selected={filters.visaStatuses}
              onToggle={(v) => toggleList('visaStatuses', v)}
            />
          </Section>

          <Section title={t.filterSalaryRange}>
            <View style={[styles.salaryRow, rtl.row]}>
              <View style={styles.salaryHalf}>
                <FormField
                  label={t.salaryMinLabel}
                  keyboardType="number-pad"
                  value={filters.salaryMin > 0 ? String(filters.salaryMin) : ''}
                  onChangeText={(v) =>
                    setFilters((f) => ({
                      ...f,
                      salaryMin: parseInt(v, 10) || 0,
                    }))
                  }
                />
              </View>
              <View style={styles.salaryHalf}>
                <FormField
                  label={t.salaryMaxLabel}
                  keyboardType="number-pad"
                  value={
                    filters.salaryMax < SALARY_FILTER_MAX
                      ? String(filters.salaryMax)
                      : ''
                  }
                  onChangeText={(v) =>
                    setFilters((f) => ({
                      ...f,
                      salaryMax: parseInt(v, 10) || SALARY_FILTER_MAX,
                    }))
                  }
                />
              </View>
            </View>
          </Section>

          <Section title={t.filterExperience}>
            <View style={[styles.chipRow, rtl.row]}>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <SelectableChip
                  key={opt.years}
                  label={t.experienceBucketLabel(opt.years)}
                  selected={filters.experienceYears.includes(opt.years)}
                  onPress={() => toggleList('experienceYears', opt.years)}
                />
              ))}
            </View>
          </Section>

          <Section title={t.browseFilterLanguages}>
            <ChipRow
              options={visibleLanguages}
              selected={filters.languages}
              onToggle={(v) => toggleList('languages', v)}
            />
            {!showAllLanguages && moreLanguages.length > 0 ? (
              <SelectableChip
                label={t.moreLanguages}
                selected={false}
                onPress={() => setShowAllLanguages(true)}
              />
            ) : null}
          </Section>

          <Section title={t.filterUaeExp}>
            <View style={[styles.chipRow, rtl.row]}>
              <SelectableChip
                label={t.filterAny}
                selected={filters.uaeExperience === null}
                onPress={() => setFilters((f) => ({ ...f, uaeExperience: null }))}
              />
              <SelectableChip
                label={t.yes}
                selected={filters.uaeExperience === true}
                onPress={() => setFilters((f) => ({ ...f, uaeExperience: true }))}
              />
              <SelectableChip
                label={t.no}
                selected={filters.uaeExperience === false}
                onPress={() => setFilters((f) => ({ ...f, uaeExperience: false }))}
              />
            </View>
          </Section>

          <Section title={t.availableFrom}>
            <SelectableChip
              label={t.availableNow}
              selected={filters.availableNow}
              onPress={() =>
                setFilters((f) => ({ ...f, availableNow: !f.availableNow }))
              }
            />
          </Section>
        </ScrollView>

        <View style={styles.footer}>
          <SecondaryButton
            label={t.reset}
            onPress={reset}
            accessibilityHint={t.a11yResetFilters}
          />
          <PrimaryButton
            label={t.apply}
            onPress={apply}
            accessibilityHint={t.a11yApplyFilters}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export const RefineFiltersModal = memo(RefineFiltersModalInner);

const Section = memo(function Section({
  title,
  children,
  first,
}: {
  title: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <View style={styles.section}>
      <SectionLabel first={first}>{title}</SectionLabel>
      {children}
    </View>
  );
});

const ChipRow = memo(function ChipRow({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const rtl = useRtlStyles();
  return (
    <View style={[styles.chipRow, rtl.row]}>
      {options.map((opt) => (
        <SelectableChip
          key={opt}
          label={opt}
          selected={selected.includes(opt)}
          onPress={() => onToggle(opt)}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.scaffold },
  header: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  roleLine: { ...typography.h3, color: colors.primary },
  optionalHint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: { marginBottom: spacing.lg },
  chipRow: { flexWrap: 'wrap', gap: spacing.sm },
  salaryRow: { gap: spacing.md, alignItems: 'flex-start' },
  salaryHalf: { flex: 1, minWidth: 0 },
  footer: {
    ...layoutStyles.footer,
    backgroundColor: colors.surface,
  },
});
