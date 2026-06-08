import { memo, useEffect, useRef, type RefObject } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { fieldA11yLabel } from '@/shared/utils/a11y';
import { FieldError } from '@/shared/widgets/FieldError';

type Props = {
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  onComplete?: (code: string) => void;
  inputRef?: RefObject<TextInput | null>;
  autoFocus?: boolean;
  disabled?: boolean;
};

/** Shared 6-digit OTP input — LTR, auto-complete on fill. */
export const OtpCodeField = memo(function OtpCodeField({
  value,
  onChange,
  error,
  onComplete,
  inputRef: externalRef,
  autoFocus = false,
  disabled = false,
}: Props) {
  const { t } = useLocale();
  const internalRef = useRef<TextInput>(null);
  const inputRef = externalRef ?? internalRef;

  useEffect(() => {
    if (!autoFocus) return;
    const tmr = setTimeout(() => inputRef.current?.focus(), 320);
    return () => clearTimeout(tmr);
  }, [autoFocus, inputRef]);

  return (
    <>
      <TextInput
        ref={inputRef}
        style={[styles.input, styles.otp, error ? styles.inputError : null]}
        keyboardType="number-pad"
        maxLength={6}
        placeholder={t.otpPlaceholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        editable={!disabled}
        onChangeText={(v) => {
          const digits = v.replace(/\D/g, '').slice(0, 6);
          onChange(digits);
          if (digits.length === 6 && onComplete && !disabled) {
            onComplete(digits);
          }
        }}
        returnKeyType="done"
        onSubmitEditing={() => {
          if (value.length === 6 && onComplete) onComplete(value);
        }}
        accessibilityLabel={fieldA11yLabel(
          t.otpCode,
          error ? `${t.a11yFieldInvalid}. ${error}` : undefined,
          undefined,
          { required: true },
          t,
        )}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
      />
      <FieldError message={error} />
    </>
  );
});

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.surface,
    minHeight: 48,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  otp: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 22,
    writingDirection: 'ltr',
  },
});
