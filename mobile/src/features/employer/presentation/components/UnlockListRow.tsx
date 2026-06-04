import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export type UnlockRow = {
  id: string;
  candidate_id: string;
  candidates: {
    name?: string;
    role?: string;
    visa_status?: string;
    location?: string;
  } | null;
};

type Props = {
  item: UnlockRow;
  onOpen: (candidateId: string) => void;
};

export const UnlockListRow = memo(function UnlockListRow({ item, onOpen }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const c = item.candidates;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, rtl.row, pressed && styles.rowPressed]}
      onPress={() => onOpen(item.candidate_id)}
      accessibilityRole="button"
      accessibilityLabel={[c?.name, c?.role].filter(Boolean).join('. ')}
    >
      <View style={styles.rowBody}>
        <Text
          style={[styles.name, { textAlign: rtl.textAlign }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {String(c?.name ?? '—')}
        </Text>
        <Text
          style={[styles.role, { textAlign: rtl.textAlign }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {String(c?.role ?? '')}
        </Text>
        {c?.visa_status ? (
          <Text
            style={[styles.visa, { textAlign: rtl.textAlign }]}
            numberOfLines={1}
          >
            {t.visaStatusLabel(String(c.visa_status))}
          </Text>
        ) : null}
      </View>
      <Text style={styles.chevron} importantForAccessibility="no">
        {rtl.isRtl ? '‹' : '›'}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.md,
    minHeight: 72,
  },
  rowPressed: { opacity: interaction.rowPressed },
  rowBody: { flex: 1, minWidth: 0, gap: spacing.xs },
  name: { ...typography.h3, color: colors.textPrimary },
  role: { ...typography.caption, color: colors.textSecondary },
  visa: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  chevron: { fontSize: 22, color: colors.textSecondary, flexShrink: 0 },
});
