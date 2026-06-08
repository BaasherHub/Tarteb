import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import {
  OnboardingStepIntro,
  onboardingStepStyles,
} from '@/features/candidate/presentation/components/OnboardingStepIntro';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { DateField } from '@/shared/widgets/DateField';
import { FieldError } from '@/shared/widgets/FieldError';
import { LanguageSelectList } from '@/shared/widgets/LanguageSelectList';
import { SectionHint, SectionLabel } from '@/shared/widgets/SectionLabel';
import { SelectableChip } from '@/shared/widgets/SelectableChip';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { clearCandidateOnboardingDraft } from '@/features/candidate/providers/CandidateOnboardingContext';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
import { resolveNationality } from '@/shared/constants/nationalities';
import { parseLocation } from '@/shared/constants/uaeLocations';
import { formatIsoDateLocal, parseIsoDateLocal } from '@/shared/utils/dateFormat';
import { getErrorMessage } from '@/shared/utils/errors';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import { spacing } from '@/core/theme/spacing';
import {
  CORE_LANGUAGE_OPTIONS,
  EXPERIENCE_OPTIONS,
  MORE_LANGUAGE_OPTIONS,
} from '@/features/candidate/domain/constants/candidate';
import { normalizeAdditionalRoles } from '@/shared/utils/candidateRoles';
import { sanitizeLanguages } from '@/shared/utils/languages';
import {
  isValidAuthPhoneE164,
  validateOptionalAuthPhone,
} from '@/shared/utils/phone';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;

type Errors = {
  experience?: string;
  languages?: string;
};

function hasDistrict(location: string | undefined): boolean {
  return Boolean(parseLocation(location ?? '').area?.trim());
}

export function Step4Finish({ navigation }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep } = useCandidateOnboarding();
  const [availableFrom, setAvailableFrom] = useState<Date | null>(() =>
    data.availableFrom ? parseIsoDateLocal(data.availableFrom) : null,
  );
  const [showMoreLanguages, setShowMoreLanguages] = useState(() =>
    data.languages.some((l) => (MORE_LANGUAGE_OPTIONS as readonly string[]).includes(l)),
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | undefined>();

  const languageOptions = useMemo(
    () =>
      showMoreLanguages
        ? [...CORE_LANGUAGE_OPTIONS, ...MORE_LANGUAGE_OPTIONS]
        : [...CORE_LANGUAGE_OPTIONS],
    [showMoreLanguages],
  );

  const toggleLang = (lang: string) => {
    const set = new Set(data.languages);
    if (set.has(lang)) set.delete(lang);
    else set.add(lang);
    update({ languages: [...set] });
    setErrors((e) => ({ ...e, languages: undefined }));
  };

  const prerequisiteError = (): string | undefined => {
    if (!data.photoUrl) return t.errPhotoGoBackStep1;
    if (!data.role?.trim()) return t.errRole;
    if (!String(data.name ?? '').trim()) return t.errNameGoBackStep3;
    if (!resolveNationality(data.nationality ?? '')) return t.errNationalityPick;
    if (!hasDistrict(data.location)) return t.errLocationArea;
    const phoneE164 = (data.phone ?? '').trim();
    if (!phoneE164 || !isValidAuthPhoneE164(phoneE164)) {
      return phoneE164 ? t.errPhoneInvalidArabRegion : t.errPhone;
    }
    if (!data.visaStatus) return t.errSalaryVisaGoBackStep4;
    if (!data.currentSalary) return t.errSalaryVisaGoBackStep4;
    if (!data.salaryExpectation) return t.errSalaryVisaGoBackStep4;
    return undefined;
  };

  const submit = async () => {
    const prereq = prerequisiteError();
    if (prereq) {
      setSubmitError(prereq);
      return;
    }

    const nextErrors: Errors = {};
    if (data.yearsExperience === undefined) nextErrors.experience = t.errExperience;
    if (data.languages.length === 0) nextErrors.languages = t.errLanguages;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSubmitError(undefined);
      return;
    }

    setSubmitError(undefined);
    setLoading(true);
    const phoneE164 = (data.phone ?? '').trim();
    const whatsappResult = validateOptionalAuthPhone(data.whatsapp);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not signed in');

      const nationality =
        resolveNationality(data.nationality ?? '') ?? data.nationality?.trim() ?? '';

      const payload = {
        user_id: userId,
        name: String(data.name).trim(),
        photo_url: data.photoUrl,
        role: data.role,
        additional_roles: data.candidateId
          ? normalizeAdditionalRoles(data.role ?? '', data.additionalRoles ?? [])
          : [],
        visa_status: data.visaStatus,
        nationality,
        current_salary: data.currentSalary,
        salary_expectation: data.salaryExpectation,
        available_from: availableFrom ? formatIsoDateLocal(availableFrom) : null,
        location: data.location,
        phone: phoneE164,
        whatsapp: whatsappResult.ok ? whatsappResult.e164 : null,
        years_experience: data.yearsExperience ?? 0,
        languages: sanitizeLanguages(data.languages),
        uae_experience: null,
        previous_employer: null,
        is_active: true,
      };

      const { error } = await supabase
        .from('candidates')
        .upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;

      await clearCandidateOnboardingDraft();
      navigation.reset({ index: 0, routes: [{ name: 'CandidateShell' }] });
    } catch (e) {
      setSubmitError(getErrorMessage(e, t.errorGeneric));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={data.candidateId ? t.saveProfile : t.submitProfile}
      onPrimary={submit}
      primaryLoading={loading}
      backLabel={t.back}
      onBack={() => setStep(4)}
    >
      <OnboardingStepIntro>{t.onboardingStepExperienceIntro}</OnboardingStepIntro>

      {submitError ? <InfoBanner message={submitError} variant="warning" /> : null}

      <SurfaceCard inset style={onboardingStepStyles.formCard}>
        <SectionLabel first required>
          {t.yearsExperience}
        </SectionLabel>
        <SectionHint>{t.experienceSelectOne}</SectionHint>
        <View style={[onboardingStepStyles.chipGrid, rtl.row]}>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <View key={opt.years} style={onboardingStepStyles.chipCell}>
              <SelectableChip
                compact
                label={t.experienceBucketLabel(opt.years)}
                selected={data.yearsExperience === opt.years}
                onPress={() => {
                  update({ yearsExperience: opt.years });
                  setErrors((e) => ({ ...e, experience: undefined }));
                }}
              />
            </View>
          ))}
        </View>
        <FieldError message={errors.experience} />

        <SectionLabel required>{t.languages}</SectionLabel>
        <SectionHint>{t.languagesSelectAll}</SectionHint>
        <LanguageSelectList
          options={languageOptions}
          selected={data.languages}
          onToggle={toggleLang}
        />
        {MORE_LANGUAGE_OPTIONS.length > 0 ? (
          <Pressable
            onPress={() => setShowMoreLanguages((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={showMoreLanguages ? t.hideMoreLanguages : t.showMoreLanguages}
          >
            <Text style={[styles.moreLink, { textAlign: rtl.textAlign }]}>
              {showMoreLanguages ? t.hideMoreLanguages : t.showMoreLanguages}
            </Text>
          </Pressable>
        ) : null}
        <FieldError message={errors.languages} />

        <DateField
          label={t.availableFrom}
          optional
          hint={t.availableFromOptionalHint}
          value={availableFrom}
          onChange={(date) => {
            setAvailableFrom(date);
            update({ availableFrom: formatIsoDateLocal(date) });
          }}
        />
      </SurfaceCard>
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  moreLink: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
});
