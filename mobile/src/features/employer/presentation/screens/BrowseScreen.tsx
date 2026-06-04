import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { colors } from '@/core/theme/colors';
import { EmptyState } from '@/shared/widgets/EmptyState';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import {
  BrowseFilters,
  fetchCandidatesPage,
  filtersForRole,
  hasRefineFilters,
  PAGE_SIZE,
} from '@/features/employer/data/services/candidateBrowse';
import {
  fetchEmployerAccount,
  hasActiveSubscription,
} from '@/features/employer/data/services/employerSubscription';
import {
  clearSubscriptionPending,
  getSubscriptionPendingAt,
  isSubscriptionPending,
} from '@/features/employer/data/services/subscriptionPending';
import { CandidateBrowseCard } from '@/features/employer/presentation/components/CandidateBrowseCard';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { RefineFiltersModal } from './RefineFiltersModal';
import { RolePickerView } from './RolePickerView';


type Nav = NativeStackNavigationProp<RootStackParamList>;

export function BrowseScreen() {
  const { t } = useLocale();
  const navigation = useNavigation<Nav>();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [filters, setFilters] = useState<BrowseFilters | null>(null);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [subActive, setSubActive] = useState(false);
  const [subPending, setSubPending] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);

  const refined = filters ? hasRefineFilters(filters) : false;

  const loadSubscription = useCallback(async () => {
    try {
      const account = await fetchEmployerAccount();
      const active = hasActiveSubscription(account.subscriptionEndsAt);
      setSubActive(active);
      const pendingAt = await getSubscriptionPendingAt();
      setSubPending(isSubscriptionPending(pendingAt, active));
      if (active) await clearSubscriptionPending();
    } catch {
      setSubActive(false);
      setSubPending(false);
    }
  }, []);

  const loadPage = useCallback(
    async (activeFilters: BrowseFilters, refresh: boolean) => {
      const nextPage = refresh ? 0 : page;
      try {
        const data = await fetchCandidatesPage(activeFilters, nextPage);
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
    [page],
  );

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const selectRole = (role: string) => {
    const next = filtersForRole(role);
    setSelectedRole(role);
    setFilters(next);
    setLoading(true);
    setPage(0);
    void loadPage(next, true);
  };

  const backToRoles = () => {
    setSelectedRole(null);
    setFilters(null);
    setItems([]);
    setPage(0);
    setHasMore(true);
    setLoading(false);
  };

  const onRefresh = () => {
    if (!filters) return;
    setRefreshing(true);
    loadSubscription();
    void loadPage(filters, true);
  };

  const applyRefine = (next: BrowseFilters) => {
    setFilters(next);
    setLoading(true);
    setPage(0);
    void loadPage(next, true);
  };

  const resetRefine = () => {
    if (!selectedRole) return;
    const next = filtersForRole(selectedRole);
    setFilters(next);
    setLoading(true);
    void loadPage(next, true);
  };

  if (!selectedRole) {
    return (
      <ContentWidth style={styles.container}>
        <View style={styles.headerPad}>
          <ScreenHeader
            title={t.browse}
            right={
              <Pressable
                style={[styles.pill, subActive && styles.pillActive, subPending && styles.pillPending]}
                onPress={() => navigation.navigate('Subscription')}
              >
                <Text
                  style={[
                    styles.pillText,
                    subActive && styles.pillTextActive,
                    subPending && styles.pillTextPending,
                  ]}
                >
                  {subActive
                    ? t.planActive
                    : subPending
                      ? t.subscriptionPending
                      : t.managePlan}
                </Text>
              </Pressable>
            }
          />
        </View>
        <RolePickerView onSelectRole={selectRole} />
      </ContentWidth>
    );
  }

  return (
    <ContentWidth style={styles.container}>
      <View style={styles.headerPad}>
        <Pressable
          onPress={backToRoles}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={t.browseBackToRoles}
        >
          <AppIcon name="chevron-back" size={22} color={colors.primary} />
          <Text style={styles.backText}>{t.browseBackToRoles}</Text>
        </Pressable>
        <ScreenHeader
          title={t.candidatesForRole(selectedRole)}
          right={
            <View style={styles.headerActions}>
              <Pressable
                style={[styles.pill, refined && styles.pillFiltered]}
                onPress={() => setRefineOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={t.browseRefine}
              >
                <Text style={[styles.pillText, refined && styles.pillTextFiltered]}>
                  {refined ? t.filtered : t.browseRefine}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.pill,
                  subActive && styles.pillActive,
                  subPending && styles.pillPending,
                ]}
                onPress={() => navigation.navigate('Subscription')}
              >
                <Text
                  style={[
                    styles.pillText,
                    subActive && styles.pillTextActive,
                    subPending && styles.pillTextPending,
                  ]}
                >
                  {subActive
                    ? t.planActive
                    : subPending
                      ? t.subscriptionPending
                      : t.managePlan}
                </Text>
              </Pressable>
            </View>
          }
        />
      </View>

      {filters ? (
        <RefineFiltersModal
          visible={refineOpen}
          role={selectedRole}
          initial={filters}
          onClose={() => setRefineOpen(false)}
          onApply={applyRefine}
        />
      ) : null}

      {loading ? (
        <ActivityIndicator style={styles.center} color={colors.primary} />
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CandidateBrowseCard
              item={item}
              onPress={() =>
                navigation.navigate('CandidateDetail', { candidateId: String(item.id) })
              }
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            if (hasMore && filters) void loadPage(filters, false);
          }}
          ListEmptyComponent={
            <EmptyState
              title={t.noCandidates}
              message={t.noCandidatesHint}
              actionLabel={refined ? t.resetFilters : t.browseRefine}
              onAction={refined ? resetRefine : () => setRefineOpen(true)}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.scaffold },
  headerPad: { paddingHorizontal: 16 },
  list: { flex: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  backText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
  },
  pillActive: {
    backgroundColor: `${colors.secondary}20`,
    borderColor: `${colors.secondary}50`,
  },
  pillPending: { backgroundColor: '#FFF3E0' },
  pillTextPending: { color: '#E65100' },
  pillFiltered: { backgroundColor: `${colors.primary}30` },
  pillText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  pillTextActive: { color: colors.secondary },
  pillTextFiltered: { color: colors.primary },
  sep: { height: 1, backgroundColor: colors.divider },
  center: { marginTop: 40 },
});
