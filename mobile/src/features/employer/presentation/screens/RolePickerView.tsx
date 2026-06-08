import { memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { JobRoleGrid } from '@/shared/widgets/JobRoleGrid';
import { OnboardingStepIntro } from '@/shared/widgets/OnboardingStepIntro';
import { fetchRoleCounts } from '@/features/employer/data/services/candidateBrowse';

type Props = {
  onSelectRole: (role: string) => void;
};

export const RolePickerView = memo(function RolePickerView({ onSelectRole }: Props) {
  const { t } = useLocale();
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
      <OnboardingStepIntro>{t.browsePickRoleHint}</OnboardingStepIntro>
      <JobRoleGrid onSelectRole={onSelectRole} counts={counts} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    ...layoutStyles.screenContent,
    gap: spacing.lg,
  },
});
