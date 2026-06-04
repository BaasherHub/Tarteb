import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import { JobRoleGrid } from '@/shared/widgets/JobRoleGrid';
import { fetchRoleCounts } from '@/features/employer/data/services/candidateBrowse';

type Props = {
  onSelectRole: (role: string) => void;
};

export function RolePickerView({ onSelectRole }: Props) {
  const { t } = useLocale();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchRoleCounts()
      .then(setCounts)
      .catch(() => {});
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{t.browsePickRole}</Text>
      <Text style={styles.hint}>{t.browsePickRoleHint}</Text>
      <JobRoleGrid onSelectRole={onSelectRole} counts={counts} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: { ...typography.h2, marginBottom: 8 },
  hint: { color: colors.textSecondary, lineHeight: 22, marginBottom: 20 },
});

