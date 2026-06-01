import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useLocale } from '../../i18n/LocaleContext';
import {
  BrowseFilters,
  emptyFilters,
  fetchCandidatesPage,
  PAGE_SIZE,
} from '../../services/candidateBrowse';
import { FilterModal } from './FilterModal';
import {
  fetchEmployerAccount,
  hasActiveSubscription,
} from '../../services/employerSubscription';
import { colors } from '../../constants/colors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function BrowseScreen() {
  const { t } = useLocale();
  const navigation = useNavigation<Nav>();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subActive, setSubActive] = useState(false);
  const [filters, setFilters] = useState<BrowseFilters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  const hasFilters =
    filters.roles.length > 0 ||
    filters.visaStatuses.length > 0 ||
    filters.locations.length > 0 ||
    filters.availableNow ||
    filters.nationalitySearch.trim().length > 0 ||
    filters.salaryMin > 0 ||
    filters.salaryMax < 10000;

  const loadSubscription = useCallback(async () => {
    try {
      const account = await fetchEmployerAccount();
      setSubActive(hasActiveSubscription(account.subscriptionEndsAt));
    } catch {
      setSubActive(false);
    }
  }, []);

  const load = useCallback(
    async (refresh = false) => {
      const nextPage = refresh ? 0 : page;
      try {
        const data = await fetchCandidatesPage(filters, nextPage);
        setItems((prev) => (refresh ? data : [...prev, ...data]));
        setPage(refresh ? 1 : nextPage + 1);
        setHasMore(data.length >= PAGE_SIZE);
      } catch {
        if (refresh) setItems([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, filters],
  );

  useEffect(() => {
    loadSubscription();
    load(true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSubscription();
    load(true);
  };

  const renderItem = ({ item }: { item: Record<string, unknown> }) => {
    const role = String(item.role ?? '');
    const location = String(item.location ?? '');
    const salary = item.salary_expectation;
    const photoUrl = item.photo_url as string | undefined;
    const unlocked = item.phone != null;

    return (
      <Pressable
        style={styles.row}
        onPress={() =>
          navigation.navigate('CandidateDetail', { candidate: item })
        }
      >
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]} />
        )}
        <View style={styles.meta}>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.sub}>{location}</Text>
          {salary != null && <Text style={styles.salary}>AED {String(salary)}/mo</Text>}
        </View>
        <Text style={styles.chevron}>{unlocked ? '✓' : '›'}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.browse}</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.pill, hasFilters && styles.pillFiltered]}
            onPress={() => setFilterOpen(true)}
          >
            <Text style={[styles.pillText, hasFilters && styles.pillTextFiltered]}>
              {hasFilters ? t.filtered : t.filters}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.pill, subActive && styles.pillActive]}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={[styles.pillText, subActive && styles.pillTextActive]}>
              {subActive ? t.planActive : t.subscribe}
            </Text>
          </Pressable>
        </View>
      </View>

      <FilterModal
        visible={filterOpen}
        initial={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setFilters(next);
          setLoading(true);
          setPage(0);
          fetchCandidatesPage(next, 0)
            .then((data) => {
              setItems(data);
              setPage(1);
              setHasMore(data.length >= PAGE_SIZE);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
        }}
      />

      {loading ? (
        <ActivityIndicator style={styles.center} color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => hasMore && load()}
          ListEmptyComponent={
            <Text style={styles.empty}>{t.noCandidates}</Text>
          }
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.scaffold },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 8 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
  },
  pillActive: { backgroundColor: `${colors.secondary}20` },
  pillFiltered: { backgroundColor: `${colors.primary}30` },
  pillText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  pillTextActive: { color: colors.secondary },
  pillTextFiltered: { color: colors.primary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    gap: 12,
  },
  photo: { width: 56, height: 56, borderRadius: 12 },
  photoPlaceholder: { backgroundColor: `${colors.primary}15` },
  meta: { flex: 1 },
  role: { fontSize: 16, fontWeight: '700' },
  sub: { color: colors.textSecondary, marginTop: 4 },
  salary: { marginTop: 4, fontWeight: '600' },
  chevron: { fontSize: 20, color: colors.textSecondary },
  sep: { height: 1, backgroundColor: colors.divider },
  center: { marginTop: 40 },
  empty: { textAlign: 'center', marginTop: 40, color: colors.textSecondary },
});
