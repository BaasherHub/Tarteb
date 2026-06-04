import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  highlight: string;
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
  const { isRtl } = useLocale();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.title, isRtl && styles.rtlText]}>{title}</Text>
          <Text style={[styles.message, isRtl && styles.rtlText]}>{message}</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlight}>{highlight}</Text>
          </View>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.actions}>
              <PrimaryButton label={confirmLabel} onPress={onConfirm} />
              <SecondaryButton label={cancelLabel} onPress={onCancel} />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  title: { ...typography.h2, marginBottom: 12, textAlign: 'center' },
  message: {
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  rtlText: { writingDirection: 'rtl' },
  highlightBox: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  highlight: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  actions: { gap: 10 },
  loader: { marginVertical: 12 },
});

