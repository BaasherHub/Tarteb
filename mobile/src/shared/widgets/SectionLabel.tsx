import { StyleSheet, Text } from 'react-native';
import { layoutStyles } from '@/core/theme/layout';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { FieldLabel, type FieldLabelFlags } from '@/shared/widgets/FieldLabel';

type Props = FieldLabelFlags & {
  children: string;
  /** Uppercase grouped sections (Settings, browse filters). */
  variant?: 'group' | 'form';
  first?: boolean;
};

export function SectionLabel({
  children,
  variant = 'form',
  first,
  required,
  optional,
}: Props) {
  const rtl = useRtlStyles();

  if (variant === 'form') {
    return (
      <FieldLabel
        label={children}
        required={required}
        optional={optional}
        style={[
          layoutStyles.sectionForm,
          first && layoutStyles.sectionFormFirst,
          styles.formLabel,
        ]}
      />
    );
  }

  return (
    <Text
      style={[
        layoutStyles.sectionGroup,
        first && layoutStyles.sectionGroupFirst,
        { textAlign: rtl.textAlign },
      ]}
    >
      {children}
    </Text>
  );
}

export function SectionHint({ children }: { children: string }) {
  const rtl = useRtlStyles();
  return (
    <Text style={[layoutStyles.sectionHint, { textAlign: rtl.textAlign }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  formLabel: {
    marginBottom: 0,
  },
});
