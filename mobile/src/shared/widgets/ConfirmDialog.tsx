import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  highlight?: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  highlight,
  confirmLabel,
  cancelLabel,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  const rtl = useRtlStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
        />
        <View style={styles.dialog}>
          <Text
            style={[
              styles.title,
              { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
            ]}
            numberOfLines={3}
            accessibilityRole="header"
            maxFontSizeMultiplier={1.5}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.message,
              { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
            ]}
            numberOfLines={6}
            maxFontSizeMultiplier={1.5}
          >
            {message}
          </Text>
          {highlight?.trim() ? (
            <View style={styles.highlightBox} accessibilityRole="text">
              <Text style={styles.highlight} numberOfLines={2} maxFontSizeMultiplier={1.5}>
                {highlight}
              </Text>
            </View>
          ) : null}
          {loading ? (
            <ActivityIndicator
              color={colors.primary}
              style={styles.loader}
              accessibilityRole="progressbar"
            />
          ) : (
            <View style={styles.actions}>
              <PrimaryButton label={confirmLabel} onPress={onConfirm} />
              <SecondaryButton label={cancelLabel} onPress={onCancel} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: spacing.md,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  message: {
    ...typography.body,
    color: colors.textSecondary,
  },
  highlightBox: {
    backgroundColor: colors.primaryTint,
    borderRadius: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  highlight: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: { gap: spacing.md },
  loader: { marginVertical: spacing.md },
});
