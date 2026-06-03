import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CandidateOnboardingStep } from '../../../components/CandidateOnboardingStep';
import { PhotoAvatarPicker } from '../../../components/PhotoAvatarPicker';
import { JobRoleGrid } from '../../../components/JobRoleGrid';
import { FieldError } from '../../../components/FieldError';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { useLocale } from '../../../i18n/LocaleContext';
import { uploadCandidatePhoto } from '../../../services/candidatePhoto';
import { InfoBanner } from '../../../components/InfoBanner';
import { typography } from '../../../constants/typography';
import { colors } from '../../../constants/colors';

export function Step1PhotoRole() {
  const { t, isRtl } = useLocale();
  const { data, update, setStep } = useCandidateOnboarding();
  const scrollRef = useRef<ScrollView>(null);
  const roleSectionY = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ role?: string; photo?: string }>({});
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
      setErrors((e) => ({ ...e, photo: undefined }));
    } catch (e) {
      setPermissionError(e instanceof Error ? e.message : t.errorGeneric);
      setLocalUri(null);
    } finally {
      setUploading(false);
    }
  };

  const scrollToRole = () => {
    scrollRef.current?.scrollTo({ y: roleSectionY.current, animated: true });
  };

  const goToStep2 = (skipPhoto: boolean) => {
    if (!data.role) {
      setErrors({ role: t.errRole });
      scrollToRole();
      return;
    }
    if (!skipPhoto && !data.photoUrl && !localUri) {
      setErrors({ role: undefined, photo: t.errPhotoRequired });
      return;
    }
    setErrors({});
    if (skipPhoto) {
      setLocalUri(null);
      update({ photoUrl: null });
    }
    setStep(2);
  };

  const imageUri = localUri ?? data.photoUrl ?? undefined;

  return (
    <CandidateOnboardingStep
      scrollRef={scrollRef}
      primaryLabel={t.continue}
      onPrimary={() => goToStep2(false)}
      primaryLoading={uploading}
      secondaryLabel={t.skipPhotoForNow}
      onSecondary={() => goToStep2(true)}
      secondaryDisabled={uploading}
    >
      <View
        onLayout={(e) => {
          roleSectionY.current = e.nativeEvent.layout.y;
        }}
      >
        <Text style={[styles.section, isRtl && styles.rtlText]}>{t.candidatePickRole}</Text>
        <Text style={[styles.roleHint, isRtl && styles.rtlText]}>{t.candidatePickRoleHint}</Text>
        <JobRoleGrid
          selectedRole={data.role}
          onSelectRole={(role) => {
            update({ role });
            setErrors((e) => ({ ...e, role: undefined }));
          }}
        />
        {data.role ? (
          <Text style={[styles.selectedRole, isRtl && styles.rtlText]}>
            {t.roleSelected}: {data.role}
          </Text>
        ) : null}
        <FieldError message={errors.role} />
      </View>

      <Text style={[styles.title, { marginTop: 24 }]}>{t.yourPhoto}</Text>
      <Text style={styles.hint}>{t.photoHint}</Text>
      <Text style={styles.skipHint}>{t.skipPhotoForNowHint}</Text>
      {permissionError ? (
        <InfoBanner message={permissionError} variant="warning" />
      ) : null}
      <FieldError message={errors.photo} />
      <PhotoAvatarPicker
        imageUri={imageUri}
        initial={data.role?.charAt(0) ?? '?'}
        onPressCamera={() => pickImage(true)}
        onPressGallery={() => pickImage(false)}
      />
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, marginBottom: 8 },
  hint: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 4 },
  skipHint: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  section: { ...typography.h3, marginBottom: 6 },
  roleHint: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 14 },
  selectedRole: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  rtlText: { writingDirection: 'rtl' },
});
