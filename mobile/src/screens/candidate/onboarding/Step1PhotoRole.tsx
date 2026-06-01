import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { OnboardingProgress } from '../../../components/OnboardingProgress';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { useLocale } from '../../../i18n/LocaleContext';
import { CANDIDATE_ROLES } from '../../../constants/candidate';
import { uploadCandidatePhoto } from '../../../services/candidatePhoto';
import { colors } from '../../../constants/colors';

export function Step1PhotoRole() {
  const { t } = useLocale();
  const { data, update, setStep, totalSteps, step } = useCandidateOnboarding();
  const [uploading, setUploading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const pickImage = async (useCamera: boolean) => {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required');
      return;
    }
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
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
      setLocalUri(null);
    } finally {
      setUploading(false);
    }
  };

  const continueNext = (skipPhoto = false) => {
    if (!data.role) {
      Alert.alert(t.jobRole);
      return;
    }
    if (!skipPhoto && !data.photoUrl) {
      Alert.alert(t.yourPhoto);
      return;
    }
    if (skipPhoto) update({ photoUrl: null });
    setStep(2);
  };

  const imageUri = localUri ?? data.photoUrl ?? undefined;

  return (
    <View style={styles.flex}>
      <OnboardingProgress step={step} totalSteps={totalSteps} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t.yourPhoto}</Text>
        <View style={styles.avatarWrap}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]} />
          )}
        </View>
        <View style={styles.row}>
          <PrimaryButton label={t.camera} onPress={() => pickImage(true)} disabled={uploading} />
          <PrimaryButton label={t.gallery} onPress={() => pickImage(false)} disabled={uploading} />
        </View>
        <Text style={styles.section}>{t.jobRole}</Text>
        <View style={styles.roleGrid}>
          {CANDIDATE_ROLES.map((role) => {
            const selected = data.role === role;
            return (
              <Text
                key={role}
                onPress={() => update({ role })}
                style={[styles.roleChip, selected && styles.roleChipOn]}
              >
                {role}
              </Text>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label={t.continue}
          onPress={() => continueNext(false)}
          loading={uploading}
        />
        <PrimaryButton label={t.skipForNow} onPress={() => continueNext(true)} disabled={uploading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  avatarWrap: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 144, height: 144, borderRadius: 72 },
  placeholder: { backgroundColor: `${colors.primary}15` },
  row: { gap: 8, marginBottom: 24 },
  section: { fontWeight: '600', marginBottom: 12 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  roleChipOn: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
    color: colors.primary,
    fontWeight: '600',
  },
  footer: { padding: 20, gap: 8, borderTopWidth: 1, borderTopColor: colors.divider },
});
