import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '@/core/lib/supabase';
import { useLocale } from '@/core/i18n/LocaleContext';
import { RootStackParamList } from '@/core/navigation/types';
import { FLAT_LIST_PERF, unlockItemLayout } from '@/shared/constants/listPerf';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { EmptyState } from '@/shared/widgets/EmptyState';
import { ErrorState } from '@/shared/widgets/ErrorState';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { BrowseListSkeleton } from '@/shared/widgets/BrowseListSkeleton';
import { getErrorMessage } from '@/shared/utils/errors';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import {
  UnlockListRow,
  type UnlockRow,
} from '@/features/employer/presentation/components/UnlockListRow';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ListSeparator = () => <View style={styles.sep} />;

export function MyUnlocksScreen() {
  const { t } = useLocale();
  const navigation = useNavigation<Nav>();
  const [rows, setRows] = useState<UnlockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh: boolean) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      const { data, error: qError } = await supabase
        .from('unlocks')
        .select('id, candidate_id, unlocked_at, candidates(name, role, visa_status, location)')
        .order('unlocked_at', { ascending: false });
      if (qError) throw qError;
      setRows((data ?? []) as UnlockRow[]);
    } catch (e) {
      setError(getErrorMessage(e, t.errorLoadList));
      if (!isRefresh) setRows([]);
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

  const openCandidate = useCallback(
    (candidateId: string) => {
      navigation.navigate('CandidateDetail', { candidateId });
    },
    [navigation],
  );

  const keyExtractor = useCallback((item: UnlockRow) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: UnlockRow }) => (
      <UnlockListRow item={item} onOpen={openCandidate} />
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
        onAction={() => navigation.getParent()?.navigate('BrowseTab' as never)}
      />
    );
  }, [error, load, navigation, t]);

  return (
    <ContentWidth style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader title={t.myUnlocks} />
      </View>
      {loading && rows.length === 0 ? (
        <BrowseListSkeleton rows={4} />
      ) : (
        <FlatList
          style={styles.list}
          data={rows}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={unlockItemLayout}
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
  headerPad: { paddingHorizontal: spacing.lg },
  list: { flex: 1 },
  sep: { height: 1, backgroundColor: colors.divider },
});
