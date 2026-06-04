import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';

export function ScreenFooter({ style, children, ...rest }: ViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        layoutStyles.footer,
        { paddingBottom: Math.max(insets.bottom, spacing.md) },
        Platform.OS === 'web' ? styles.web : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  web: { position: 'relative', zIndex: 10 },
});
