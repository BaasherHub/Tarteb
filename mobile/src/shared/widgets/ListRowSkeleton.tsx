import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { SkeletonBlock } from '@/shared/widgets/SkeletonBlock';

type Props = {
  showSeparator?: boolean;
};

export const ListRowSkeleton = memo(function ListRowSkeleton({ showSeparator = true }: Props) {
  const rtl = useRtlStyles();
  return (
    <>
      <View style={[styles.row, rtl.row]}>
        <SkeletonBlock width={56} height={56} radius={spacing.md} />
        <View style={styles.meta}>
          <SkeletonBlock width="72%" height={spacing.lg} />
          <SkeletonBlock width="48%" height={spacing.md} />
          <SkeletonBlock width="88%" height={spacing.md} />
          <SkeletonBlock width="36%" height={spacing.sm} />
        </View>
      </View>
      {showSeparator ? <View style={styles.sep} /> : null}
    </>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.md,
    minHeight: 84,
  },
  meta: { flex: 1, minWidth: 0, gap: spacing.sm },
  sep: { height: 1, backgroundColor: colors.divider },
});
