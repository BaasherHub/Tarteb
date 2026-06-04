import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { visaChipColor } from '@/shared/utils/visa';

type Props = { label: string };

export const VisaChip = memo(function VisaChip({ label }: Props) {
  if (!label) return null;
  const color = visaChipColor(label);
  return (
    <View style={[styles.chip, { borderColor: color, backgroundColor: `${color}18` }]}>
      <Text style={[styles.text, { color }]} numberOfLines={1}>
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
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '600' },
});


