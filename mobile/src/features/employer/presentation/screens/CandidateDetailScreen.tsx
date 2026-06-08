import React, { useEffect, useMemo, useState } from 'react';
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
import { formatDisplayName, formatNationalityDisplay } from '@/shared/utils/displayFormat';
import { formatIsoDateLocal, parseIsoDateLocal } from '@/shared/utils/dateFormat';
import { formatLanguagesSummary, sanitizeLanguages } from '@/shared/utils/languages';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { VisaChip } from '@/shared/widgets/VisaChip';
import { CandidateRolesDisplay } from '@/shared/widgets/CandidateRolesDisplay';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { ScreenLoading } from '@/shared/widgets/ScreenLoading';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { ProfileFactRow } from '@/shared/widgets/ProfileFactRow';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { useToast } from '@/core/providers/ToastProvider';
import {
  employerHasUnlockedCandidate,
  hasCandidateContact,
  isCandidateUnlocked,
} from '@/features/employer/domain/candidateUnlock';
import { parseUnlockCandidateRpcArgs } from '@/features/employer/domain/schemas/unlockCandidate';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateDetail'>;

export function CandidateDetailScreen({ route, navigation }: Props) {
  const { t } = useLocale();
  const { showToast } = useToast();
  const rtl = useRtlStyles();
  const [candidate, setCandidate] = useState<Record<string, unknown> | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unlockConfirmed, setUnlockConfirmed] = useState(false);

  const phone = String(candidate?.phone ?? '').trim() || undefined;
  const whatsapp = String(candidate?.whatsapp ?? '').trim() || undefined;
  const cvPath = candidate?.cv_url as string | undefined;
  const hasCv = Boolean(candidate?.has_cv) || Boolean(cvPath);
  const isUnlocked =
    unlockConfirmed || (candidate ? isCandidateUnlocked(candidate) : false);
  const hasContact = candidate ? hasCandidateContact(candidate) : false;
  const visa = String(candidate?.visa_status ?? '');
  const displayName = formatDisplayName(String(candidate?.name ?? ''));
  const nationality = formatNationalityDisplay(String(candidate?.nationality ?? ''));
  const experience =
    typeof candidate?.years_experience === 'number' ? candidate.years_experience : null;

  const languagesLine = useMemo(() => {
    const langs = sanitizeLanguages(candidate?.languages);
    return formatLanguagesSummary(
      langs,
      (l) => t.languageLabel(l),
      (n) => t.homeLanguagesMore(n),
    );
  }, [candidate?.languages, t]);

  const availableFromLine = useMemo(() => {
    const raw = candidate?.available_from;
    if (!raw || typeof raw !== 'string') return '';
    const parsed = parseIsoDateLocal(raw);
    return parsed ? formatIsoDateLocal(parsed) : '';
  }, [candidate?.available_from]);

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
    setUnlockConfirmed(false);
    Promise.all([
      fetchCandidate(),
      employerHasUnlockedCandidate(route.params.candidateId),
    ])
      .then(([data, alreadyUnlocked]) => {
        const row = data as Record<string, unknown> | null;
        const unlocked = alreadyUnlocked || (row ? isCandidateUnlocked(row) : false);
        setUnlockConfirmed(unlocked);
        if (row && !unlocked) {
          supabase.functions
            .invoke('notify-candidate', {
              body: { candidate_id: route.params.candidateId, event: 'viewed' },
            })
            .catch(() => {});
        }
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [route.params.candidateId]);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('EmployerShell', { screen: 'BrowseTab' });
  };

  const unlock = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc(
        'unlock_candidate',
        parseUnlockCandidateRpcArgs(route.params.candidateId),
      );
      if (error) throw error;
      setUnlockConfirmed(true);
      supabase.functions
        .invoke('notify-candidate', {
          body: { candidate_id: route.params.candidateId, event: 'unlocked' },
        })
        .catch(() => {});
      const refreshed = await fetchCandidate();
      const contactReady =
        refreshed && hasCandidateContact(refreshed as Record<string, unknown>);
      showToast({
        message: !contactReady ? t.contactUnlockedNoDetails : t.toastUnlockSuccess,
        variant: 'success',
        actionLabel: t.myUnlocks,
        onAction: () => {
          navigation.navigate('EmployerShell', { screen: 'UnlocksTab' });
        },
      });
    } catch (e) {
      Alert.alert(t.errorTitle, getErrorMessage(e, t.errorGeneric));
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
        <ScreenHeader
          title={displayName || t.candidateProfileTitle}
          onBack={goBack}
        />
        <SurfaceCard inset style={styles.profileCard}>
          <View style={[styles.profileHero, rtl.row]}>
            {candidate.photo_url ? (
              <Image source={{ uri: String(candidate.photo_url) }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoPh]}>
                <Text style={styles.initials}>
                  {(displayName || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.heroMeta}>
              <Text style={[styles.name, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                {displayName}
              </Text>
              <CandidateRolesDisplay
                role={candidate.role}
                additional_roles={candidate.additional_roles}
                hiringRole={route.params.hiringRole}
                layout="detail"
              />
              {visa ? (
                <View style={[styles.chipRow, rtl.row]}>
                  <VisaChip label={t.visaStatusLabel(visa)} />
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.facts}>
            <ProfileFactRow label={t.location} value={String(candidate.location ?? '')} />
            {nationality ? (
              <ProfileFactRow label={t.nationalityLabel} value={nationality} />
            ) : null}
            {experience != null ? (
              <ProfileFactRow
                label={t.experienceLabel}
                value={t.experienceBucketLabel(experience)}
              />
            ) : null}
            {languagesLine ? (
              <ProfileFactRow label={t.languages} value={languagesLine} />
            ) : null}
            {availableFromLine ? (
              <ProfileFactRow label={t.availableFrom} value={availableFromLine} />
            ) : null}
            {isUnlocked && candidate.current_salary != null ? (
              <ProfileFactRow
                label={t.currentSalary}
                value={t.salaryPerMonth(String(candidate.current_salary))}
              />
            ) : !isUnlocked ? (
              <ProfileFactRow
                label={t.currentSalary}
                value={t.currentSalaryLocked}
                variant="secondary"
              />
            ) : null}
            {candidate.salary_expectation != null ? (
              <ProfileFactRow
                label={t.expectedSalary}
                value={t.salaryPerMonth(String(candidate.salary_expectation))}
              />
            ) : null}
          </View>

          {hasCv && !isUnlocked ? (
            <Text style={[styles.cvHint, { textAlign: rtl.textAlign }]} numberOfLines={3}>
              {t.cvEmployerHint}
            </Text>
          ) : null}
        </SurfaceCard>

        {isUnlocked ? (
          hasContact || cvPath ? (
            <View style={styles.actions}>
              {phone ? (
                <PrimaryButton label={t.call} onPress={() => Linking.openURL(`tel:${phone}`)} />
              ) : null}
              {whatsapp ? (
                <PrimaryButton
                  label={t.whatsApp}
                  onPress={() =>
                    Linking.openURL(`https://wa.me/${whatsapp.replace(/\D/g, '')}`)
                  }
                />
              ) : null}
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
            <InfoBanner message={t.contactUnlockedNoDetails} variant="warning" />
          )
        ) : (
          <PrimaryButton label={t.unlockContact} onPress={unlock} loading={loading} />
        )}
      </ContentWidth>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.scaffold },
  scrollContent: {
    ...layoutStyles.screenContent,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  profileCard: { gap: spacing.lg },
  profileHero: { alignItems: 'flex-start', gap: spacing.md },
  photo: {
    width: 88,
    height: 88,
    borderRadius: layout.cardRadius,
    flexShrink: 0,
  },
  photoPh: {
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 32, fontWeight: '700', color: colors.primary },
  heroMeta: { flex: 1, minWidth: 0, gap: spacing.xs },
  name: { ...typography.h2, color: colors.textPrimary },
  chipRow: { marginTop: spacing.xs, flexWrap: 'wrap' },
  facts: { gap: spacing.xs },
  cvHint: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: { gap: spacing.md },
});
