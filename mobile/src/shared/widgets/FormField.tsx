import React, { useId } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { useLocale } from '@/core/i18n/LocaleContext';
import { fieldA11yLabel } from '@/shared/utils/a11y';
import { FieldError } from '@/shared/widgets/FieldError';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  /** Shown inside the field (e.g. AED for salary). Input stays LTR for numbers. */
  prefix?: string;
};

export function FormField({
  label,
  error,
  hint,
  prefix,
  style,
  placeholderTextColor,
  textAlign: textAlignProp,
  ...inputProps
}: Props) {
  const rtl = useRtlStyles();
  const { t } = useLocale();
  const inputId = useId();

  return (
    <View style={styles.wrap} accessibilityRole="none">
      <Text
        nativeID={`${inputId}-label`}
        style={[styles.label, { textAlign: rtl.textAlign }]}
        numberOfLines={2}
        maxFontSizeMultiplier={1.3}
      >
        {label}
      </Text>
      {hint ? (
        <Text
          style={[styles.hint, { textAlign: rtl.textAlign }]}
          numberOfLines={3}
          maxFontSizeMultiplier={1.3}
        >
          {hint}
        </Text>
      ) : null}
      {prefix ? (
        <View
          style={[styles.inputWithPrefix, error ? styles.inputError : null]}
        >
          <Text style={styles.prefix} importantForAccessibility="no">
            {prefix}
          </Text>
          <TextInput
            {...inputProps}
            nativeID={inputId}
            placeholderTextColor={placeholderTextColor ?? colors.placeholder}
            style={[styles.inputPrefixed, style]}
            textAlign={textAlignProp ?? 'left'}
            accessibilityLabel={fieldA11yLabel(
              `${label}, ${prefix}`,
              error ? `${t.a11yFieldInvalid}. ${error}` : undefined,
              hint,
            )}
            accessibilityHint={hint}
            accessibilityState={{
              disabled: inputProps.editable === false,
            }}
          />
        </View>
      ) : (
        <TextInput
          {...inputProps}
          nativeID={inputId}
          placeholderTextColor={placeholderTextColor ?? colors.placeholder}
          style={[
            styles.input,
            error ? styles.inputError : null,
            {
              textAlign: textAlignProp ?? rtl.textAlign,
              writingDirection: rtl.writingDirection,
            },
            style,
          ]}
          accessibilityLabel={fieldA11yLabel(
            label,
            error ? `${t.a11yFieldInvalid}. ${error}` : undefined,
            hint,
          )}
          accessibilityHint={hint}
          accessibilityState={{
            disabled: inputProps.editable === false,
          }}
        />
      )}
      <FieldError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.fieldGap },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    minHeight: 48,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  inputWithPrefix: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 48,
    alignItems: 'center',
    overflow: 'hidden',
  },
  prefix: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.scaffold,
    borderEndWidth: StyleSheet.hairlineWidth,
    borderEndColor: colors.divider,
  },
  inputPrefixed: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.textPrimary,
  },
});
