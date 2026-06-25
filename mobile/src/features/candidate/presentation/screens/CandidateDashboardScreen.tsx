import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Pressable,

  RefreshControl,

  StyleSheet,

  Switch,

  Text,

  View,

} from 'react-native';
import { Image } from 'expo-image';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { api } from '@/core/lib/api';

import { useRtlStyles } from '@/core/hooks/useRtlStyles';

import { colors } from '@/core/theme/colors';

import { spacing } from '@/core/theme/spacing';

import { typography } from '@/core/theme/typography';

import { RootStackParamList } from '@/core/navigation/types';

import { useLocale } from '@/core/i18n/LocaleContext';

import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

import { VisaChip } from '@/shared/widgets/VisaChip';

import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { SectionLabel } from '@/shared/widgets/SectionLabel';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { TabScreenLayout } from '@/shared/widgets/TabScreenLayout';

import { DashboardSkeleton } from '@/shared/widgets/DashboardSkeleton';
import { ErrorState } from '@/shared/widgets/ErrorState';

import { ProfileFactRow } from '@/shared/widgets/ProfileFactRow';


import {

  promptForPushOnFirstDashboardVisit,

  registerPushTokenIfGranted,

} from '@/core/services/notifications';

import { getErrorMessage } from '@/shared/utils/errors';

import { ProfileCompletionCard } from '@/shared/widgets/ProfileCompletionCard';

import {
  candidateCompletionRoute,
  candidateProfileCompletion,
} from '@/shared/utils/profileCompletion';

import { parseAdditionalRoles } from '@/shared/utils/candidateRoles';

import {

  formatLanguagesSummary,

  sanitizeLanguages,

} from '@/shared/utils/languages';

import { layout } from '@/core/theme/layout';
import { interaction } from '@/core/theme/interaction';
import { CandidateCvSection } from '@/features/candidate/presentation/components/CandidateCvSection';
import { useAppAlert } from '@/shared/hooks/useAppAlert';
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog';
import { InfoBanner } from '@/shared/widgets/InfoBanner';



type Nav = NativeStackNavigationProp<RootStackParamList>;



