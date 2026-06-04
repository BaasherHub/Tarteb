import { StyleSheet, type ScrollViewProps } from 'react-native';
import { colors } from '@/core/theme/colors';
import { layoutStyles } from '@/core/theme/layout';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { TabScreenScroll } from '@/shared/widgets/TabScreenScroll';

type Props = ScrollViewProps & {
  children: React.ReactNode;
};

/** Shared Home / Settings tab chrome — identical padding and web card width. */
export function CandidateTabLayout({ children, contentContainerStyle, ...scrollProps }: Props) {
  return (
    <ContentWidth style={styles.tab}>
      <TabScreenScroll
        style={styles.scroll}
        contentContainerStyle={[layoutStyles.screenContentWithTabBar, contentContainerStyle]}
        {...scrollProps}
      >
        {children}
      </TabScreenScroll>
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  tab: { flex: 1, backgroundColor: colors.scaffold },
  scroll: { flex: 1 },
});
