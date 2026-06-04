import { memo } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '@/core/theme/colors';

type Props = {
  label: string;
  onPress: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
};

export const PrimaryButton = memo(function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        Platform.OS === 'ios' && pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    minHeight: 48,
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600' },
});


