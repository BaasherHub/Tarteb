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
import { getCandidateCvSignedUrl } from '@/features/candidate/data/services/candidateCv';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { supabase } from '@/core/lib/supabase';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { layout, layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { getErrorMessage } from '@/shared/utils/errors';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { VisaChip } from '@/shared/widgets/VisaChip';
import { CandidateRolesDisplay } from '@/shared/widgets/CandidateRolesDisplay';
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
  const cvPath = candidate?.cv_url as string | undefined;
  const cvFileName = candidate?.cv_file_name as string | undefined;
  const hasCv = Boolean(candidate?.has_cv) || Boolean(cvPath);
  const unlocked = phone != null;
  const visa = String(candidate?.visa_status ?? '');
  const nationality = String(candidate?.nationality ?? '');
  const experience =
    typeof candidate?.years_experience === 'number' ? candidate.years_experience : null;

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
        onAction: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'EmployerShell',
                  state: { routes: [{ name: 'UnlocksTab' }], index: 0 },
                },
              ],
            }),
          );
        },
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
        <View style={styles.rolesBlock}>
          <CandidateRolesDisplay
            role={candidate.role}
            additional_roles={candidate.additional_roles}
            hiringRole={route.params.hiringRole}
            layout="detail"
          />
        </View>
        <View style={[styles.chipRow, rtl.row]}>
          {visa ? <VisaChip label={t.visaStatusLabel(visa)} /> : null}
        </View>

        {/* Metadata grid — left-aligned label / value pairs */}
        <View style={styles.metaGrid}>
          {[
            { label: t.location, value: String(candidate.location ?? '') },
            nationality ? { label: t.nationalityLabel, value: nationality } : null,
            experience != null
              ? { label: t.experienceLabel, value: t.experienceBucketLabel(experience) }
              : null,
            unlocked && candidate.current_salary != null
              ? {
                  label: t.currentSalary,
                  value: t.salaryPerMonth(String(candidate.current_salary)),
                }
              : null,
            candidate.salary_expectation != null
              ? {
                  label: t.expectedSalary,
                  value: t.salaryPerMonth(String(candidate.salary_expectation)),
                }
              : null,
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

        {hasCv && !unlocked ? (
          <Text style={[styles.cvHint, { textAlign: rtl.textAlign }]} numberOfLines={3}>
            {t.cvEmployerHint}
          </Text>
        ) : null}

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
            {cvPath ? (
              <SecondaryButton
                label={t.cvView}
                onPress={async () => {
                  try {
                    const url = await getCandidateCvSignedUrl(cvPath);
                    await Linking.openURL(url);
                  } catch (e) {
                    Alert.alert(t.errorTitle, getErrorMessage(e, t.cvOpenFailed));
                  }
                }}
              />
            ) : null}
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
  scrollContent: {
    ...layoutStyles.screenContent,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  photo: { width: 160, height: 160, borderRadius: layout.cardRadius, alignSelf: 'center' },
  photoPh: {
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 48, fontWeight: '700', color: colors.primary },
  name: { ...typography.h1, marginTop: spacing.lg, textAlign: 'center' },
  rolesBlock: {
    marginTop: spacing.sm,
    width: '100%',
    alignSelf: 'stretch',
  },
  chipRow: {
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  metaGrid: {
    width: '100%',
    marginTop: spacing.lg,
    borderRadius: layout.cardRadius,
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
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: '#FFE082',
    gap: spacing.md,
    width: '100%',
  },
  paywallTitle: { ...typography.h3, color: colors.textPrimary },
  paywallBody: { ...typography.caption, color: colors.textSecondary },
  cvHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    lineHeight: 20,
    width: '100%',
  },
  actions: { width: '100%', gap: spacing.md, marginTop: spacing.xxl },
});

