import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CandidateOnboardingStep } from '../../../components/CandidateOnboardingStep';
import { VisaChip } from '../../../components/VisaChip';
import { AutocompleteField } from '../../../components/AutocompleteField';
import { LocationPicker } from '../../../components/LocationPicker';
import { FieldError } from '../../../components/FieldError';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { useLocale } from '../../../i18n/LocaleContext';
import { filterNationalities, resolveNationality } from '../../../constants/nationalities';
import { VISA_STATUSES } from '../../../constants/candidate';
import { visaChipColor } from '../../../utils/visa';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type Errors = { visa?: string; nationality?: string; location?: string };

export function Step2Visa() {
  const { t } = useLocale();
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
    setStep(3);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      backLabel={t.back}
      onBack={() => setStep(1)}
    >
      <Text style={styles.title}>{t.visaStatus}</Text>
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
        hint={t.nationalityHint}
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
  title: { ...typography.h2, marginBottom: 8 },
  visaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
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
