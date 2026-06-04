import { StyleSheet, View, type ViewProps } from 'react-native';
import { layout, layoutStyles } from '@/core/theme/layout';

type Props = ViewProps & {
  inset?: boolean;
};

export function SurfaceCard({ style, inset, children, ...rest }: Props) {
  return (
    <View style={[layoutStyles.surfaceCard, inset && styles.inset, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  inset: {
    padding: layout.cardPadding,
  },
});
