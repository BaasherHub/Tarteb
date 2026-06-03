import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { SelectableChip } from '../../components/SelectableChip';
import { AutocompleteField } from '../../components/AutocompleteField';
import { FormField } from '../../components/FormField';
import { LocationFilterSection } from '../../components/LocationFilterSection';
import { useLocale } from '../../i18n/LocaleContext';
import {
  BrowseFilters,
  SALARY_FILTER_MAX,
  emptyFilters,
  filtersForRole,
} from '../../services/candidateBrowse';
import {
  EXPERIENCE_OPTIONS,
  LANGUAGE_OPTIONS,
  POPULAR_LANGUAGES,
  VISA_STATUSES,
} from '../../constants/candidate';
import { filterNationalities, resolveNationality } from '../../constants/nationalities';
import { colors } from '../../constants/colors';

type Props = {
  visible: boolean;
  role: string;
  initial: BrowseFilters;
  onClose: () => void;
  onApply: (filters: BrowseFilters) => void;
};

export function RefineFiltersModal({
  visible,
  role,
  initial,
  onClose,
  onApply,
}: Props) {
  const { t } = useLocale();
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

  const toggleList = <K extends keyof BrowseFilters>(
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
  };

  const apply = () => {
    const nationality =
      resolveNationality(nationalityQuery) ?? nationalityQuery.trim();
    onApply({ ...filters, roles: [role], nationalitySearch: nationality });
    onClose();
  };

  const reset = () => {
    const base = filtersForRole(role);
    setFilters(base);
    setNationalityQuery('');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.sheet}>
        <Text style={styles.title}>{t.browseRefine}</Text>
        <Text style={styles.roleLine}>{t.candidatesForRole(role)}</Text>
        <Text style={styles.optionalHint}>{t.filterOptionalHint}</Text>

        <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
          <Section title={t.nationality}>
            <AutocompleteField
              label={t.nationality}
              hint={t.nationalityHint}
              value={nationalityQuery}
              onChangeText={setNationalityQuery}
              onSelect={(n) => {
                setNationalityQuery(n);
                setFilters((f) => ({ ...f, nationalitySearch: n }));
              }}
              options={nationalityOptions}
              placeholder={t.nationalityPlaceholder}
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
            <View style={styles.salaryRow}>
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
                  placeholder={t.salaryMinPlaceholder}
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
                  placeholder={t.salaryMaxPlaceholder}
                />
              </View>
            </View>
          </Section>

          <Section title={t.filterExperience}>
            <View style={styles.wrap}>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <SelectableChip
                  key={opt.years}
                  label={opt.label}
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
            <View style={styles.row}>
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
          <SecondaryButton label={t.reset} onPress={reset} />
          <PrimaryButton label={t.apply} onPress={apply} />
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ChipRow({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <View style={styles.wrap}>
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
}

const styles = StyleSheet.create({
  sheet: { flex: 1, padding: 20, backgroundColor: colors.scaffold },
  title: { fontSize: 22, fontWeight: '700' },
  roleLine: { fontSize: 15, color: colors.primary, fontWeight: '600', marginTop: 4 },
  optionalHint: { fontSize: 13, color: colors.textSecondary, marginTop: 8, marginBottom: 12 },
  scroll: { flex: 1 },
  section: { marginBottom: 18 },
  sectionTitle: { fontWeight: '600', marginBottom: 8, fontSize: 15 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  salaryRow: { flexDirection: 'row', gap: 12 },
  salaryHalf: { flex: 1 },
  footer: { gap: 10, paddingTop: 12 },
});
