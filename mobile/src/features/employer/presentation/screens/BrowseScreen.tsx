import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { FLAT_LIST_PERF } from '@/shared/constants/listPerf';
import { BrowseListSkeleton } from '@/shared/widgets/BrowseListSkeleton';
import { EmptyState } from '@/shared/widgets/EmptyState';
import { ErrorState } from '@/shared/widgets/ErrorState';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { supabase } from '@/core/lib/supabase';
import { getErrorMessage, isLikelyNetworkError } from '@/shared/utils/errors';
import {
  BrowseFilters,
  filtersForRole,
  hasRefineFilters,
  useBrowseCandidates,
} from '@/features/employer/data/services/candidateBrowse';
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
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [filters, setFilters] = useState<BrowseFilters | null>(null);
  const [refineOpen, setRefineOpen] = useState(false);
  const [employerProfile, setEmployerProfile] = useState<Record<string, unknown> | null>(null);
  const [employerProfileError, setEmployerProfileError] = useState<string | null>(null);
  const [showRoleLegend, setShowRoleLegend] = useState(false);

  const {
    data,
    error,
    isPending,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useBrowseCandidates(filters, t.errorLoadList);

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );
  const showingCache = data?.pages[0]?.fromCache ?? false;
  const loadError = error
    ? isLikelyNetworkError(error) && items.length === 0
      ? t.errorLoadList
      : String(error.message || t.errorLoadList)
    : null;

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
    setEmployerProfileError(null);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = userData.user?.id;
      if (!userId) throw new Error(t.errorGeneric);
      const { data: employer, error: employerError } = await supabase
        .from('employers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (employerError) throw employerError;
      setEmployerProfile(employer as Record<string, unknown> | null);
    } catch (e) {
      setEmployerProfileError(
        getErrorMessage(e, t.errorGeneric),
      );
    }
  }, [t.errorGeneric]);

  useEffect(() => {
    loadEmployerProfile();
  }, [loadEmployerProfile]);

  const selectRole = useCallback((role: string) => {
    setSelectedRole(role);
    setFilters(filtersForRole(role));
  }, []);

  const backToRoles = useCallback(() => {
    setSelectedRole(null);
    setFilters(null);
  }, []);

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const applyRefine = useCallback((next: BrowseFilters) => {
    setFilters(next);
  }, []);

  const resetRefine = useCallback(() => {
    if (!selectedRole) return;
    setFilters(filtersForRole(selectedRole));
  }, [selectedRole]);

  const retryLoad = useCallback(() => {
    void refetch();
  }, [refetch]);

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
    if (!hasNextPage || isFetchingNextPage || isPending) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isPending]);

  const listFooter = useMemo(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.primary} accessibilityLabel={t.loadingMore} />
      </View>
    );
  }, [isFetchingNextPage, t.loadingMore]);

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
        actionLabel={refined ? t.resetFilters : t.browseBackToRoles}
        onAction={refined ? resetRefine : backToRoles}
      />
    );
  }, [backToRoles, loadError, refined, resetRefine, retryLoad, t]);

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
        <View style={[styles.headerPad, { paddingTop: insets.top }]}>
          <ScreenHeader title={t.browsePickRole} />
        </View>
        {employerCompletion && employerCompletion.percent < 100
          ? employerCompletionCard
          : null}
        {employerProfileError ? (
          <View style={styles.cacheBanner}>
            <InfoBanner message={employerProfileError} variant="warning" />
          </View>
        ) : null}
        <RolePickerView onSelectRole={selectRole} />
      </ContentWidth>
    );
  }

  const showSkeleton = isPending && items.length === 0 && !loadError;

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
      {loadError && items.length > 0 ? (
        <View style={styles.cacheBanner}>
          <InfoBanner message={loadError} variant="warning" />
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
          {...FLAT_LIST_PERF}
          refreshControl={
            <RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={onRefresh} />
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
