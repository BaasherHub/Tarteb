import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import type { PendingAccountRole } from '@/core/services/pendingAccountRole';

type Props = {
  visible: boolean;
  role: PendingAccountRole;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** Single modal: comparison table + irreversible commitment + confirm. */
export function RoleConfirmModal({
  visible,
  role,
  loading,
  onConfirm,
  onClose,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const rows = t.roleComparisonRows;
  const highlightCol = role === 'candidate' ? 'candidate' : 'employer';
  const roleLabel = role === 'candidate' ? t.roleCandidate : t.roleEmployer;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text
            style={[styles.title, { textAlign: rtl.textAlignCenter }]}
            accessibilityRole="header"
          >
            {t.roleCompareTitle}
          </Text>
          <Text
            style={[
              styles.intro,
              { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
            ]}
          >
            {t.roleCompareIntro}
          </Text>

          <ScrollView
            style={styles.tableScroll}
            contentContainerStyle={styles.tableContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.tableHeader, rtl.row]}>
              <Text style={[styles.cellFeature, styles.headerText]}>{t.roleCompareFeature}</Text>
              <Text
                style={[
                  styles.cellCol,
                  styles.headerText,
                  highlightCol === 'candidate' && styles.colHighlight,
                ]}
              >
                {t.roleCandidate}
              </Text>
              <Text
                style={[
                  styles.cellCol,
                  styles.headerText,
                  highlightCol === 'employer' && styles.colHighlight,
                ]}
              >
                {t.roleEmployer}
              </Text>
            </View>
            {rows.map((row) => (
              <View key={row.feature} style={[styles.tableRow, rtl.row]}>
                <Text style={[styles.cellFeature, styles.rowFeature]}>{row.feature}</Text>
                <Text
                  style={[
                    styles.cellCol,
                    styles.rowValue,
                    highlightCol === 'candidate' && styles.colHighlight,
                  ]}
                >
                  {row.candidate}
                </Text>
                <Text
                  style={[
                    styles.cellCol,
                    styles.rowValue,
                    highlightCol === 'employer' && styles.colHighlight,
                  ]}
                >
                  {row.employer}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.commitBox}>
            <Text
              style={[
                styles.commitMsg,
                { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
              ]}
            >
              {t.roleConfirmMessage}
            </Text>
            <Text style={styles.commitRole} numberOfLines={2}>
              {roleLabel}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.actions}>
              <PrimaryButton
                label={t.roleConfirmAction(roleLabel)}
                onPress={onConfirm}
              />
              <SecondaryButton label={t.roleSelectDifferent} onPress={onClose} />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  title: { ...typography.h2, marginBottom: spacing.sm },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  tableScroll: { maxHeight: 280, marginBottom: spacing.md },
  tableContent: { gap: 0 },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingVertical: spacing.sm,
    alignItems: 'flex-start',
  },
  headerText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowFeature: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.caption,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  cellFeature: { flex: 1.1, minWidth: 0, paddingEnd: 4 },
  cellCol: { flex: 1, minWidth: 0, textAlign: 'center' },
  colHighlight: {
    color: colors.primary,
    fontWeight: '700',
    backgroundColor: colors.primaryTint,
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: 2,
  },
  commitBox: {
    backgroundColor: colors.warningTint,
    borderRadius: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
    marginBottom: spacing.lg,
  },
  commitMsg: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  commitRole: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  actions: { gap: spacing.md },
  loader: { marginVertical: spacing.md },
});
