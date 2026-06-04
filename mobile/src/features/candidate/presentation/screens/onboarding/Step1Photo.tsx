import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { PhotoEmptyEncouragement } from '@/features/candidate/presentation/components/PhotoEmptyEncouragement';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { uploadCandidatePhoto } from '@/features/candidate/data/services/candidatePhoto';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { getErrorMessage } from '@/shared/utils/errors';
import { FieldError } from '@/shared/widgets/FieldError';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { PhotoAvatarPicker } from '@/features/candidate/presentation/components/PhotoAvatarPicker';
import { RequiredBadge } from '@/shared/widgets/RequiredBadge';

export function Step1Photo() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
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
      <Text style={[styles.title, { textAlign: rtl.textAlignCenter }]}>
        {t.onboardingStepPhotoTitle}
      </Text>
      <Text style={[styles.intro, { textAlign: rtl.textAlignCenter }]}>
        {t.onboardingStepPhotoIntro}
      </Text>

      <View style={[styles.card, !hasPhoto && styles.cardHighlight]}>
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
        {permissionError ? (
          <View style={styles.feedback}>
            <InfoBanner message={permissionError} variant="warning" />
          </View>
        ) : null}
        <FieldError message={photoError} />
      </View>
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, marginBottom: spacing.sm },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    paddingTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  cardHighlight: {
    borderColor: `${colors.primary}66`,
    borderWidth: 1.5,
    backgroundColor: colors.primaryTint,
  },
  badgeRow: {
    marginBottom: spacing.md,
  },
  feedback: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
});
