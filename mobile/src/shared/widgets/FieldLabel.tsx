import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { useLocale } from '@/core/i18n/LocaleContext';
import type { Strings } from '@/core/i18n/strings';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export type FieldLabelFlags = {
  required?: boolean;
  optional?: boolean;
};

type Props = FieldLabelFlags & {
  label: string;
  nativeID?: string;
  textAlign?: 'left' | 'right' | 'center' | 'auto' | 'justify';
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

/** Screen-reader label with required / optional announcement. */
export function fieldLabelA11y(
  label: string,
  flags: FieldLabelFlags | undefined,
  t: Strings,
): string {
  if (flags?.required) return `${label}. ${t.requiredField}`;
  if (flags?.optional) return `${label}. ${t.fieldOptionalSuffix}`;
  return label;
}

export function FieldLabel({
  label,
  required,
  optional,
  nativeID,
  textAlign: textAlignProp,
  numberOfLines = 2,
  style,
}: Props) {
  const rtl = useRtlStyles();
  const { t } = useLocale();
  const textAlign = textAlignProp ?? rtl.textAlign;

  return (
    <Text
      nativeID={nativeID}
      style={[styles.label, { textAlign }, style]}
      numberOfLines={numberOfLines}
      maxFontSizeMultiplier={1.5}
    >
      {label}
      {required ? (
        <Text
          style={styles.requiredMark}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {' *'}
        </Text>
      ) : null}
      {optional && !required ? (
        <Text
          style={styles.optionalMark}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {` ${t.fieldOptionalSuffix}`}
        </Text>
      ) : null}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  requiredMark: {
    ...typography.label,
    color: colors.error,
    fontWeight: '700',
  },
  optionalMark: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '400',
  },
});
