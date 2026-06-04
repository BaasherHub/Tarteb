import { memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { JobRoleGrid } from '@/shared/widgets/JobRoleGrid';
import { fetchRoleCounts } from '@/features/employer/data/services/candidateBrowse';

type Props = {
  onSelectRole: (role: string) => void;
};

export const RolePickerView = memo(function RolePickerView({ onSelectRole }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const [counts, setCounts] = useState<Record<string, number>>({});

  const loadCounts = useCallback(() => {
    fetchRoleCounts()
      .then(setCounts)
      .catch(() => setCounts({}));
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { textAlign: rtl.textAlign }]} numberOfLines={2}>
        {t.browsePickRole}
      </Text>
      <Text
        style={[styles.hint, { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection }]}
        numberOfLines={4}
      >
        {t.browsePickRoleHint}
      </Text>
      <JobRoleGrid onSelectRole={onSelectRole} counts={counts} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
  },
  title: { ...typography.h2 },
  hint: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
});