export function CandidateDashboardScreen() {

  const { t } = useLocale();

  const rtl = useRtlStyles();

  const navigation = useNavigation<Nav>();

  const { showError } = useAppAlert();

  const { runConfirmAction, dialog } = useConfirmDialog();

  const [candidate, setCandidate] = useState<Record<string, unknown> | null>(null);

  const [unlocks, setUnlocks] = useState(0);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [routingToOnboarding, setRoutingToOnboarding] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);



  const pushPromptDone = useRef(false);

  const fetchCandidate = useCallback(async () => {
    let result: { candidate: Record<string, unknown> | null };
    try {
      result = await api.candidates.me();
    } catch {
      throw new Error(t.errorGeneric);
    }

    if (!result.candidate) {
      setRoutingToOnboarding(true);
      navigation.replace('CandidateOnboarding', {});
      return;
    }

    let candidateRow = result.candidate;
    const unlockCount = typeof candidateRow.unlock_count === 'number' ? candidateRow.unlock_count : 0;

    const sanitizedLangs = sanitizeLanguages(candidateRow.languages);
    if (
      Array.isArray(candidateRow.languages) &&
      sanitizedLangs.length !== (candidateRow.languages as string[]).length
    ) {
      await api.candidates.update({ languages: sanitizedLangs }).catch(() => {});
      candidateRow = { ...candidateRow, languages: sanitizedLangs };
    }

    setCandidate(candidateRow);
    setUnlocks(unlockCount);

    registerPushTokenIfGranted().catch(() => {});
  }, [navigation, t.errorGeneric]);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      await fetchCandidate();
    } catch (e) {
      setLoadError(getErrorMessage(e, t.errorGeneric));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchCandidate, t]);

  useEffect(() => {
    if (loading || !candidate || pushPromptDone.current) return;
    pushPromptDone.current = true;
    void promptForPushOnFirstDashboardVisit(t);
  }, [loading, candidate, t]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );



  const toggleActive = async (value: boolean) => {
    setStatusUpdating(true);
    // Optimistic update so the toggle doesn't flicker back before the API responds.
    setCandidate((prev) =>
      prev ? { ...prev, is_active: value, availability_status: value ? 'looking' : 'paused' } : prev,
    );
    try {
      await api.candidates.update({
        is_active: value,
        availability_status: value ? 'looking' : 'paused',
      });
      await load();
    } catch (error) {
      // Revert optimistic update on failure.
      setCandidate((prev) =>
        prev ? { ...prev, is_active: !value, availability_status: !value ? 'looking' : 'paused' } : prev,
      );
      showError(t.errorTitle, getErrorMessage(error, t.errorGeneric));
    } finally {
      setStatusUpdating(false);
    }
  };

  const markHired = () => {
    runConfirmAction(
      {
        title: t.hiredAlertTitle,
        message: t.hiredAlertMessage,
        confirmLabel: t.hiredAlertConfirm,
        cancelLabel: t.cancel,
      },
      async () => {
        setStatusUpdating(true);
        try {
          await api.candidates.update({ is_active: false, availability_status: 'hired' });
          await load();
        } catch (error) {
          showError(t.errorTitle, getErrorMessage(error, t.errorGeneric));
        } finally {
          setStatusUpdating(false);
        }
      },
    );
  };



  if (loading || routingToOnboarding) {

    return (

      <TabScreenLayout>
        <ScreenHeader title={t.home} />
        <View style={styles.sections}>
          <DashboardSkeleton />
        </View>
      </TabScreenLayout>

    );

  }



  if (!candidate) {
    return (
      <TabScreenLayout>
        <ScreenHeader title={t.home} />
        <ErrorState
          title={t.errorTitle}
          message={loadError ?? t.errorGeneric}
          actionLabel={t.retry}
          onAction={() => {
            setLoading(true);
            void load();
          }}
        />
      </TabScreenLayout>
    );
  }



  const isActive = candidate.is_active !== false;

  const availabilityStatus = String(candidate.availability_status ?? 'looking');

  const isHired = availabilityStatus === 'hired';

  const photoUrl = candidate.photo_url as string | undefined;

  const visa = String(candidate.visa_status ?? '');
  const visaLabel = visa ? t.visaStatusLabel(visa) : '';
  const profileViews =
    typeof candidate.profile_view_count === 'number' ? candidate.profile_view_count : 0;

  const currentSalary = candidate.current_salary;

  const expectedSalary = candidate.salary_expectation;

  const completion = candidateProfileCompletion(candidate);

  const showCompletionProminent = completion.percent < 90;



  const openProfileEditorAt = (startStep: number) => {
    navigation.navigate('CandidateOnboarding', {
      startStep,
    });
  };

  const openProfileEditor = () => openProfileEditorAt(1);



  const openAdditionalRoles = () => {

    navigation.navigate('CandidateAdditionalRoles', undefined);

  };



  const primaryRole = String(candidate.role ?? '');

  const alsoRoles = parseAdditionalRoles(candidate.additional_roles).filter(

    (r) => r !== primaryRole,

  );

  const languages = sanitizeLanguages(candidate.languages);

  const languagesLine = formatLanguagesSummary(

    languages,

    (l) => t.languageLabel(l),

    (n) => t.homeLanguagesMore(n),

  );

  const yearsExperience =

    typeof candidate.years_experience === 'number' ? candidate.years_experience : null;

  const location = String(candidate.location ?? '');



  const openCompletionTarget = () => {
    const target = candidateCompletionRoute(completion.nextItem?.id);
    if (target.kind === 'additionalRoles') {
      openAdditionalRoles();
      return;
    }
    openProfileEditorAt(target.startStep);
  };

  const completionCard = (

    <ProfileCompletionCard

      completion={completion}

      onImprove={

        completion.percent < 100

          ? openCompletionTarget
          : undefined

      }

      variant="candidate"

    />

  );



  return (
    <>
    <TabScreenLayout

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
      <ScreenHeader
        title={t.home}
      />

      <View style={styles.sections}>
        {loadError ? <InfoBanner message={loadError} variant="warning" /> : null}
        {isHired ? (

          <View style={[styles.banner, styles.bannerHired]}>

            <Text style={styles.bannerTextHired}>{t.hiredBanner}</Text>

          </View>

        ) : null}

        {!isActive && !isHired ? (

          <View style={styles.banner}>

            <Text style={styles.bannerText}>{t.profilePaused}</Text>

          </View>

        ) : null}



        {showCompletionProminent ? completionCard : null}

        <SurfaceCard inset>
          <View style={[styles.profileToolbar, rtl.row]}>
            <View style={[styles.activeInline, rtl.row]}>
              <Text style={[styles.activeLabel, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                {t.profileActive}
              </Text>
              <Switch
                value={isActive}
                onValueChange={toggleActive}
                accessibilityLabel={t.profileActive}
                disabled={isHired || statusUpdating}
              />
            </View>
            <Pressable
              onPress={openProfileEditor}
              accessibilityRole="button"
              accessibilityLabel={t.editProfile}
              hitSlop={8}
              style={styles.editPressable}
            >
              <Text style={[styles.editLink, { textAlign: rtl.textAlignEnd }]}>{t.editProfile}</Text>
            </Pressable>
          </View>



          <View style={styles.profileHero}>

            {photoUrl ? (

              <Image
                source={{ uri: photoUrl }}
                style={styles.photo}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={180}
              />

            ) : (

              <Pressable

                onPress={openProfileEditor}

                style={[styles.photo, styles.photoPh]}

                accessibilityRole="button"

                accessibilityLabel={t.dashboardPhotoNagAction}

              >

                <Text style={styles.initials}>
                  {String(candidate.name ?? '?').charAt(0).toUpperCase()}
                </Text>
                <Text style={[styles.photoCta, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                  {t.dashboardPhotoNagAction}
                </Text>
              </Pressable>

            )}

            <Text style={[styles.name, { textAlign: rtl.textAlign }]} numberOfLines={2}>

              {String(candidate.name ?? '')}

            </Text>

            {primaryRole ? (

              <Text style={[styles.roleLine, { textAlign: rtl.textAlign }]} numberOfLines={2}>

                {primaryRole}

              </Text>

            ) : null}

            {alsoRoles.length > 0 ? (

              <Text style={[styles.alsoLine, { textAlign: rtl.textAlign }]} numberOfLines={2}>

                {t.homeAlsoOpenTo}: {alsoRoles.join(', ')}

              </Text>

            ) : null}

            {visa ? (

              <View style={styles.chipWrap}>

                <VisaChip label={visaLabel} />

              </View>

            ) : null}

          </View>



          <View style={styles.facts}>

            <ProfileFactRow label={t.homeLocationLabel} value={location} />

            {yearsExperience != null ? (

              <ProfileFactRow

                label={t.homeExperienceLabel}

                value={t.experienceBucketLabel(yearsExperience)}

              />

            ) : null}

            {languagesLine ? (
              <ProfileFactRow label={t.homeLanguagesLabel} value={languagesLine} />
            ) : null}

            {expectedSalary != null ? (
              <ProfileFactRow
                label={t.homeExpectedSalaryLabel}
                value={t.salaryPerMonth(String(expectedSalary))}
              />
            ) : null}

            {currentSalary != null ? (
              <ProfileFactRow
                label={t.homeCurrentSalaryLabel}
                value={t.salaryPerMonth(String(currentSalary))}
                variant="secondary"
              />
            ) : null}

          </View>

          <CandidateCvSection
            cvPath={candidate.cv_url as string | undefined}
            cvFileName={candidate.cv_file_name as string | undefined}
            candidateId={candidate.id as string}
            onUpdated={() => void load()}
          />

          {currentSalary != null ? (

            <Text style={[styles.salaryPrivate, { textAlign: rtl.textAlign }]}>

              {t.homeCurrentSalaryPrivate}

            </Text>

          ) : null}

        </SurfaceCard>

        <SectionLabel variant="group">{t.contactUnlocks}</SectionLabel>
        <SurfaceCard inset>
          <View style={[styles.statusRow, rtl.row]}>
            <View style={styles.metricBlock}>
              <Text style={styles.unlockValue}>{unlocks}</Text>
              <Text style={[styles.unlockLabel, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                {t.contactUnlocks}
              </Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.metricBlock}>
              <Text style={styles.unlockValue}>{profileViews}</Text>
              <Text style={[styles.unlockLabel, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                {t.profileViews}
              </Text>
            </View>
          </View>
          <Text style={[styles.statusHint, { textAlign: rtl.textAlign }]} numberOfLines={2}>
            {unlocks === 0 ? t.contactUnlocksEmpty : t.contactUnlocksHint}
          </Text>
        </SurfaceCard>

        {!showCompletionProminent && completion.percent < 100 ? completionCard : null}



        <SectionLabel variant="group">{t.candidateAdditionalRolesTitle}</SectionLabel>

        <Pressable

          onPress={openAdditionalRoles}

          style={({ pressed }) => pressed && styles.pressed}

          accessibilityRole="button"

          accessibilityLabel={t.candidateAdditionalRolesCta}

        >

          <SurfaceCard inset>

            <Text style={[styles.alsoCardSub, { textAlign: rtl.textAlign }]}>

              {alsoRoles.length > 0

                ? t.candidateAdditionalRolesCount(alsoRoles.length, 2)

                : t.candidateAdditionalRolesHint}

            </Text>

            <Text style={[styles.alsoCardCta, { textAlign: rtl.textAlignEnd }]}>

              {alsoRoles.length > 0

                ? t.candidateAdditionalRolesEdit

                : t.candidateAdditionalRolesCta}

            </Text>

          </SurfaceCard>

        </Pressable>



        {isActive && !isHired ? (

          <SecondaryButton

            label={t.homeGotHired}

            onPress={markHired}
            loading={statusUpdating}

            accessibilityHint={t.markHiredA11y}

          />

        ) : null}

      </View>

    </TabScreenLayout>
    {dialog}
    </>
  );

}



const styles = StyleSheet.create({

  sections: { gap: spacing.xs },

  banner: {

    padding: spacing.md,

    backgroundColor: colors.warningTint,

    borderRadius: layout.cardRadius,

    marginBottom: spacing.md,

  },

  bannerText: { color: colors.warningText, lineHeight: 20, fontWeight: '500' },

  bannerHired: { backgroundColor: colors.secondaryTint },

  bannerTextHired: { color: colors.secondaryDark, fontWeight: '600', lineHeight: 20 },

  profileToolbar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  editPressable: { alignSelf: 'flex-end' },

  activeInline: {
    flex: 1.2,
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },

  activeLabel: { ...typography.caption, fontWeight: '600', color: colors.textPrimary },

  editLink: {

    ...typography.caption,

    fontWeight: '700',

    color: colors.primary,

  },

  profileHero: { alignItems: 'center', marginBottom: spacing.md },

  photo: { width: 88, height: 88, borderRadius: 44 },

  photoPh: {
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },

  initials: { fontSize: 32, fontWeight: '700', color: colors.primary },
  photoCta: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  name: { ...typography.h2, marginTop: spacing.sm },

  roleLine: {

    ...typography.body,

    fontWeight: '700',

    color: colors.textPrimary,

    marginTop: spacing.xs,

  },

  alsoLine: {

    ...typography.caption,

    color: colors.textSecondary,

    marginTop: spacing.xs,

    lineHeight: 18,

  },

  chipWrap: { marginTop: spacing.sm },

  facts: { width: '100%', gap: spacing.xs },

  salaryPrivate: {

    ...typography.caption,

    color: colors.placeholder,

    marginTop: spacing.sm,

    lineHeight: 18,

  },

  statusRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statusDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.divider,
  },
  statusHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 18,
  },
  metricBlock: { alignItems: 'center', minWidth: 72, flex: 1, flexShrink: 1 },
  unlockValue: { fontSize: 28, fontWeight: '800', color: colors.primary, lineHeight: 32 },
  unlockLabel: { ...typography.caption, fontWeight: '600', color: colors.textSecondary, marginTop: 2 },

  alsoCardSub: {

    ...typography.caption,

    color: colors.textSecondary,

    lineHeight: 20,

    marginBottom: spacing.sm,

  },

  alsoCardCta: {

    ...typography.caption,

    fontWeight: '700',

    color: colors.primary,

  },

  pressed: { opacity: interaction.pressed },

});


