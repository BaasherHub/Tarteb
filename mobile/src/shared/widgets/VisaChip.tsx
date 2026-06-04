import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';

type Props = { label: string };

/** Compact visa label for cards — neutral, not status-colored. */
export const VisaChip = memo(function VisaChip({ label }: Props) {
  if (!label) return null;
  return (
    <View style={styles.chip}>
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.scaffold,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
