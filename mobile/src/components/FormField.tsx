import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { FieldError } from './FieldError';
import { useRtlStyles } from '../hooks/useRtlStyles';
import { colors } from '../constants/colors';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function FormField({ label, error, hint, style, placeholderTextColor, ...inputProps }: Props) {
  const rtl = useRtlStyles();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { textAlign: rtl.textAlign }]}>{label}</Text>
      {hint ? (
        <Text style={[styles.hint, { textAlign: rtl.textAlign }]}>{hint}</Text>
      ) : null}
      <TextInput
        {...inputProps}
        placeholderTextColor={placeholderTextColor ?? colors.placeholder}
        style={[
          styles.input,
          error ? styles.inputError : null,
          { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
          style,
        ]}
        accessibilityLabel={label}
      />
      <FieldError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: { marginBottom: 4, color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  hint: { marginBottom: 6, color: colors.textSecondary, fontSize: 12, lineHeight: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.surface,
    fontSize: 16,
    minHeight: 48,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
});
