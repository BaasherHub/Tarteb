import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { uploadEmployerLogo } from '@/features/employer/data/services/employerLogo';
import { EmployerOnboardingStep } from '@/features/employer/presentation/components/EmployerOnboardingStep';
import { CompanyLogoPicker } from '@/features/employer/presentation/components/CompanyLogoPicker';
import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { getErrorMessage } from '@/shared/utils/errors';
import { FormField } from '@/shared/widgets/FormField';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
export function EmployerStep1Company() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
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

  return (
    <EmployerOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      primaryLoading={uploading}
    >
      <Text style={[styles.kicker, { textAlign: rtl.textAlignCenter }]}>
        {isEditMode ? t.employerEditKicker : t.employerOnboardingKicker}
      </Text>
      <Text style={[styles.intro, { textAlign: rtl.textAlign }]}>
        {isEditMode ? t.employerOnboardingEditStep1Intro : t.employerOnboardingStep1Intro}
      </Text>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { textAlign: rtl.textAlign }]}>
          {t.companyLogo}
        </Text>
        {uploadError ? <InfoBanner message={uploadError} variant="warning" /> : null}
        <CompanyLogoPicker
          imageUri={logoUri}
          companyInitial={data.companyName || 'C'}
          onPressGallery={() => void pickLogo()}
        />
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
        <FormField
          label={t.tradeLicense}
          value={data.tradeLicense}
          onChangeText={(v) => update({ tradeLicense: v })}
          placeholder={t.tradeLicensePlaceholder}
          autoCapitalize="characters"
        />
        <Text style={[styles.hint, { textAlign: rtl.textAlign }]} numberOfLines={3}>
          {t.tradeLicenseHint}
        </Text>
      </View>
    </EmployerOnboardingStep>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: spacing.xs,
  },
  cardTitle: { ...typography.h3, marginBottom: spacing.sm },
  hint: { ...typography.caption, color: colors.textSecondary },
});
