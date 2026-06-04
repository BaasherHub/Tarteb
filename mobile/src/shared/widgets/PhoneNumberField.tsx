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
  ...rest
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();

  const handleChange = useCallback(
    (text: string) => {
      onChangeText(formatUaePhoneInput(text));
    },
    [onChangeText],
  );

  const helperText = hint ?? t.phoneHelper;

  return (
    <View style={styles.wrap}>
      <FormField
        {...rest}
        label={label ?? t.phoneNumber}
        hint={helperText}
        value={value}
        onChangeText={handleChange}
        placeholder={t.phonePlaceholderSpaced}
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
          {t.phoneExampleLabel(UAE_PHONE_EXAMPLE)}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%' },
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
