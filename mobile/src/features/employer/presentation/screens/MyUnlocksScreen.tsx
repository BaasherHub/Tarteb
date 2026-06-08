import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { supabase } from '@/core/lib/supabase';
import { useLocale } from '@/core/i18n/LocaleContext';
import { EmployerTabParamList, RootStackParamList } from '@/core/navigation/types';
import { FLAT_LIST_PERF, browseItemLayout } from '@/shared/constants/listPerf';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { EmptyState } from '@/shared/widgets/EmptyState';
import { ErrorState } from '@/shared/widgets/ErrorState';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { BrowseListSkeleton } from '@/shared/widgets/BrowseListSkeleton';
import { getErrorMessage } from '@/shared/utils/errors';
import { colors } from '@/core/theme/colors';
import { layout, layoutStyles } from '@/core/theme/layout';
import { CandidateBrowseCard } from '@/features/employer/presentation/components/CandidateBrowseCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type UnlockRow = {
  id: string;
  candidate_id: string;
  unlocked_at: string;
};

const ListSeparator = () => <View style={styles.sep} />;

export function MyUnlocksScreen() {
  const { t } = useLocale();
  const navigation = useNavigation<Nav>();
  const [rows, setRows] = useState<UnlockRow[]>([]);
  const [candidates, setCandidates] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh: boolean) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      const { data: unlockData, error: qError } = await supabase
        .from('unlocks')
        .select('id, candidate_id, unlocked_at')
        .order('unlocked_at', { ascending: false });
      if (qError) throw qError;

      const unlockRows = (unlockData ?? []) as UnlockRow[];
      setRows(unlockRows);

      const ids = unlockRows.map((r) => r.candidate_id);
      if (ids.length === 0) {
        setCandidates({});
        return;
      }

      const { data: browseData, error: browseError } = await supabase
        .from('candidate_browse')
        .select('*')
        .in('id', ids);
      if (browseError) throw browseError;

      const byId: Record<string, Record<string, unknown>> = {};
      for (const row of browseData ?? []) {
        byId[String((row as { id: string }).id)] = row as Record<string, unknown>;
      }
      setCandidates(byId);
    } catch (e) {
      setError(getErrorMessage(e, t.errorLoadList));
      if (!isRefresh) {
        setRows([]);
        setCandidates({});
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t.errorLoadList]);

  useEffect(() => {
    void load(false);
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void load(true);
  }, [load]);

  const listData = useMemo(
    () =>
      rows
        .map((row) => candidates[row.candidate_id])
        .filter((item): item is Record<string, unknown> => Boolean(item)),
    [rows, candidates],
  );

  const openCandidate = useCallback(
    (candidateId: string) => {
      const item = candidates[candidateId];
      const role = item?.role ? String(item.role) : undefined;
      navigation.navigate('CandidateDetail', {
        candidateId,
        ...(role ? { hiringRole: role } : {}),
      });
    },
    [candidates, navigation],
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
          message={error}
          actionLabel={t.retry}
          onAction={() => void load(false)}
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
  }, [error, load, navigation, t]);

  return (
    <ContentWidth style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader title={t.myUnlocks} />
      </View>
      {loading && listData.length === 0 ? (
        <BrowseListSkeleton rows={4} />
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={listData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={browseItemLayout}
          {...FLAT_LIST_PERF}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  list: { flex: 1 },
  listContent: {
    paddingBottom: layout.screenPaddingBottom + layout.tabBarClearance,
  },
  sep: { height: 1, backgroundColor: colors.divider },
});
