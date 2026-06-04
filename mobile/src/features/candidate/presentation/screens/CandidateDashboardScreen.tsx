import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '@/core/lib/supabase';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { VisaChip } from '@/shared/widgets/VisaChip';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { DashboardSkeleton } from '@/shared/widgets/DashboardSkeleton';
import { onboardingFromRow } from '@/features/candidate/domain/types/candidateOnboarding';
import { registerPushTokenIfGranted } from '@/core/services/notifications';
import { getErrorMessage } from '@/shared/utils/errors';


type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CandidateDashboardScreen() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const navigation = useNavigation<Nav>();
  const [candidate, setCandidate] = useState<Record<string, unknown> | null>(null);
  const [unlocks, setUnlocks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const inShell = Boolean(
    navigation.getParent()?.getState?.()?.routeNames?.includes('SettingsTab'),
  );

  const load = useCallback(async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const { data: row } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!row) {
        navigation.navigate('CandidateOnboarding', {});
        return;
      }

      const { data: unlockRows } = await supabase
        .from('unlocks')
        .select('id')
        .eq('candidate_id', row.id as string);

      setCandidate(row as Record<string, unknown>);
      setUnlocks(unlockRows?.length ?? 0);

      // Stamp last_active_at so the candidate appears fresh in employer browse.
      await supabase
        .from('candidates')
        .update({ last_active_at: new Date().toISOString() })
        .eq('user_id', userId);

      // Register push token silently — no-op if permission denied.
      registerPushTokenIfGranted().catch(() => {});
    } catch (e) {
      Alert.alert(t.errorTitle, getErrorMessage(e, t.errorGeneric));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation, t.errorGeneric]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (value: boolean) => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;
    await supabase
      .from('candidates')
      .update({
        is_active: value,
        availability_status: value ? 'looking' : 'paused',
      })
      .eq('user_id', userId);
    load();
  };

  const markHired = () => {
    Alert.alert(
      '🎉 Got hired?',
      "Congratulations! Mark your profile as hired and it will be hidden from employers.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I got hired!',
          onPress: async () => {
            const userId = (await supabase.auth.getUser()).data.user?.id;
            if (!userId) return;
            await supabase
              .from('candidates')
              .update({ is_active: false, availability_status: 'hired' })
              .eq('user_id', userId);
            load();
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        <ContentWidth grow={false}>
          <ScreenHeader title={t.home} />
          <DashboardSkeleton />
        </ContentWidth>
      </ScrollView>
    );
  }

  if (!candidate) return null;

  const isActive = candidate.is_active !== false;
  const availabilityStatus = String(candidate.availability_status ?? 'looking');
  const isHired = availabilityStatus === 'hired';
  const photoUrl = candidate.photo_url as string | undefined;
  const visa = String(candidate.visa_status ?? '');
  const salary = candidate.salary_expectation;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      <ContentWidth grow={false}>
        <ScreenHeader
          title={t.home}
          onSettings={
            inShell
              ? undefined
              : () => navigation.navigate('Settings', undefined)
          }
        />

        {isHired && (
          <View style={[styles.banner, styles.bannerHired]}>
            <Text style={styles.bannerTextHired}>🎉 You got hired — profile hidden from employers</Text>
          </View>
        )}
        {!isActive && !isHired && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{t.profilePaused}</Text>
          </View>
        )}

        <View style={styles.card}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPh]}>
              <Text style={styles.initials}>
                {String(candidate.name ?? '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.name} numberOfLines={2}>
            {String(candidate.name ?? '')}
          </Text>
          <Text style={styles.role} numberOfLines={2}>
            {String(candidate.role ?? '')}
          </Text>
          {visa ? (
            <View style={styles.chipWrap}>
              <VisaChip label={visa} />
            </View>
          ) : null}
          <Text style={[styles.meta, { textAlign: rtl.textAlignCenter }]} numberOfLines={2}>
            {String(candidate.location ?? '')}
          </Text>
          {salary != null ? (
            <Text style={styles.salary}>
              {t.salaryPerMonth(String(salary))}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.statLabel}>{t.contactUnlocks}</Text>
          <Text style={styles.statHint}>{t.contactUnlocksHint}</Text>
          <Text style={styles.statValue}>{unlocks}</Text>
          {unlocks === 0 ? (
            <Text style={styles.hint}>{t.contactUnlocksEmpty}</Text>
          ) : (
            <Text style={styles.hint}>{t.profileLive}</Text>
          )}
        </View>

        <View style={[styles.card, styles.row, rtl.rowBetween]}>
          <Text style={[styles.activeLabel, { textAlign: rtl.textAlign }]} numberOfLines={2}>
            {t.profileActive}
          </Text>
          <Switch
            value={isActive}
            onValueChange={toggleActive}
            accessibilityLabel={t.profileActive}
            disabled={isHired}
          />
        </View>

        {isActive && !isHired && (
          <View style={[styles.hiredWrap, rtl.row]}>
            <Switch
              value={false}
              onValueChange={markHired}
              accessibilityLabel="Mark as hired"
            />
            <Text style={[styles.hiredLabel, { textAlign: rtl.textAlign }]} numberOfLines={3}>
              I got hired — hide my profile
            </Text>
          </View>
        )}

        <View style={styles.editWrap}>
          <PrimaryButton
            label={t.editProfile}
            onPress={() =>
              navigation.navigate('CandidateOnboarding', {
                initial: onboardingFromRow(candidate),
              })
            }
          />
        </View>
      </ContentWidth>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
  scrollContent: { paddingBottom: spacing.xxxl, paddingHorizontal: spacing.lg },
  chipWrap: { marginTop: spacing.sm },
  banner: {
    padding: spacing.md,
    backgroundColor: colors.warningTint,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  bannerText: { color: '#B45309', lineHeight: 20 },
  bannerHired: { backgroundColor: colors.secondaryTint },
  bannerTextHired: { color: colors.secondary, fontWeight: '600', lineHeight: 20 },
  hiredWrap: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 16,
  },
  hiredLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPh: {
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 36, fontWeight: '700', color: colors.primary },
  name: { ...typography.h2, marginTop: spacing.md, textAlign: 'center' },
  role: { ...typography.body, marginTop: spacing.xs, textAlign: 'center', color: colors.textSecondary },
  meta: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  salary: { marginTop: spacing.sm, fontWeight: '600', color: colors.primary, textAlign: 'center' },
  statLabel: { ...typography.h3, color: colors.textPrimary, textAlign: 'center' },
  statHint: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statValue: { fontSize: 32, fontWeight: '700', marginTop: spacing.md, textAlign: 'center' },
  hint: {
    ...typography.body,
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.secondary,
  },
  row: { alignItems: 'center', width: '100%' },
  activeLabel: { ...typography.h3, flex: 1, flexShrink: 1 },
  editWrap: { marginBottom: spacing.lg },
});
