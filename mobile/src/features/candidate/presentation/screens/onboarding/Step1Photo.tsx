import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { OnboardingStepIntro } from '@/features/candidate/presentation/components/OnboardingStepIntro';
import { PhotoEmptyEncouragement } from '@/features/candidate/presentation/components/PhotoEmptyEncouragement';
import { useLocale } from '@/core/i18n/LocaleContext';
import { uploadCandidatePhoto } from '@/features/candidate/data/services/candidatePhoto';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { getErrorMessage } from '@/shared/utils/errors';
import { FieldError } from '@/shared/widgets/FieldError';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { PhotoAvatarPicker } from '@/features/candidate/presentation/components/PhotoAvatarPicker';
import { RequiredBadge } from '@/shared/widgets/RequiredBadge';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';

export function Step1Photo() {
  const { t } = useLocale();
  const { data, update, setStep } = useCandidateOnboarding();
  const [uploading, setUploading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const [permissionError, setPermissionError] = useState<string | undefined>();

  const pickImage = async (useCamera: boolean) => {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setPermissionError(t.permissionRequired);
      return;
    }
    setPermissionError(undefined);
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.85 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setLocalUri(asset.uri);
    setUploading(true);
    try {
      const url = await uploadCandidatePhoto(
        asset.uri,
        asset.fileName ?? 'photo.jpg',
        asset.mimeType ?? 'image/jpeg',
      );
      update({ photoUrl: url });
      setPhotoError(undefined);
    } catch (e) {
      setPermissionError(getErrorMessage(e, t.errorGeneric));
      setLocalUri(null);
    } finally {
      setUploading(false);
    }
  };

  const imageUri = localUri ?? data.photoUrl ?? undefined;
  const hasPhoto = Boolean(imageUri);

  const next = () => {
    if (!hasPhoto) {
      setPhotoError(t.errPhotoRequired);
      return;
    }
    setPhotoError(undefined);
    setStep(2);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      primaryLoading={uploading}
    >
      <OnboardingStepIntro>{t.onboardingStepPhotoIntro}</OnboardingStepIntro>

      <SurfaceCard
        inset
        style={[styles.photoCard, !hasPhoto && styles.photoCardHighlight]}
      >
        <View style={styles.badgeRow}>
          <RequiredBadge />
        </View>
        <PhotoAvatarPicker
          size="large"
          imageUri={imageUri}
          onPressCamera={() => pickImage(true)}
          onPressGallery={() => pickImage(false)}
        />
        {!hasPhoto ? <PhotoEmptyEncouragement /> : null}
        {permissionError ? <InfoBanner message={permissionError} variant="warning" /> : null}
        <FieldError message={photoError} />
      </SurfaceCard>
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  photoCard: {
    gap: spacing.md,
    marginBottom: 0,
  },
  photoCardHighlight: {
    borderColor: `${colors.primary}66`,
    borderWidth: 1.5,
    backgroundColor: colors.primaryTint,
  },
  badgeRow: {
    marginBottom: spacing.xs,
  },
});
