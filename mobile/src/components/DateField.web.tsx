import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { FieldError } from './FieldError';
import { useLocale } from '../i18n/LocaleContext';
import { colors } from '../constants/colors';
import {
  formatIsoDateLocal,
  isValidDate,
  parseIsoDateLocal,
  todayIsoLocal,
} from '../utils/dateFormat';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  hint?: string;
};

export function DateField({ label, value, onChange, error, hint }: Props) {
  const { t } = useLocale();
  const display = value && isValidDate(value) ? formatIsoDateLocal(value) : '';

  const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text?.trim() ?? '';
    if (!text) return;
    const parsed = parseIsoDateLocal(text);
    if (parsed) onChange(parsed);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <TextInput
        {...({ type: 'date', min: todayIsoLocal() } as object)}
        value={display}
        onChange={handleChange}
        placeholder={t.datePlaceholder}
        placeholderTextColor={colors.placeholder}
        style={[styles.input, error ? styles.inputError : null]}
        accessibilityLabel={label}
      />
      <FieldError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, marginBottom: 4 },
  label: { marginBottom: 4, color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  hint: { marginBottom: 6, color: colors.textSecondary, fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.surface,
    minHeight: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
});
