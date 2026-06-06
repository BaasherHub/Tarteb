import React, { useState } from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocale } from '@/core/i18n/LocaleContext';
import { uploadEmployerLogo } from '@/features/employer/data/services/employerLogo';
import { EmployerOnboardingStep } from '@/features/employer/presentation/components/EmployerOnboardingStep';
import { CompanyLogoPicker } from '@/features/employer/presentation/components/CompanyLogoPicker';
import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { getErrorMessage } from '@/shared/utils/errors';
import { FormField } from '@/shared/widgets/FormField';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import {
  OnboardingStepIntro,
  onboardingStepStyles,
} from '@/shared/widgets/OnboardingStepIntro';
import { RequiredBadge } from '@/shared/widgets/RequiredBadge';

export function EmployerStep1Company() {
  const { t } = useLocale();
  const { data, update, setStep, isEditMode } = useEmployerOnboarding();
  const [localLogoUri, setLocalLogoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [companyError, setCompanyError] = useState<string | undefined>();
  const [uploadError, setUploadError] = useState<string | undefined>();

  const pickLogo = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setUploadError(t.permissionRequired);
      return;
    }
    setUploadError(undefined);
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setLocalLogoUri(asset.uri);
    setUploading(true);
    try {
      const url = await uploadEmployerLogo(
        asset.uri,
        asset.fileName ?? 'logo.jpg',
        asset.mimeType ?? 'image/jpeg',
      );
      update({ logoUrl: url });
    } catch (e) {
      setUploadError(getErrorMessage(e, t.errorGeneric));
      setLocalLogoUri(null);
    } finally {
      setUploading(false);
    }
  };

  const next = () => {
    if (!data.companyName.trim()) {
      setCompanyError(t.errCompany);
      return;
    }
    setCompanyError(undefined);
    setStep(2);
  };

  const logoUri = localLogoUri ?? data.logoUrl;
  const companyInitial = data.companyName.trim().charAt(0) || undefined;

  return (
    <EmployerOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      primaryLoading={uploading}
    >
      <OnboardingStepIntro>
        {isEditMode ? t.employerOnboardingEditStep1Intro : t.employerOnboardingStep1Intro}
      </OnboardingStepIntro>

      <SurfaceCard inset style={onboardingStepStyles.formCard}>
        <View style={onboardingStepStyles.logoWrap}>
          {uploadError ? <InfoBanner message={uploadError} variant="warning" /> : null}
          <CompanyLogoPicker
            imageUri={logoUri}
            companyInitial={companyInitial}
            onPressGallery={() => void pickLogo()}
          />
        </View>

        <View style={onboardingStepStyles.section}>
          <RequiredBadge />
          <FormField
            label={t.companyName}
            value={data.companyName}
            onChangeText={(v) => {
              update({ companyName: v });
              setCompanyError(undefined);
            }}
            placeholder={t.companyPlaceholder}
            error={companyError}
          />
        </View>

        <FormField
          label={t.tradeLicense}
          value={data.tradeLicense}
          onChangeText={(v) => update({ tradeLicense: v })}
          placeholder={t.tradeLicensePlaceholder}
          autoCapitalize="characters"
        />
      </SurfaceCard>
    </EmployerOnboardingStep>
  );
}
