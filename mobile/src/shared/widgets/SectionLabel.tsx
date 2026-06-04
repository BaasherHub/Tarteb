import { StyleSheet, Text } from 'react-native';
import { layoutStyles } from '@/core/theme/layout';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';

type Props = {
  children: string;
  /** Uppercase grouped sections (Settings, browse filters). */
  variant?: 'group' | 'form';
  first?: boolean;
};

export function SectionLabel({ children, variant = 'form', first }: Props) {
  const rtl = useRtlStyles();
  return (
    <Text
      style={[
        variant === 'group' ? layoutStyles.sectionGroup : layoutStyles.sectionForm,
        first && variant === 'group' && layoutStyles.sectionGroupFirst,
        first && variant === 'form' && layoutStyles.sectionFormFirst,
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
