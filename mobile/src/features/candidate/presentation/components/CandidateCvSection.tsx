import { createElement, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
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
import {
  openExternalUrl,
} from '@/shared/utils/openExternalUrl';
import { useAppAlert } from '@/shared/hooks/useAppAlert';
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

type Props = {
  cvPath: string | null | undefined;
  cvFileName: string | null | undefined;
  candidateId: string;
  onUpdated: () => void | Promise<void>;
};

export function CandidateCvSection({ cvPath, cvFileName, candidateId, onUpdated }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { showError } = useAppAlert();
  const { runConfirmAction, dialog } = useConfirmDialog();
  const [busy, setBusy] = useState(false);
  const [webCvUrl, setWebCvUrl] = useState<string | null>(null);
  const [webViewerOpen, setWebViewerOpen] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || !cvPath) {
      setWebCvUrl(null);
      return;
    }

    let cancelled = false;
    setWebCvUrl(null);
    void getCandidateCvSignedUrl(cvPath, 3600, candidateId)
      .then((url) => {
        if (!cancelled) setWebCvUrl(url);
      })
      .catch(() => {
        if (!cancelled) setWebCvUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [candidateId, cvPath]);

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
      showError(t.errorTitle, t.cvInvalidFile);
      return;
    }

    setBusy(true);
    try {
      // uploadCandidateCv calls the backend which also updates the candidate record
      await uploadCandidateCv(asset.uri, name, asset.mimeType, asset.size);
      await onUpdated();
    } catch (e) {
      showError(t.errorTitle, getErrorMessage(e, t.cvUploadFailed));
    } finally {
      setBusy(false);
    }
  };

  const openCv = async () => {
    if (!cvPath) return;
    setBusy(true);
    try {
      const url = await getCandidateCvSignedUrl(cvPath, 3600, candidateId);
      await openExternalUrl(url, {
        platform: Platform.OS,
        canOpenURL: Linking.canOpenURL,
        openURL: Linking.openURL,
      });
    } catch (e) {
      showError(t.errorTitle, getErrorMessage(e, t.cvOpenFailed));
    } finally {
      setBusy(false);
    }
  };

  const removeCv = () => {
    if (!cvPath) return;
    runConfirmAction(
      {
        title: t.cvRemoveTitle,
        message: t.cvRemoveMessage,
        confirmLabel: t.cvRemoveConfirm,
        cancelLabel: t.cancel,
      },
      async () => {
        setBusy(true);
        try {
          // removeCandidateCvFile calls the backend which also clears the candidate record
          await removeCandidateCvFile(cvPath);
          await onUpdated();
        } catch (e) {
          showError(t.errorTitle, getErrorMessage(e, t.errorGeneric));
        } finally {
          setBusy(false);
        }
      },
    );
  };

  const displayName = cvFileName?.trim() || t.cvAttached;
  const fileRowContent = (
    <>
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
    </>
  );

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
            onPress={
              Platform.OS === 'web' && webCvUrl
                ? () => setWebViewerOpen(true)
                : () => void openCv()
            }
            disabled={busy}
            style={({ pressed }) => [styles.fileRow, rtl.row, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={t.cvViewA11y}
          >
            {fileRowContent}
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
      {dialog}
      {Platform.OS === 'web' && webCvUrl ? (
        <Modal
          visible={webViewerOpen}
          animationType="slide"
          onRequestClose={() => setWebViewerOpen(false)}
        >
          <View style={styles.webViewer}>
            <View style={[styles.webViewerHeader, rtl.row]}>
              <Text style={[styles.webViewerTitle, { textAlign: rtl.textAlign }]} numberOfLines={1}>
                {displayName}
              </Text>
              <Pressable
                onPress={() => setWebViewerOpen(false)}
                style={({ pressed }) => [styles.webViewerClose, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={t.cancel}
              >
                <Text style={styles.webViewerCloseText}>{t.cancel}</Text>
              </Pressable>
            </View>
            {createElement('iframe', {
              src: webCvUrl,
              title: displayName,
              style: { border: 0, flex: 1, height: '100%', width: '100%' },
            })}
          </View>
        </Modal>
      ) : null}
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
  webViewer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  webViewerHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  webViewerTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  webViewerClose: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  webViewerCloseText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
  },
  pressed: { opacity: interaction.pressed },
});
