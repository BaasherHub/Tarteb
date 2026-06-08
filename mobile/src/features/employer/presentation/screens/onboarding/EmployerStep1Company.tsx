import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { supabase } from '@/core/lib/supabase';
import { EmployerOnboardingStep } from '@/features/employer/presentation/components/EmployerOnboardingStep';
import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';
import {
  companyNameCheckErrorMessage,
  isCompanyNameAvailable,
  normalizeCompanyName,
} from '@/features/employer/data/services/companyName';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { FormField } from '@/shared/widgets/FormField';
import {
  OnboardingStepIntro,
  onboardingStepStyles,
} from '@/shared/widgets/OnboardingStepIntro';

export function EmployerStep1Company() {
  const { t } = useLocale();
  const { data, update, setStep, isEditMode } = useEmployerOnboarding();
  const [companyError, setCompanyError] = useState<string | undefined>();
  const [checking, setChecking] = useState(false);

  const next = async () => {
    const companyName = normalizeCompanyName(data.companyName);
    if (!companyName) {
      setCompanyError(t.errCompany);
      return;
    }

    setChecking(true);
    setCompanyError(undefined);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const available = await isCompanyNameAvailable(companyName, userId);
      if (!available) {
        setCompanyError(t.errCompanyTaken);
        return;
      }

      if (companyName !== data.companyName) {
        update({ companyName });
      }
      setStep(2);
    } catch (e) {
      setCompanyError(companyNameCheckErrorMessage(e, t));
    } finally {
      setChecking(false);
    }
  };

  return (
    <EmployerOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      primaryLoading={checking}
    >
      <OnboardingStepIntro>
        {isEditMode ? t.employerOnboardingEditStep1Intro : t.employerOnboardingStep1Intro}
      </OnboardingStepIntro>

      <SurfaceCard inset style={onboardingStepStyles.formCard}>
        <View style={onboardingStepStyles.section}>
          <FormField
            label={t.companyName}
            required
            value={data.companyName}
            onChangeText={(v) => {
              update({ companyName: v });
              setCompanyError(undefined);
            }}
            error={companyError}
          />
        </View>

        <FormField
          label={t.tradeLicense}
          optional
          value={data.tradeLicense}
          onChangeText={(v) => update({ tradeLicense: v })}
          autoCapitalize="characters"
        />
      </SurfaceCard>
    </EmployerOnboardingStep>
  );
}
