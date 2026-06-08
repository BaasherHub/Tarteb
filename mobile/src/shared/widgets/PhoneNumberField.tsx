import { memo, useCallback } from 'react';
import { StyleSheet, View, type TextInputProps } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import {
  formatUaePhoneInput,
  UAE_PHONE_FORMATTED_MAX_LENGTH,
} from '@/shared/utils/phone';
import { FormField } from '@/shared/widgets/FormField';

type Props = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  hint?: string;
  /** When true, field can stay empty (e.g. optional WhatsApp). */
  allowEmpty?: boolean;
  required?: boolean;
  optional?: boolean;
};

/** UAE phone field: LTR digits with auto-spacing. */
export const PhoneNumberField = memo(function PhoneNumberField({
  label,
  value,
  onChangeText,
  error,
  hint,
  allowEmpty = false,
  required: requiredProp,
  optional: optionalProp,
  ...rest
}: Props) {
  const { t } = useLocale();
  const handleChange = useCallback(
    (text: string) => {
      if (allowEmpty && !text.trim()) {
        onChangeText('');
        return;
      }
      onChangeText(formatUaePhoneInput(text));
    },
    [allowEmpty, onChangeText],
  );

  const displayValue =
    allowEmpty && !value.trim() ? '' : value || formatUaePhoneInput('');

  const required = requiredProp ?? !allowEmpty;
  const optional = optionalProp ?? allowEmpty;

  return (
    <View style={styles.wrap}>
      <FormField
        {...rest}
        label={label ?? t.phoneNumber}
        required={required}
        optional={optional}
        hint={hint}
        value={displayValue}
        onChangeText={handleChange}
        placeholder={rest.placeholder}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        maxLength={UAE_PHONE_FORMATTED_MAX_LENGTH}
        error={error}
        style={[styles.inputLtr, rest.style]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%', marginBottom: 0 },
  inputLtr: {
    writingDirection: 'ltr',
    textAlign: 'left',
    fontVariant: ['tabular-nums'],
  },
});
