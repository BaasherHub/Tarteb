import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FieldError } from '@/shared/widgets/FieldError';
import { FieldLabel, type FieldLabelFlags } from '@/shared/widgets/FieldLabel';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { fieldA11yLabel } from '@/shared/utils/a11y';
import { formatIsoDateLocal, isValidDate } from '@/shared/utils/dateFormat';

type Props = FieldLabelFlags & {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  hint?: string;
};

export function DateField({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  optional,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const [showPicker, setShowPicker] = useState(false);
  const display =
    value && isValidDate(value) ? formatIsoDateLocal(value) : '';
  const flags = { required, optional };

  return (
    <View style={styles.wrap}>
      <FieldLabel label={label} required={required} optional={optional} />
      {hint ? (
        <Text style={[styles.hint, { textAlign: rtl.textAlign }]}>{hint}</Text>
      ) : null}
      <Pressable
        style={[styles.input, styles.pressable, error ? styles.inputError : null]}
        onPress={() => setShowPicker(true)}
        accessibilityRole="button"
        accessibilityLabel={fieldA11yLabel(label, error, hint, flags, t)}
      >
        {display ? (
          <Text style={styles.valueText}>{display}</Text>
        ) : null}
      </Pressable>
      {showPicker ? (
        <DateTimePicker
          value={value && isValidDate(value) ? value : new Date()}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            if (Platform.OS === 'android') setShowPicker(false);
            if (event.type === 'dismissed') {
              if (Platform.OS === 'ios') setShowPicker(false);
              return;
            }
            if (date && isValidDate(date)) {
              onChange(date);
              if (Platform.OS === 'ios') setShowPicker(false);
            }
          }}
        />
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
  },
  inputError: { borderColor: colors.error },
  pressable: { justifyContent: 'center' },
  valueText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
});
