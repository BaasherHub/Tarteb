import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { ContentWidth } from '../../components/ContentWidth';
import { VisaChip } from '../../components/VisaChip';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import {
  fetchEmployerAccount,
  hasActiveSubscription,
} from '../../services/employerSubscription';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateDetail'>;

export function CandidateDetailScreen({ route, navigation }: Props) {
  const { t, isRtl } = useLocale();
  const [candidate, setCandidate] = useState<Record<string, unknown> | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [subActive, setSubActive] = useState(false);

  const phone = candidate?.phone as string | undefined;
  const whatsapp = candidate?.whatsapp as string | undefined;
  const unlocked = phone != null;
  const visa = String(candidate?.visa_status ?? '');
  const nationality = String(candidate?.nationality ?? '');
  const experience = candidate?.years_experience;

  const fetchCandidate = async () => {
    const { data } = await supabase
      .from('candidate_browse')
      .select('*')
      .eq('id', route.params.candidateId)
      .single();
    if (data) setCandidate(data as Record<string, unknown>);
    return data;
  };

  useEffect(() => {
    Promise.all([
      fetchCandidate().then((data) => {
        // Notify candidate their profile was viewed — only if not already unlocked
        // (already-unlocked means they know this employer has their contact).
        if (data && data.phone == null) {
          supabase.functions
            .invoke('notify-candidate', {
              body: { candidate_id: route.params.candidateId, event: 'viewed' },
            })
            .catch(() => {});
        }
      }),
      fetchEmployerAccount()
        .then((a) => setSubActive(hasActiveSubscription(a.subscriptionEndsAt)))
        .catch(() => setSubActive(false)),
    ]).finally(() => setPageLoading(false));
  }, []);

  const unlock = async () => {
    const account = await fetchEmployerAccount();
    if (!hasActiveSubscription(account.subscriptionEndsAt)) {
      navigation.navigate('Subscription');
      return;
    }

    setLoading(true);
    try {
      await supabase.rpc('unlock_candidate', {
        p_candidate_id: route.params.candidateId,
      });
      // Fire-and-forget: notify the candidate their contact was unlocked.
      supabase.functions
        .invoke('notify-candidate', {
          body: { candidate_id: route.params.candidateId, event: 'unlocked' },
        })
        .catch(() => {});
      await fetchCandidate();
      Alert.alert(t.contactUnlocked);
    } catch (e) {
      const msg = e instanceof Error ? e.message : t.errorGeneric;
      if (msg.toLowerCase().includes('subscription')) {
        navigation.navigate('Subscription');
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={[styles.scroll, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!candidate) return null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <ContentWidth grow={false}>
        {candidate.photo_url ? (
          <Image
            source={{ uri: String(candidate.photo_url) }}
            style={styles.photo}
          />
        ) : (
          <View style={[styles.photo, styles.photoPh]}>
            <Text style={styles.initials}>
              {String(candidate.name ?? '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{String(candidate.name ?? '')}</Text>
        <Text style={styles.role}>{String(candidate.role ?? '')}</Text>
        <View style={[styles.chipRow, isRtl && styles.chipRowRtl]}>
          {visa ? <VisaChip label={visa} /> : null}
        </View>

        {/* Metadata grid — left-aligned label / value pairs */}
        <View style={styles.metaGrid}>
          {[
            { label: t.location, value: String(candidate.location ?? '') },
            nationality ? { label: t.nationalityLabel, value: nationality } : null,
            experience != null ? { label: t.experienceLabel, value: `${experience} ${t.yearsExperience.toLowerCase()}` } : null,
            candidate.salary_expectation != null ? { label: t.monthlySalary, value: t.salaryPerMonth(String(candidate.salary_expectation)) } : null,
          ]
            .filter(Boolean)
            .map((row) => (
              <View key={row!.label} style={styles.metaRow}>
                <Text style={styles.metaLabel}>{row!.label}</Text>
                <Text style={styles.metaValue}>{row!.value}</Text>
              </View>
            ))}
        </View>

        {!unlocked && !subActive && (
          <View style={styles.paywall}>
            <Text style={styles.paywallTitle}>{t.subscribeToUnlock}</Text>
            <Text style={styles.paywallBody}>{t.subscriptionRequired}</Text>
            <SecondaryButton
              label={t.viewSubscription}
              onPress={() => navigation.navigate('Subscription')}
            />
          </View>
        )}

        {unlocked ? (
          <View style={styles.actions}>
            {phone && (
              <PrimaryButton
                label={t.call}
                onPress={() => Linking.openURL(`tel:${phone}`)}
              />
            )}
            {whatsapp && (
              <PrimaryButton
                label={t.whatsApp}
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
                  )
                }
              />
            )}
          </View>
        ) : (
          <PrimaryButton
            label={t.unlockContact}
            onPress={unlock}
            loading={loading}
          />
        )}
      </ContentWidth>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.scaffold },
  scrollContent: { paddingVertical: 20, alignItems: 'center' },
  photo: { width: 160, height: 160, borderRadius: 16, alignSelf: 'center' },
  photoPh: {
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 48, fontWeight: '700', color: colors.primary },
  name: { fontSize: 24, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  role: { fontSize: 18, marginTop: 8, textAlign: 'center' },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  chipRowRtl: { flexDirection: 'row-reverse' },
  metaGrid: {
    width: '100%',
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  metaLabel: { fontSize: 14, color: colors.textSecondary },
  metaValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, flexShrink: 1, textAlign: 'right' },
  paywall: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    gap: 10,
    width: '100%',
  },
  paywallTitle: { fontWeight: '700', fontSize: 16, color: colors.textPrimary },
  paywallBody: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  actions: { width: '100%', gap: 12, marginTop: 24 },
});
