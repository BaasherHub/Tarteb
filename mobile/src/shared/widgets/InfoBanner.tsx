import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';


type Props = {
  message: string;
  variant?: 'info' | 'warning';
};

export function InfoBanner({ message, variant = 'info' }: Props) {
  const rtl = useRtlStyles();
  const bg = variant === 'warning' ? '#FFF3E0' : `${colors.primary}10`;
  const border = variant === 'warning' ? '#FFE082' : `${colors.primary}25`;
  const textColor = variant === 'warning' ? '#E65100' : colors.textPrimary;

  return (
    <View style={[styles.banner, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.text, { color: textColor, textAlign: rtl.textAlign }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  text: { fontSize: 14, lineHeight: 20 },
});
