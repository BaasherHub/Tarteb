import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FieldError } from '@/shared/widgets/FieldError';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { formatIsoDateLocal, isValidDate } from '@/shared/utils/dateFormat';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  hint?: string;
};

export function DateField({ label, value, onChange, error, hint }: Props) {
  const { t } = useLocale();
  const [showPicker, setShowPicker] = useState(false);
  const display =
    value && isValidDate(value) ? formatIsoDateLocal(value) : '';

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <Pressable
        style={[styles.input, styles.pressable, error ? styles.inputError : null]}
        onPress={() => setShowPicker(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={value && isValidDate(value) ? styles.valueText : styles.placeholderText}>
          {display || t.datePlaceholder}
        </Text>
        <Text style={styles.pickHint}>{t.pickDate}</Text>
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
  },
  inputError: { borderColor: colors.error },
  pressable: { justifyContent: 'center' },
  valueText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  placeholderText: { fontSize: 16, color: colors.placeholder },
  pickHint: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
});


