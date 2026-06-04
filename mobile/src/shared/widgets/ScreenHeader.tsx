import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';

type Props = {
  title: string;
  onBack?: () => void;
  onSettings?: () => void;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, onBack, onSettings, right }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();

  if (onBack) {
    return (
      <View style={styles.stack}>
        <Pressable
          onPress={onBack}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={t.back}
        >
          <AppIcon
            name={rtl.isRtl ? 'chevron-forward' : 'chevron-back'}
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={[styles.titleBlock, { textAlign: rtl.textAlign }]} numberOfLines={2}>
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.inline, rtl.rowBetween]}>
      <Text style={[styles.titleInline, { textAlign: rtl.textAlign }]} numberOfLines={2}>
        {title}
      </Text>
      {onSettings || right ? (
        <View style={[styles.right, rtl.row]}>
          {right}
          {onSettings ? (
            <Pressable
              onPress={onSettings}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel={t.settings}
            >
              <AppIcon name="settings" size={24} color={colors.textPrimary} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    width: '100%',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  titleBlock: {
    ...typography.h1,
    color: colors.textPrimary,
    width: '100%',
  },
  inline: {
    paddingVertical: spacing.md,
    minHeight: 48,
    alignItems: 'center',
    width: '100%',
  },
  titleInline: {
    ...typography.h1,
    color: colors.textPrimary,
    flex: 1,
    flexShrink: 1,
  },
  right: { alignItems: 'center', gap: spacing.sm, flexShrink: 0 },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
