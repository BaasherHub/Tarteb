import { StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/core/theme/colors';
import { layoutStyles } from '@/core/theme/layout';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { TabScreenScroll } from '@/shared/widgets/TabScreenScroll';

type Props = ScrollViewProps & {
  children: React.ReactNode;
};

/** Shared tab screen chrome — padding and web card width for candidate and employer shells. */
export function TabScreenLayout({ children, contentContainerStyle, ...scrollProps }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <ContentWidth style={styles.tab}>
      <View style={{ paddingTop: insets.top, flex: 1 }}>
        <TabScreenScroll
          style={styles.scroll}
          contentContainerStyle={[layoutStyles.screenContentWithTabBar, contentContainerStyle]}
          {...scrollProps}
        >
          {children}
        </TabScreenScroll>
      </View>
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  tab: { flex: 1, backgroundColor: colors.scaffold },
  scroll: { flex: 1 },
});
