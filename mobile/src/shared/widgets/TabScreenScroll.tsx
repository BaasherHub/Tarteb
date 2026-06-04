import { ScrollView, type ScrollViewProps } from 'react-native';
import { layoutStyles } from '@/core/theme/layout';

type Props = ScrollViewProps & {
  children: React.ReactNode;
};

/** Standard padded scroll body for tab + stack screens (matches Settings / Home). */
export function TabScreenScroll({ children, contentContainerStyle, ...rest }: Props) {
  return (
    <ScrollView
      contentContainerStyle={[layoutStyles.screenContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
