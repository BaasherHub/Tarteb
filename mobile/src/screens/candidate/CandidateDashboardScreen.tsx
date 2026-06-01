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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/colors';
import { PrimaryButton } from '../../components/PrimaryButton';
import { onboardingFromRow } from '../../types/candidateOnboarding';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateDashboard'>;

export function CandidateDashboardScreen({ navigation }: Props) {
  const { t } = useLocale();
  const [candidate, setCandidate] = useState<Record<string, unknown> | null>(null);
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
        navigation.replace('CandidateOnboarding', {});
        return;
      }

      const { data: unlocks } = await supabase
        .from('unlocks')
        .select('id')
        .eq('candidate_id', row.id as string);

      setCandidate(row as Record<string, unknown>);
      setViews(unlocks?.length ?? 0);
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
    await supabase.from('candidates').update({ is_active: value }).eq('user_id', userId);
    load();
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
  const photoUrl = candidate.photo_url as string | undefined;

  return (
    <ScrollView
      style={styles.flex}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.appTitle}>{t.appName}</Text>
        <Text onPress={() => navigation.navigate('Settings', { isCandidate: true })} style={styles.gear}>
          ⚙
        </Text>
      </View>

      {!isActive && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{t.profilePaused}</Text>
        </View>
      )}

      <View style={styles.card}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPh]} />
        )}
        <Text style={styles.name}>{String(candidate.name ?? '')}</Text>
        <Text style={styles.role}>{String(candidate.role ?? '')}</Text>
        <Text style={styles.meta}>{String(candidate.location ?? '')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.statLabel}>{t.profileViews}</Text>
        <Text style={styles.statValue}>{views}</Text>
        {views === 0 && <Text style={styles.hint}>{t.profileLive}</Text>}
      </View>

      <View style={[styles.card, styles.row]}>
        <Text style={styles.activeLabel}>{t.profileActive}</Text>
        <Switch value={isActive} onValueChange={toggleActive} />
      </View>

      <PrimaryButton
        label={t.editProfile}
        onPress={() =>
          navigation.navigate('CandidateOnboarding', {
            initial: onboardingFromRow(candidate),
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: { fontSize: 22, fontWeight: '700' },
  gear: { fontSize: 24, padding: 8 },
  banner: {
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginBottom: 12,
  },
  bannerText: { color: '#E65100' },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
  },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPh: { backgroundColor: `${colors.primary}15` },
  name: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  role: { fontSize: 16, marginTop: 4 },
  meta: { color: colors.textSecondary, marginTop: 4 },
  statLabel: { color: colors.textSecondary },
  statValue: { fontSize: 32, fontWeight: '700', marginTop: 8 },
  hint: { marginTop: 8, textAlign: 'center', color: colors.secondary },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeLabel: { fontWeight: '600', fontSize: 16 },
  editProfile: { marginHorizontal: 20, marginBottom: 32 },
});
