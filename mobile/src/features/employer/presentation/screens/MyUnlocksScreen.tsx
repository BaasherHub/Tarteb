import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useLocale } from '@/core/i18n/LocaleContext';
import { EmployerTabParamList, RootStackParamList } from '@/core/navigation/types';
import { FLAT_LIST_PERF } from '@/shared/constants/listPerf';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { EmptyState } from '@/shared/widgets/EmptyState';
import { ErrorState } from '@/shared/widgets/ErrorState';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { BrowseListSkeleton } from '@/shared/widgets/BrowseListSkeleton';
import { colors } from '@/core/theme/colors';
import { layout, layoutStyles } from '@/core/theme/layout';
import { CandidateBrowseCard } from '@/features/employer/presentation/components/CandidateBrowseCard';
import { useUnlocks } from '@/features/employer/data/services/unlocks';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { getErrorMessage } from '@/shared/utils/errors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ListSeparator = () => <View style={styles.sep} />;

export function MyUnlocksScreen() {
  const { t } = useLocale();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isRefetching, refetch, error } = useUnlocks(t.errorLoadList);

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const listData = useMemo(
    () =>
      (data?.rows ?? [])
        .map((row) => data?.candidatesById[row.candidate_id])
        .filter((item): item is Record<string, unknown> => Boolean(item)),
    [data],
  );

  const openCandidate = useCallback(
    (candidateId: string) => {
      const item = data?.candidatesById[candidateId];
      const role = item?.role ? String(item.role) : undefined;
      navigation.navigate('CandidateDetail', {
        candidateId,
        ...(role ? { hiringRole: role } : {}),
      });
    },
    [data, navigation],
  );

  const keyExtractor = useCallback(
    (item: Record<string, unknown>) => String(item.id),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: Record<string, unknown> }) => (
      <CandidateBrowseCard
        item={item}
        hiringRole={item.role ? String(item.role) : null}
        onPress={() => openCandidate(String(item.id))}
      />
    ),
    [openCandidate],
  );

  const listEmpty = useMemo(() => {
    if (error) {
      return (
        <ErrorState
          title={t.errorTitle}
          message={String((error as Error).message || t.errorLoadList)}
          actionLabel={t.retry}
          onAction={() => void refetch()}
        />
      );
    }
    return (
      <EmptyState
        title={t.noUnlocksYet}
        message={t.noUnlocksHint}
        actionLabel={t.browse}
        icon="🔓"
        onAction={() => {
          const tabNav =
            navigation.getParent<BottomTabNavigationProp<EmployerTabParamList>>();
          tabNav?.navigate('BrowseTab');
        }}
      />
    );
  }, [error, navigation, refetch, t]);

  return (
    <ContentWidth style={styles.container}>
      <View style={[styles.headerPad, { paddingTop: insets.top }]}>
        <ScreenHeader title={t.myUnlocks} />
      </View>
      {error && listData.length > 0 ? (
        <View style={styles.errorBanner}>
          <InfoBanner
            message={getErrorMessage(error, t.errorLoadList)}
            variant="warning"
          />
        </View>
      ) : null}
      {isLoading && listData.length === 0 ? (
        <BrowseListSkeleton rows={4} />
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={listData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          {...FLAT_LIST_PERF}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          ListEmptyComponent={listEmpty}
          ItemSeparatorComponent={ListSeparator}
        />
      )}
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.scaffold },
  headerPad: layoutStyles.screenHeaderWrap,
  errorBanner: { ...layoutStyles.screenHeaderWrap, paddingBottom: layout.screenPaddingX },
  list: { flex: 1 },
  listContent: {
    paddingBottom: layout.screenPaddingBottom + layout.tabBarClearance,
  },
  sep: { height: 1, backgroundColor: colors.divider },
});
