import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { useLocale } from '@/core/i18n/LocaleContext';


type Props = {
  title: string;
  onSettings?: () => void;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, onSettings, right }: Props) {
  const { t, isRtl } = useLocale();
  return (
    <View style={[styles.row, isRtl && styles.rowRtl]}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.right, isRtl && styles.rowRtl]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowRtl: { flexDirection: 'row-reverse' },
  title: { ...typography.h1, color: colors.textPrimary },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
