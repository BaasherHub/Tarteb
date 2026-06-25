import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import {
  formatIsoDateLocal,
  isValidDate,
  parseIsoDateLocal,
  todayIsoLocal,
} from '@/shared/utils/dateFormat';
import { FieldError } from '@/shared/widgets/FieldError';
import { FieldLabel, type FieldLabelFlags } from '@/shared/widgets/FieldLabel';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { fieldA11yLabel } from '@/shared/utils/a11y';

type Props = FieldLabelFlags & {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  onClear?: () => void;
  error?: string;
  hint?: string;
};

export function DateField({
  label,
  value,
  onChange,
  onClear,
  error,
  hint,
  required,
  optional,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const display = value && isValidDate(value) ? formatIsoDateLocal(value) : '';
  const flags = { required, optional };

  const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text?.trim() ?? '';
    if (!text) {
      onClear?.();
      return;
    }
    const parsed = parseIsoDateLocal(text);
    if (parsed) onChange(parsed);
  };

  return (
    <View style={styles.wrap}>
      <FieldLabel label={label} required={required} optional={optional} />
      {hint ? (
        <Text style={[styles.hint, { textAlign: rtl.textAlign }]}>{hint}</Text>
      ) : null}
      <TextInput
        {...({ type: 'date', min: todayIsoLocal() } as object)}
        value={display}
        onChange={handleChange}
        placeholderTextColor={colors.placeholder}
        style={[styles.input, error ? styles.inputError : null]}
        accessibilityLabel={fieldA11yLabel(label, error, hint, flags, t)}
      />
      {optional && value && onClear ? (
        <Text
          accessibilityRole="button"
          accessibilityLabel={t.clearDate}
          onPress={onClear}
          style={[styles.clearText, { textAlign: rtl.textAlign }]}
        >
          {t.clearDate}
        </Text>
      ) : null}
      <FieldError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.sm, marginBottom: spacing.xs },
  hint: { marginBottom: spacing.sm, color: colors.textSecondary, fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  clearText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.xs,
    minHeight: 44,
    lineHeight: 44,
  },
});
