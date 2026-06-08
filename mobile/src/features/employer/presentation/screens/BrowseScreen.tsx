import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { layout, layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { browseItemLayout, FLAT_LIST_PERF } from '@/shared/constants/listPerf';
import { BrowseListSkeleton } from '@/shared/widgets/BrowseListSkeleton';
import { EmptyState } from '@/shared/widgets/EmptyState';
import { ErrorState } from '@/shared/widgets/ErrorState';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { supabase } from '@/core/lib/supabase';
import { getErrorMessage, isLikelyNetworkError } from '@/shared/utils/errors';
import {
  BrowseFilters,
  fetchCandidatesPage,
  filtersForRole,
  hasRefineFilters,
  PAGE_SIZE,
} from '@/features/employer/data/services/candidateBrowse';
import {
  readBrowseCache,
  writeBrowseCache,
} from '@/features/employer/data/services/browseCache';
import { BrowseListRow } from '@/features/employer/presentation/components/BrowseListRow';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { RefineFiltersModal } from './RefineFiltersModal';
import { RolePickerView } from './RolePickerView';
import { ProfileCompletionCard } from '@/shared/widgets/ProfileCompletionCard';
import { employerProfileCompletion } from '@/shared/utils/profileCompletion';
import { employerFromRow } from '@/features/employer/domain/types/employerOnboarding';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ListSeparator = () => <View style={listStyles.sep} />;

const listStyles = StyleSheet.create({
  sep: { height: 1, backgroundColor: colors.divider },
});

const ROLE_LEGEND_DISMISSED_KEY = 'employer_role_legend_dismissed_v1';

export function BrowseScreen() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const navigation = useNavigation<Nav>();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [filters, setFilters] = useState<BrowseFilters | null>(null);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showingCache, setShowingCache] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const [employerProfile, setEmployerProfile] = useState<Record<string, unknown> | null>(null);
  const [showRoleLegend, setShowRoleLegend] = useState(false);

  const pageRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const filtersRef = useRef<BrowseFilters | null>(null);
  filtersRef.current = filters;

  const refined = filters ? hasRefineFilters(filters) : false;

  useEffect(() => {
    AsyncStorage.getItem(ROLE_LEGEND_DISMISSED_KEY).then((v) => {
      setShowRoleLegend(v !== '1');
    });
  }, []);

  const dismissRoleLegend = useCallback(() => {
    setShowRoleLegend(false);
    void AsyncStorage.setItem(ROLE_LEGEND_DISMISSED_KEY, '1');
  }, []);

  const loadEmployerProfile = useCallback(async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;
      const { data: employer } = await supabase
        .from('employers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      setEmployerProfile(employer as Record<string, unknown> | null);
    } catch {
      setEmployerProfile(null);
    }
  }, []);

  const loadPage = useCallback(
    async (activeFilters: BrowseFilters, refresh: boolean) => {
      if (!refresh && loadingMoreRef.current) return;

      const nextPage = refresh ? 0 : pageRef.current;
      if (refresh) {
        setLoadError(null);
        setShowingCache(false);
      } else {
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }

      try {
        const data = await fetchCandidatesPage(activeFilters, nextPage);
        if (refresh) {
          setItems(data);
          pageRef.current = 1;
          void writeBrowseCache(activeFilters, data);
        } else {
          setItems((prev) => [...prev, ...data]);
          pageRef.current = nextPage + 1;
        }
        setHasMore(data.length >= PAGE_SIZE);
        setLoadError(null);
        setShowingCache(false);
      } catch (e) {
        const message = getErrorMessage(e, t.errorLoadList);
        if (refresh) {
          const cached = await readBrowseCache(activeFilters);
          if (cached?.length) {
            setItems(cached);
            pageRef.current = 1;
            setHasMore(false);
            setShowingCache(true);
            setLoadError(null);
          } else {
            setItems([]);
            setLoadError(
              isLikelyNetworkError(e) ? t.errorLoadList : message,
            );
          }
        }
      } finally {
        if (refresh) {
          setLoading(false);
          setRefreshing(false);
        } else {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        }
      }
    },
    [t.errorLoadList],
  );

  useEffect(() => {
    loadEmployerProfile();
  }, [loadEmployerProfile]);

  const selectRole = useCallback((role: string) => {
    const next = filtersForRole(role);
    setSelectedRole(role);
    setFilters(next);
    setLoading(true);
    setLoadError(null);
    pageRef.current = 0;
    setHasMore(true);
    void loadPage(next, true);
  }, [loadPage]);

  const backToRoles = useCallback(() => {
    setSelectedRole(null);
    setFilters(null);
    setItems([]);
    pageRef.current = 0;
    setHasMore(true);
    setLoading(false);
    setLoadError(null);
    setShowingCache(false);
  }, []);

  const onRefresh = useCallback(() => {
    const f = filtersRef.current;
    if (!f) return;
    setRefreshing(true);
    void loadPage(f, true);
  }, [loadPage]);

  const applyRefine = useCallback((next: BrowseFilters) => {
    setFilters(next);
    setLoading(true);
    setLoadError(null);
    pageRef.current = 0;
    void loadPage(next, true);
  }, [loadPage]);

  const resetRefine = useCallback(() => {
    if (!selectedRole) return;
    const next = filtersForRole(selectedRole);
    setFilters(next);
    setLoading(true);
    setLoadError(null);
    pageRef.current = 0;
    void loadPage(next, true);
  }, [loadPage, selectedRole]);

  const retryLoad = useCallback(() => {
    const f = filtersRef.current;
    if (!f) return;
    setLoading(true);
    setLoadError(null);
    pageRef.current = 0;
    void loadPage(f, true);
  }, [loadPage]);

  const openCandidate = useCallback(
    (candidateId: string) => {
      navigation.navigate('CandidateDetail', {
        candidateId,
        hiringRole: selectedRole ?? undefined,
      });
    },
    [navigation, selectedRole],
  );

  const keyExtractor = useCallback(
    (item: Record<string, unknown>) => String(item.id),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: Record<string, unknown> }) => (
      <BrowseListRow
        item={item}
        hiringRole={selectedRole}
        onOpen={openCandidate}
      />
    ),
    [openCandidate, selectedRole],
  );

  const onEndReached = useCallback(() => {
    const f = filtersRef.current;
    if (!f || !hasMore || loadingMoreRef.current || loading) return;
    void loadPage(f, false);
  }, [hasMore, loadPage, loading]);

  const listFooter = useMemo(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.primary} accessibilityLabel={t.loadingMore} />
      </View>
    );
  }, [loadingMore, t.loadingMore]);

  const listEmpty = useMemo(() => {
    if (loadError) {
      return (
        <ErrorState
          title={t.errorTitle}
          message={loadError}
          actionLabel={t.retry}
          onAction={retryLoad}
        />
      );
    }
    return (
      <EmptyState
        title={t.noCandidates}
        message={t.noCandidatesHint}
        icon="👥"
        actionLabel={refined ? t.resetFilters : t.browseRefine}
        onAction={refined ? resetRefine : () => setRefineOpen(true)}
      />
    );
  }, [loadError, refined, resetRefine, retryLoad, t]);

  const employerCompletion =
    employerProfile ? employerProfileCompletion(employerProfile) : null;

  const openEmployerProfileEdit = useCallback(() => {
    if (!employerProfile) return;
    navigation.navigate('EmployerOnboarding', {
      initial: employerFromRow(employerProfile),
    });
  }, [employerProfile, navigation]);

  const employerCompletionCard =
    employerCompletion ? (
      <View style={styles.completionPad}>
        <ProfileCompletionCard
          completion={employerCompletion}
          variant="employer"
          onImprove={
            employerCompletion.percent < 100 && employerProfile
              ? openEmployerProfileEdit
              : undefined
          }
        />
      </View>
    ) : null;

  if (!selectedRole) {
    return (
      <ContentWidth style={styles.container}>
        <View style={styles.headerPad}>
          <ScreenHeader title={t.browsePickRole} />
        </View>
        {employerCompletion && employerCompletion.percent < 100
          ? employerCompletionCard
          : null}
        <RolePickerView onSelectRole={selectRole} />
      </ContentWidth>
    );
  }

  const showSkeleton = loading && items.length === 0 && !loadError;

  return (
    <ContentWidth style={styles.container}>
      <View style={styles.headerPad}>
        <Pressable
          onPress={backToRoles}
          style={({ pressed }) => [styles.backBtn, rtl.row, pressed && styles.pillPressed]}
          accessibilityRole="button"
          accessibilityLabel={t.browseBackToRoles}
          accessibilityHint={t.a11yBackHint}
        >
          <AppIcon
            name={rtl.isRtl ? 'chevron-forward' : 'chevron-back'}
            size={22}
            color={colors.primary}
          />
          <Text style={styles.backText} numberOfLines={1}>
            {t.browseBackToRoles}
          </Text>
        </Pressable>
        <ScreenHeader
          title={t.candidatesForRole(selectedRole)}
          right={
            <View style={[styles.headerActions, rtl.row]}>
              <Pressable
                style={({ pressed }) => [
                  styles.pill,
                  refined && styles.pillFiltered,
                  pressed && styles.pillPressed,
                ]}
                onPress={() => setRefineOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={refined ? t.filtered : t.browseRefine}
                accessibilityHint={t.a11yRefineHint}
                accessibilityState={{ selected: refined }}
              >
                <Text
                  style={[styles.pillText, refined && styles.pillTextFiltered]}
                  numberOfLines={1}
                >
                  {refined ? t.filtered : t.browseRefine}
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

      {employerCompletion && employerCompletion.percent < 100
        ? employerCompletionCard
        : null}

      {showRoleLegend ? (
        <View style={styles.legendPad}>
          <View style={[styles.legendBox, rtl.row]}>
            <Text style={[styles.legendText, { textAlign: rtl.textAlign, flex: 1 }]}>
              {t.employerRoleFilterLegend}
            </Text>
            <Pressable
              onPress={dismissRoleLegend}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t.employerRoleFilterLegendDismiss}
            >
              <Text style={styles.legendDismiss}>{t.employerRoleFilterLegendDismiss}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {showingCache ? (
        <View style={styles.cacheBanner}>
          <InfoBanner message={t.offlineCachedHint} variant="warning" />
        </View>
      ) : null}

      {showSkeleton ? (
        <BrowseListSkeleton />
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={browseItemLayout}
          {...FLAT_LIST_PERF}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.35}
          ListFooterComponent={listFooter}
          ListEmptyComponent={listEmpty}
          ItemSeparatorComponent={ListSeparator}
        />
      )}
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.scaffold },
  completionPad: { ...layoutStyles.screenHeaderWrap, paddingBottom: spacing.sm },
  legendPad: { ...layoutStyles.screenHeaderWrap, paddingBottom: spacing.sm },
  legendBox: {
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: layout.cardRadius,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
  },
  legendText: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  legendDismiss: { ...typography.caption, fontWeight: '700', color: colors.primary },
  headerPad: layoutStyles.screenHeaderWrap,
  list: { flex: 1 },
  listContent: {
    paddingBottom: layout.screenPaddingBottom + layout.tabBarClearance,
  },
  cacheBanner: { ...layoutStyles.screenHeaderWrap, paddingBottom: spacing.sm },
  footerLoader: { paddingVertical: spacing.lg, alignItems: 'center' },
  backBtn: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  backText: { ...typography.label, color: colors.primary },
  headerActions: {
    gap: spacing.sm,
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: '100%',
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    maxWidth: 140,
  },
  pillFiltered: { backgroundColor: `${colors.primary}30` },
  pillText: { ...typography.label, color: colors.primary },
  pillTextFiltered: { color: colors.primary },
  pillPressed: { opacity: interaction.pressed },
});
