import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { spacing } from '@/core/theme/spacing';
import { ListRowSkeleton } from '@/shared/widgets/ListRowSkeleton';

type Props = { rows?: number };

export const BrowseListSkeleton = memo(function BrowseListSkeleton({ rows = 6 }: Props) {
  const { t } = useLocale();
  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityLabel={t.a11yLoadingList}
      accessibilityLiveRegion="polite"
    >
      {Array.from({ length: rows }, (_, i) => (
        <ListRowSkeleton key={i} showSeparator={i < rows - 1} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.xs },
});
