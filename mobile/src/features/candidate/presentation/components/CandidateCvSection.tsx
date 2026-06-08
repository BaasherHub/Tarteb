import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
import { colors } from '@/core/theme/colors';
import { layout } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { interaction } from '@/core/theme/interaction';
import {
  getCandidateCvSignedUrl,
  isAllowedCvFile,
  removeCandidateCvFile,
  uploadCandidateCv,
} from '@/shared/services/candidateCv';
import { getErrorMessage } from '@/shared/utils/errors';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

type Props = {
  cvPath: string | null | undefined;
  cvFileName: string | null | undefined;
  onUpdated: () => void | Promise<void>;
};

export function CandidateCvSection({ cvPath, cvFileName, onUpdated }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const [busy, setBusy] = useState(false);

  const pickAndUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const name = asset.name ?? 'cv.pdf';
    if (!isAllowedCvFile(name, asset.size ?? null)) {
      Alert.alert(t.errorTitle, t.cvInvalidFile);
      return;
    }

    setBusy(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const { path, fileName } = await uploadCandidateCv(
        asset.uri,
        name,
        asset.mimeType,
        asset.size,
      );

      if (cvPath && cvPath !== path) {
        await removeCandidateCvFile(cvPath).catch(() => {});
      }

      const { error } = await supabase
        .from('candidates')
        .update({ cv_url: path, cv_file_name: fileName })
        .eq('user_id', userId);
      if (error) throw error;

      await onUpdated();
    } catch (e) {
      Alert.alert(t.errorTitle, getErrorMessage(e, t.cvUploadFailed));
    } finally {
      setBusy(false);
    }
  };

  const openCv = async () => {
    if (!cvPath) return;
    setBusy(true);
    try {
      const url = await getCandidateCvSignedUrl(cvPath);
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) throw new Error('Cannot open CV');
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert(t.errorTitle, getErrorMessage(e, t.cvOpenFailed));
    } finally {
      setBusy(false);
    }
  };

  const removeCv = () => {
    if (!cvPath) return;
    Alert.alert(t.cvRemoveTitle, t.cvRemoveMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.cvRemoveConfirm,
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setBusy(true);
            try {
              const userId = (await supabase.auth.getUser()).data.user?.id;
              if (!userId) return;

              await removeCandidateCvFile(cvPath).catch(() => {});
              const { error } = await supabase
                .from('candidates')
                .update({ cv_url: null, cv_file_name: null })
                .eq('user_id', userId);
              if (error) throw error;
              await onUpdated();
            } catch (e) {
              Alert.alert(t.errorTitle, getErrorMessage(e, t.errorGeneric));
            } finally {
              setBusy(false);
            }
          })();
        },
      },
    ]);
  };

  const displayName = cvFileName?.trim() || t.cvAttached;

  return (
    <View style={styles.wrap}>
      <View style={[styles.head, rtl.row]}>
        <AppIcon name="document-text-outline" size={20} color={colors.primary} />
        <View style={styles.headText}>
          <Text style={[styles.title, { textAlign: rtl.textAlign }]}>{t.cvSectionTitle}</Text>
          <Text style={[styles.hint, { textAlign: rtl.textAlign }]} numberOfLines={3}>
            {t.cvSectionHint}
          </Text>
        </View>
      </View>

      {cvPath ? (
        <View style={styles.attached}>
          <Pressable
            onPress={() => void openCv()}
            disabled={busy}
            style={({ pressed }) => [styles.fileRow, rtl.row, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={t.cvViewA11y}
          >
            <AppIcon name="document" size={22} color={colors.primary} />
            <Text
              style={[styles.fileName, { textAlign: rtl.textAlign }]}
              numberOfLines={2}
              ellipsizeMode="middle"
            >
              {displayName}
            </Text>
            {busy ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <AppIcon
                name={rtl.isRtl ? 'chevron-back' : 'chevron-forward'}
                size={18}
                color={colors.textSecondary}
              />
            )}
          </Pressable>
          <View style={[styles.actions, rtl.row]}>
            <Pressable
              onPress={() => void pickAndUpload()}
              disabled={busy}
              style={({ pressed }) => [styles.textBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={t.cvReplace}
            >
              <Text style={styles.textBtnLabel}>{t.cvReplace}</Text>
            </Pressable>
            <Pressable
              onPress={removeCv}
              disabled={busy}
              style={({ pressed }) => [styles.textBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={t.cvRemoveConfirm}
            >
              <Text style={[styles.textBtnLabel, styles.danger]}>{t.cvRemoveConfirm}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <SecondaryButton
          label={t.cvUpload}
          onPress={pickAndUpload}
          loading={busy}
          accessibilityHint={t.cvSectionHint}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  head: { alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.md },
  headText: { flex: 1, minWidth: 0 },
  title: { ...typography.label, fontWeight: '700', color: colors.textPrimary },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  attached: { gap: spacing.sm },
  fileRow: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.primaryTint,
  },
  fileName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
    minWidth: 0,
  },
  actions: { gap: spacing.lg, paddingHorizontal: spacing.xs },
  textBtn: { minHeight: 44, justifyContent: 'center' },
  textBtnLabel: { ...typography.caption, fontWeight: '700', color: colors.primary },
  danger: { color: colors.error },
  pressed: { opacity: interaction.pressed },
});
