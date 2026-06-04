import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { FormField } from '@/shared/widgets/FormField';
import { DateField } from '@/shared/widgets/DateField';
import { FieldError } from '@/shared/widgets/FieldError';
import { SelectableChip } from '@/shared/widgets/SelectableChip';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { clearCandidateOnboardingDraft } from '@/features/candidate/providers/CandidateOnboardingContext';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
import { resolveNationality } from '@/shared/constants/nationalities';
import { formatIsoDateLocal, parseIsoDateLocal } from '@/shared/utils/dateFormat';
import { getErrorMessage } from '@/shared/utils/errors';
import { promptForPushNotifications } from '@/core/services/notifications';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import { spacing } from '@/core/theme/spacing';
import {
  EXPERIENCE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '@/features/candidate/domain/constants/candidate';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;

type Errors = {
  experience?: string;
  languages?: string;
  uae?: string;
  name?: string;
  date?: string;
};

export function Step4Finish({ navigation }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep } = useCandidateOnboarding();
  const [name, setName] = useState(data.name ?? '');
  const [availableFrom, setAvailableFrom] = useState<Date | null>(() =>
    data.availableFrom ? parseIsoDateLocal(data.availableFrom) : null,
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | undefined>();

  const toggleLang = (lang: string) => {
    const set = new Set(data.languages);
    if (set.has(lang)) set.delete(lang);
    else set.add(lang);
    update({ languages: [...set] });
    setErrors((e) => ({ ...e, languages: undefined }));
  };

  const submit = async () => {
    const nextErrors: Errors = {};
    if (data.yearsExperience === undefined) nextErrors.experience = t.errExperience;
    if (data.languages.length === 0) nextErrors.languages = t.errLanguages;
    if (data.uaeExperience === undefined) nextErrors.uae = t.errUae;
    if (!name.trim()) nextErrors.name = t.errFullName;
    if (!availableFrom) nextErrors.date = t.errAvailableFrom;
    if (!data.photoUrl) {
      setSubmitError(t.errPhotoRequired);
      return;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitError(undefined);
    setLoading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not signed in');

      const nationality =
        resolveNationality(data.nationality ?? '') ?? data.nationality?.trim() ?? '';
      const dateStr = formatIsoDateLocal(availableFrom!);

      const payload = {
        user_id: userId,
        name: name.trim(),
        photo_url: data.photoUrl,
        role: data.role,
        visa_status: data.visaStatus,
        nationality,
        salary_expectation: data.salaryExpectation,
        available_from: dateStr,
        location: data.location,
        phone: data.phone,
        whatsapp: data.whatsapp,
        years_experience: data.yearsExperience ?? 0,
        languages: data.languages,
        uae_experience: data.uaeExperience,
        previous_employer: data.previousEmployer,
        is_active: true,
      };

      const { error } = await supabase
        .from('candidates')
        .upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;

      await clearCandidateOnboardingDraft();
      await promptForPushNotifications(t);
      navigation.reset({ index: 0, routes: [{ name: 'CandidateShell' }] });
    } catch (e) {
      setSubmitError(getErrorMessage(e, t.errorGeneric));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CandidateOnboardingStep
      scroll={false}
      primaryLabel={data.candidateId ? t.saveProfile : t.submitProfile}
      onPrimary={submit}
      primaryLoading={loading}
      backLabel={t.back}
      onBack={() => setStep(4)}
    >
      <Text style={[styles.pageTitle, { textAlign: rtl.textAlign }]}>
        {t.onboardingStep4Title}
      </Text>
      {submitError ? (
        <Text style={[styles.submitErr, { textAlign: rtl.textAlign }]} accessibilityRole="alert">
          {submitError}
        </Text>
      ) : null}

      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.yearsExperience}</Text>
      <FieldError message={errors.experience} />
      <View style={[styles.wrap, rtl.row]}>
        {EXPERIENCE_OPTIONS.map((opt) => (
          <SelectableChip
            key={opt.years}
            label={opt.label}
            selected={data.yearsExperience === opt.years}
            onPress={() => {
              update({ yearsExperience: opt.years });
              setErrors((e) => ({ ...e, experience: undefined }));
            }}
          />
        ))}
      </View>

      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.languages}</Text>
      <FieldError message={errors.languages} />
      <View style={[styles.wrap, rtl.row]}>
        {LANGUAGE_OPTIONS.map((lang) => (
          <SelectableChip
            key={lang}
            label={lang}
            selected={data.languages.includes(lang)}
            onPress={() => toggleLang(lang)}
          />
        ))}
      </View>

      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.uaeExperience}</Text>
      <FieldError message={errors.uae} />
      <View style={styles.yesNo}>
        <View style={styles.half}>
          <SelectableChip
            label={t.yes}
            selected={data.uaeExperience === true}
            onPress={() => {
              update({ uaeExperience: true });
              setErrors((e) => ({ ...e, uae: undefined }));
            }}
          />
        </View>
        <View style={styles.half}>
          <SelectableChip
            label={t.no}
            selected={data.uaeExperience === false}
            onPress={() => {
              update({ uaeExperience: false });
              setErrors((e) => ({ ...e, uae: undefined }));
            }}
          />
        </View>
      </View>

      <FormField
        label={t.previousEmployer}
        value={data.previousEmployer ?? ''}
        onChangeText={(v) => update({ previousEmployer: v || null })}
        placeholder={t.previousEmployerPlaceholder}
      />

      <View style={styles.divider} />

      <FormField
        label={t.fullName}
        value={name}
        onChangeText={(v) => {
          setName(v);
          update({ name: v });
          setErrors((e) => ({ ...e, name: undefined }));
        }}
        placeholder={t.fullNamePlaceholder}
        error={errors.name}
      />
      <DateField
        label={t.availableFrom}
        hint={t.availableFromHint}
        value={availableFrom}
        onChange={(date) => {
          setAvailableFrom(date);
          if (date) update({ availableFrom: formatIsoDateLocal(date) });
          setErrors((e) => ({ ...e, date: undefined }));
        }}
        error={errors.date}
      />
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  pageTitle: { ...typography.h2, marginBottom: spacing.md },
  submitErr: { ...typography.caption, color: colors.error, marginBottom: spacing.md },
  section: { ...typography.h3, marginTop: spacing.md, marginBottom: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  yesNo: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
});
