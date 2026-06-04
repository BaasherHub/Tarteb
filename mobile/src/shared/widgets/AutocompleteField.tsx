import React, { useId, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { fieldA11yLabel } from '@/shared/utils/a11y';
import { FieldError } from '@/shared/widgets/FieldError';

type Props = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (value: string) => void;
  options: string[];
  error?: string;
  hint?: string;
  emptyHint?: string;
};

export function AutocompleteField({
  label,
  value,
  onChangeText,
  onSelect,
  options,
  error,
  hint,
  emptyHint,
  placeholder,
  ...inputProps
}: Props) {
  const rtl = useRtlStyles();
  const { t } = useLocale();
  const inputId = useId();
  const [focused, setFocused] = useState(false);
  const showList = focused && options.length > 0;

  const list = useMemo(() => options, [options]);

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
      <TextInput
        {...inputProps}
        nativeID={inputId}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => setFocused(false), 150);
        }}
        style={[
          styles.input,
          error ? styles.inputError : null,
          { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
        ]}
        accessibilityLabel={fieldA11yLabel(
          label,
          error ? `${t.a11yFieldInvalid}. ${error}` : undefined,
          hint,
        )}
        accessibilityHint={hint}
      />
      {showList ? (
        <View
          style={styles.dropdown}
          accessibilityRole="list"
          accessibilityLabel={label}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.list}
            showsVerticalScrollIndicator
          >
            {list.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  onSelect(item);
                  setFocused(false);
                }}
                accessibilityRole="button"
                accessibilityLabel={item}
                accessibilityHint={t.a11yChipToggle}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text
                  style={styles.optionText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : focused && value.trim() && list.length === 0 && emptyHint ? (
        <Text
          style={[styles.emptyHint, { textAlign: rtl.textAlign }]}
          accessibilityRole="text"
          accessibilityLiveRegion="polite"
        >
          {emptyHint}
        </Text>
      ) : null}
      <FieldError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.fieldGap, zIndex: 1 },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  hint: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    fontSize: typography.body.fontSize,
    minHeight: 48,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  dropdown: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.md,
    backgroundColor: colors.surface,
    maxHeight: 200,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  list: { flexGrow: 0 },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    minHeight: 44,
  },
  optionPressed: {
    backgroundColor: colors.primaryTint,
    opacity: interaction.pressed,
  },
  optionText: { fontSize: 15, color: colors.textPrimary },
  emptyHint: { marginTop: spacing.xs, fontSize: 12, color: colors.textSecondary },
});
