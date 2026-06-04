import { memo, useCallback } from 'react';
import { StyleSheet, Text, View, type TextInputProps } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import {
  formatUaePhoneInput,
  UAE_PHONE_EXAMPLE,
  UAE_PHONE_FORMATTED_MAX_LENGTH,
} from '@/shared/utils/phone';
import { FormField } from '@/shared/widgets/FormField';

type Props = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  hint?: string;
  showExample?: boolean;
  /** When false, hides the +971 format helper line under the field. */
  showHelper?: boolean;
  /** When true, field can stay empty (e.g. optional WhatsApp). */
  allowEmpty?: boolean;
};

/**
 * UAE phone field: LTR digits, RTL-aware labels, auto-spacing (+971 50 155 1480).
 */
export const PhoneNumberField = memo(function PhoneNumberField({
  label,
  value,
  onChangeText,
  error,
  hint,
  showExample = true,
  showHelper = true,
  allowEmpty = false,
  ...rest
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();

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

  const helperText =
    hint ??
    (allowEmpty || !showHelper ? undefined : t.phoneHelper);
  const placeholder =
    rest.placeholder ??
    (allowEmpty ? t.whatsappEmptyPlaceholder : t.phonePlaceholderSpaced);

  return (
    <View style={styles.wrap}>
      <FormField
        {...rest}
        label={label ?? t.phoneNumber}
        hint={helperText}
        value={displayValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        maxLength={UAE_PHONE_FORMATTED_MAX_LENGTH}
        error={error}
        style={[styles.inputLtr, rest.style]}
      />
      {showExample && !error ? (
        <Text
          style={[styles.example, { textAlign: rtl.textAlign }]}
          numberOfLines={2}
          accessibilityRole="text"
        >
          {t.phoneExampleLabel(formatUaePhoneInput(UAE_PHONE_EXAMPLE))}
        </Text>
      ) : null}
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
  example: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
});
