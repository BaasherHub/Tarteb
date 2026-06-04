import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { supabase } from '@/core/lib/supabase';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { getErrorMessage } from '@/shared/utils/errors';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { VisaChip } from '@/shared/widgets/VisaChip';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { ScreenLoading } from '@/shared/widgets/ScreenLoading';
import {
  fetchEmployerAccount,
  hasActiveSubscription,
} from '@/features/employer/data/services/employerSubscription';
import { promptForPushNotifications } from '@/core/services/notifications';
import { useToast } from '@/core/providers/ToastProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateDetail'>;

export function CandidateDetailScreen({ route, navigation }: Props) {
  const { t } = useLocale();
  const { showToast } = useToast();
  const rtl = useRtlStyles();
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
    ]).finally(() => {
      setPageLoading(false);
      void promptForPushNotifications(t);
    });
  }, [route.params.candidateId, t]);

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
      showToast({
        message: t.toastUnlockSuccess,
        variant: 'success',
        actionLabel: t.myUnlocks,
        onAction: () =>
          navigation.navigate('EmployerShell', { screen: 'UnlocksTab' }),
      });
    } catch (e) {
      const msg = getErrorMessage(e, t.errorGeneric);
      if (msg.toLowerCase().includes('subscription')) {
        navigation.navigate('Subscription');
      } else {
        Alert.alert(t.errorTitle, msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={styles.scroll}>
        <ScreenLoading message={t.loading} />
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
        <Text style={styles.name} numberOfLines={2}>
          {String(candidate.name ?? '')}
        </Text>
        <Text style={styles.role} numberOfLines={2}>
          {String(candidate.role ?? '')}
        </Text>
        <View style={[styles.chipRow, rtl.row]}>
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
              <View key={row!.label} style={[styles.metaRow, rtl.rowBetween]}>
                <Text style={[styles.metaLabel, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                  {row!.label}
                </Text>
                <Text
                  style={[styles.metaValue, { textAlign: rtl.textAlignEnd }]}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {row!.value}
                </Text>
              </View>
            ))}
        </View>

        {!unlocked && !subActive && (
          <View style={styles.paywall}>
            <Text style={[styles.paywallTitle, { textAlign: rtl.textAlign }]} numberOfLines={2}>
              {t.subscribeToUnlock}
            </Text>
            <Text style={[styles.paywallBody, { textAlign: rtl.textAlign }]} numberOfLines={4}>
              {t.subscriptionRequired}
            </Text>
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
  scrollContent: { paddingVertical: spacing.xl, alignItems: 'center', paddingHorizontal: spacing.lg },
  photo: { width: 160, height: 160, borderRadius: 16, alignSelf: 'center' },
  photoPh: {
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 48, fontWeight: '700', color: colors.primary },
  name: { ...typography.h1, marginTop: spacing.lg, textAlign: 'center' },
  role: { ...typography.h3, marginTop: spacing.sm, textAlign: 'center', color: colors.textSecondary },
  chipRow: {
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  metaGrid: {
    width: '100%',
    marginTop: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  metaRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  metaLabel: { ...typography.body, color: colors.textSecondary, flex: 1, flexShrink: 0 },
  metaValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    flexShrink: 1,
  },
  paywall: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.warningTint,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    gap: spacing.md,
    width: '100%',
  },
  paywallTitle: { ...typography.h3, color: colors.textPrimary },
  paywallBody: { ...typography.caption, color: colors.textSecondary },
  actions: { width: '100%', gap: spacing.md, marginTop: spacing.xxl },
});

