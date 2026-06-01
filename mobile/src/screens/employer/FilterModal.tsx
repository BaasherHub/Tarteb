import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import { BrowseFilters, emptyFilters } from '../../services/candidateBrowse';
import {
  CANDIDATE_ROLES,
  LOCATIONS,
  VISA_STATUSES,
} from '../../constants/candidate';
import { colors } from '../../constants/colors';

type Props = {
  visible: boolean;
  initial: BrowseFilters;
  onClose: () => void;
  onApply: (filters: BrowseFilters) => void;
};

export function FilterModal({ visible, initial, onClose, onApply }: Props) {
  const { t } = useLocale();
  const [filters, setFilters] = useState(initial);

  const toggle = (key: 'roles' | 'visaStatuses' | 'locations', value: string) => {
    setFilters((f) => {
      const set = new Set(f[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...f, [key]: [...set] };
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.sheet}>
        <Text style={styles.title}>{t.filters}</Text>
        <ScrollView>
          <Section title="Roles">
            <ChipRow
              options={CANDIDATE_ROLES}
              selected={filters.roles}
              onToggle={(v) => toggle('roles', v)}
            />
          </Section>
          <Section title="Visa">
            <ChipRow
              options={VISA_STATUSES}
              selected={filters.visaStatuses}
              onToggle={(v) => toggle('visaStatuses', v)}
            />
          </Section>
          <Section title={t.location}>
            <ChipRow
              options={LOCATIONS}
              selected={filters.locations}
              onToggle={(v) => toggle('locations', v)}
            />
          </Section>
          <Text style={styles.label}>{t.nationality}</Text>
          <TextInput
            style={styles.input}
            value={filters.nationalitySearch}
            onChangeText={(nationalitySearch) =>
              setFilters((f) => ({ ...f, nationalitySearch }))
            }
            placeholder="Search..."
          />
          <Text
            onPress={() =>
              setFilters((f) => ({ ...f, availableNow: !f.availableNow }))
            }
            style={[styles.chip, filters.availableNow && styles.chipOn]}
          >
            {t.availableNow}
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            label={t.reset}
            onPress={() => setFilters(emptyFilters)}
          />
          <PrimaryButton
            label={t.apply}
            onPress={() => {
              onApply(filters);
              onClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.section}>{title}</Text>
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
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <Text
            key={opt}
            onPress={() => onToggle(opt)}
            style={[styles.chip, on && styles.chipOn]}
          >
            {opt}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, padding: 20, backgroundColor: colors.scaffold },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  section: { fontWeight: '600', marginBottom: 8 },
  label: { marginTop: 8, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: `${colors.primary}15` },
  footer: { gap: 8, paddingTop: 12 },
});
