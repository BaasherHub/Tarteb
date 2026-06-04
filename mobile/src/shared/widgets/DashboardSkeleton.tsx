import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { SkeletonBlock } from '@/shared/widgets/SkeletonBlock';

export const DashboardSkeleton = memo(function DashboardSkeleton() {
  const rtl = useRtlStyles();
  return (
    <View style={styles.wrap}>
      <View style={styles.profileCard}>
        <SkeletonBlock width={100} height={100} radius={50} style={styles.avatar} />
        <SkeletonBlock width="60%" height={spacing.xl} />
        <SkeletonBlock width="40%" height={spacing.lg} />
        <SkeletonBlock width="50%" height={spacing.md} />
      </View>
      <View style={styles.statCard}>
        <SkeletonBlock width="55%" height={spacing.lg} />
        <SkeletonBlock width="30%" height={spacing.xxxl} style={styles.statValue} />
        <SkeletonBlock width="80%" height={spacing.md} />
      </View>
      <View style={[styles.toggleCard, rtl.rowBetween]}>
        <SkeletonBlock width="50%" height={spacing.lg} />
        <SkeletonBlock width={48} height={spacing.xxl} radius={spacing.lg} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg, paddingTop: spacing.sm },
  profileCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: spacing.sm,
  },
  avatar: { marginBottom: spacing.sm },
  statCard: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    gap: spacing.sm,
  },
  statValue: { marginVertical: spacing.sm },
  toggleCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});
