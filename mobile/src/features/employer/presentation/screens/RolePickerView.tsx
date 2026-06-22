import { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { JobRoleGrid } from '@/shared/widgets/JobRoleGrid';
import { OnboardingStepIntro } from '@/shared/widgets/OnboardingStepIntro';
import { useRoleCounts } from '@/features/employer/data/services/candidateBrowse';
import { ScreenLoading } from '@/shared/widgets/ScreenLoading';
import { ErrorState } from '@/shared/widgets/ErrorState';
import { getErrorMessage } from '@/shared/utils/errors';

type Props = {
  onSelectRole: (role: string) => void;
};

export const RolePickerView = memo(function RolePickerView({ onSelectRole }: Props) {
  const { t } = useLocale();
  const { data: counts, error, isPending, refetch } = useRoleCounts();

  if (isPending) return <ScreenLoading message={t.loading} />;
  if (error) {
    return (
      <ErrorState
        title={t.errorTitle}
        message={getErrorMessage(error, t.errorLoadList)}
        actionLabel={t.retry}
        onAction={() => void refetch()}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <OnboardingStepIntro>{t.browsePickRoleHint}</OnboardingStepIntro>
      <JobRoleGrid onSelectRole={onSelectRole} counts={counts ?? {}} />
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
