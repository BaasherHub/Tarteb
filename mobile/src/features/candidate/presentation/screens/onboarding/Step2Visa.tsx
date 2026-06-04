import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { filterNationalities, resolveNationality } from '@/shared/constants/nationalities';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AutocompleteField } from '@/shared/widgets/AutocompleteField';
import { LocationPicker } from '@/shared/widgets/LocationPicker';
import { FieldError } from '@/shared/widgets/FieldError';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { VISA_STATUSES } from '@/features/candidate/domain/constants/candidate';
import { visaChipColor } from '@/shared/utils/visa';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { VisaChip } from '@/shared/widgets/VisaChip';


type Errors = { visa?: string; nationality?: string; location?: string };

export function Step2Visa() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep } = useCandidateOnboarding();
  const [errors, setErrors] = useState<Errors>({});
  const [nationalityQuery, setNationalityQuery] = useState(data.nationality ?? '');

  const nationalityOptions = useMemo(
    () => filterNationalities(nationalityQuery),
    [nationalityQuery],
  );

  const next = () => {
    const nextErrors: Errors = {};
    if (!data.visaStatus) nextErrors.visa = t.errVisa;
    const resolved = resolveNationality(nationalityQuery);
    if (!resolved) nextErrors.nationality = t.errNationalityPick;
    if (!data.location) nextErrors.location = t.errLocation;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    update({ nationality: resolved! });
    setStep(4);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      backLabel={t.back}
      onBack={() => setStep(2)}
    >
      <Text style={[styles.title, { textAlign: rtl.textAlign }]}>{t.onboardingStep2Title}</Text>
      <Text style={[styles.sub, { textAlign: rtl.textAlign }]}>{t.visaStatus}</Text>
      <FieldError message={errors.visa} />
      <View style={styles.visaGrid}>
        {VISA_STATUSES.map((status) => {
          const selected = data.visaStatus === status;
          const accent = visaChipColor(status);
          return (
            <Pressable
              key={status}
              onPress={() => {
                update({ visaStatus: status });
                setErrors((e) => ({ ...e, visa: undefined }));
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[
                styles.visaBtn,
                selected && { borderColor: accent, backgroundColor: `${accent}18` },
              ]}
            >
              <VisaChip label={status} />
            </Pressable>
          );
        })}
      </View>
      <AutocompleteField
        label={t.nationality}
        hint={`${t.nationalityHint} ${t.nationalityExamplesHint}`}
        value={nationalityQuery}
        onChangeText={(q) => {
          setNationalityQuery(q);
          setErrors((e) => ({ ...e, nationality: undefined }));
        }}
        onSelect={(n) => {
          setNationalityQuery(n);
          update({ nationality: n });
          setErrors((e) => ({ ...e, nationality: undefined }));
        }}
        options={nationalityOptions}
        placeholder={t.nationalityPlaceholder}
        emptyHint={t.errNationalityPick}
        error={errors.nationality}
      />
      <LocationPicker
        value={data.location ?? ''}
        onChange={(location) => {
          update({ location });
          setErrors((e) => ({ ...e, location: undefined }));
        }}
        error={errors.location}
      />
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, marginBottom: spacing.xs },
  sub: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  visaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  visaBtn: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
