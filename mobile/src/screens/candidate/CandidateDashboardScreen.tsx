import React, { useCallback, useState } from 'react';
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
import { RootStackParamList } from '../../navigation/types';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/colors';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ContentWidth } from '../../components/ContentWidth';
import { VisaChip } from '../../components/VisaChip';
import { ScreenHeader } from '../../components/ScreenHeader';
import { onboardingFromRow } from '../../types/candidateOnboarding';
import { registerPushToken } from '../../services/notifications';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CandidateDashboardScreen() {
  const { t } = useLocale();
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
      registerPushToken().catch(() => {});
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation, t.errorGeneric]);

  React.useEffect(() => {
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
      <View style={styles.center}>
        <Text>{t.loading}</Text>
      </View>
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
          <Text style={styles.name}>{String(candidate.name ?? '')}</Text>
          <Text style={styles.role}>{String(candidate.role ?? '')}</Text>
          {visa ? (
            <View style={styles.chipWrap}>
              <VisaChip label={visa} />
            </View>
          ) : null}
          <Text style={styles.meta}>{String(candidate.location ?? '')}</Text>
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

        <View style={[styles.card, styles.row]}>
          <Text style={styles.activeLabel}>{t.profileActive}</Text>
          <Switch
            value={isActive}
            onValueChange={toggleActive}
            accessibilityLabel={t.profileActive}
            disabled={isHired}
          />
        </View>

        {isActive && !isHired && (
          <View style={styles.hiredWrap}>
            <Switch
              value={false}
              onValueChange={markHired}
              accessibilityLabel="Mark as hired"
            />
            <Text style={styles.hiredLabel}>I got hired — hide my profile</Text>
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
  scrollContent: { paddingBottom: 32, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chipWrap: { marginTop: 8 },
  banner: {
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginBottom: 12,
  },
  bannerText: { color: '#E65100' },
  bannerHired: { backgroundColor: '#E8F5E9', borderRadius: 12 },
  bannerTextHired: { color: colors.secondary, fontWeight: '600' },
  hiredWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 16,
  },
  hiredLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  card: {
    marginBottom: 16,
    padding: 20,
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
  name: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  role: { fontSize: 16, marginTop: 4 },
  meta: { color: colors.textSecondary, marginTop: 4 },
  salary: { marginTop: 6, fontWeight: '600', color: colors.primary },
  statLabel: { fontWeight: '700', fontSize: 16, color: colors.textPrimary },
  statHint: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statValue: { fontSize: 32, fontWeight: '700', marginTop: 12 },
  hint: { marginTop: 8, textAlign: 'center', color: colors.secondary, lineHeight: 22 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  activeLabel: { fontWeight: '600', fontSize: 16 },
  editWrap: { marginBottom: 16 },
});
