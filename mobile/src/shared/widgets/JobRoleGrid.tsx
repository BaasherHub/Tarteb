import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { chipA11yProps } from '@/shared/utils/a11y';
import { playSelectionHaptic } from '@/shared/utils/selectionHaptic';
import {
  getCategoryById,
  getRoleCategoryChipLabel,
  getRoleCategoryLabel,
  ONBOARDING_ROLE_CATEGORIES,
  type RoleCategoryId,
} from '@/shared/constants/candidate';

export type JobRoleGridFilterState = {
  query: string;
  categoryId: RoleCategoryId | null;
  onQueryChange: (query: string) => void;
  onCategoryChange: (categoryId: RoleCategoryId | null) => void;
};

type Props = {
  selectionMode?: 'single' | 'multi';
  selectedRole?: string | null;
  selectedRoles?: string[];
  /** Roles that cannot be selected (e.g. primary when picking additional). */
  excludedRoles?: string[];
  maxSelections?: number;
  onSelectRole: (role: string) => void;
  counts?: Record<string, number>;
  /** Search + category chips; default true. */
  showChrome?: boolean;
  /** Lifted filter state (share one chrome across step sections). */
  filter?: JobRoleGridFilterState;
  /** Shown above the list (e.g. max additional roles reached). */
  listBanner?: string | null;
  /** Compact native single-select presentation for onboarding. */
  displayMode?: 'list' | 'native-picker';
  /** Clears the single selection when a category change invalidates it. */
  onClearRole?: () => void;
};

function matchesQuery(role: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return role.toLowerCase().includes(q);
}

function sortRoles(roles: string[]): string[] {
  return [...roles].sort((a, b) => a.localeCompare(b));
}

export const JobRoleGrid = memo(function JobRoleGrid({
  selectionMode = 'single',
  selectedRole,
  selectedRoles = [],
  excludedRoles = [],
  maxSelections = 1,
  onSelectRole,
  counts,
  showChrome = true,
  filter: externalFilter,
  listBanner,
  displayMode = 'list',
  onClearRole,
}: Props) {
  const { t, lang } = useLocale();
  const rtl = useRtlStyles();
  const [internalQuery, setInternalQuery] = useState('');
  const [internalCategoryId, setInternalCategoryId] = useState<RoleCategoryId | null>(null);
  const [pickerOpen, setPickerOpen] = useState<'category' | 'role' | null>(null);
  const query = externalFilter?.query ?? internalQuery;
  const setQuery = externalFilter?.onQueryChange ?? setInternalQuery;
  const categoryId = externalFilter?.categoryId ?? internalCategoryId;
  const setCategoryId = externalFilter?.onCategoryChange ?? setInternalCategoryId;
  const isMulti = selectionMode === 'multi';
  const excludedSet = useMemo(() => new Set(excludedRoles), [excludedRoles]);
  const selectedSet = useMemo(
    () => new Set(isMulti ? selectedRoles : selectedRole ? [selectedRole] : []),
    [isMulti, selectedRole, selectedRoles],
  );
  const atSelectionCap = isMulti && selectedSet.size >= maxSelections;

  const activeCategory = categoryId ? getCategoryById(categoryId) : undefined;
  const activeCategoryLabel = activeCategory
    ? getRoleCategoryLabel(activeCategory, lang)
    : undefined;

  const scopedRoles = useMemo(() => {
    if (categoryId) {
      const cat = getCategoryById(categoryId);
      return sortRoles(cat?.roles ?? []);
    }
    return sortRoles(
      ONBOARDING_ROLE_CATEGORIES.flatMap((c) => c.roles),
    );
  }, [categoryId]);

  const filteredListRoles = useMemo(() => {
    return scopedRoles.filter((r) => matchesQuery(r, query));
  }, [scopedRoles, query]);

  const showList = filteredListRoles.length > 0;
  const isEmpty = !showList;

  const emptyMessage = useMemo(() => {
    const q = query.trim();
    if (q || activeCategoryLabel) {
      return t.jobRoleNoMatchDetail({
        query: q || undefined,
        categoryLabel: activeCategoryLabel,
      });
    }
    return t.jobRoleNoMatch;
  }, [query, activeCategoryLabel, t]);

  const allRoles = useMemo(
    () => sortRoles(ONBOARDING_ROLE_CATEGORIES.flatMap((c) => c.roles)),
    [],
  );

  const onSelectCategory = useCallback(
    (id: RoleCategoryId | null) => {
      void playSelectionHaptic();
      setCategoryId(id);
      if (!selectedRole || isMulti) return;
      const nextRoles = id
        ? sortRoles(getCategoryById(id)?.roles ?? [])
        : allRoles;
      if (!nextRoles.includes(selectedRole)) {
        onClearRole?.();
      }
    },
    [allRoles, isMulti, onClearRole, selectedRole, setCategoryId],
  );

  const selectSingleRole = useCallback(
    (role: string) => {
      void playSelectionHaptic();
      onSelectRole(role);
      setPickerOpen(null);
    },
    [onSelectRole],
  );

  const hasActiveFilters = Boolean(query.trim() || categoryId);
  const renderRole = useCallback(
    ({ item: role }: { item: string }) => {
      const selected = selectedSet.has(role);
      const disabled = excludedSet.has(role) || (atSelectionCap && !selected);
      const count = counts?.[role];
      const a11y = chipA11yProps(role, selected, t);

      return (
        <Pressable
          onPress={() => {
            if (disabled) return;
            onSelectRole(role);
          }}
          disabled={disabled}
          style={({ pressed }) => [
            styles.listRow,
            rtl.row,
            selected && styles.listRowSelected,
            disabled && styles.listRowDisabled,
            pressed && !disabled && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={a11y.accessibilityLabel}
          accessibilityHint={a11y.accessibilityHint}
          accessibilityState={{ selected, disabled }}
          android_ripple={{ color: 'rgba(19,88,206,0.15)', borderless: false }}
        >
          <Text
            style={[
              styles.listLabel,
              selected && styles.listLabelSelected,
              disabled && styles.listLabelDisabled,
            ]}
            numberOfLines={2}
          >
            {role}
          </Text>
          <View style={[styles.listMeta, rtl.row]}>
            {count != null && count > 0 ? (
              <Text style={styles.count}>{count}</Text>
            ) : null}
            {selected ? (
              <AppIcon
                name="checkmark-circle"
                size={22}
                color={colors.primary}
              />
            ) : null}
          </View>
        </Pressable>
      );
    },
    [
      atSelectionCap,
      counts,
      excludedSet,
      onSelectRole,
      rtl.row,
      selectedSet,
      t,
    ],
  );

  if (displayMode === 'native-picker' && !isMulti) {
    const pickerSelectedRole =
      selectedRole && scopedRoles.includes(selectedRole) ? selectedRole : '';
    const categoryValueLabel = activeCategoryLabel ?? t.jobRoleAllCategories;
    const roleValueLabel = pickerSelectedRole || t.errRole;

    return (
      <View style={styles.root}>
        <NativeChoiceField
          label={t.jobRoleCategories}
          valueLabel={categoryValueLabel}
          placeholder={t.jobRoleAllCategories}
          onPress={() => setPickerOpen('category')}
          rtl={rtl}
        />

        <NativeChoiceField
          label={t.jobRole}
          valueLabel={roleValueLabel}
          placeholder={t.errRole}
          empty={!pickerSelectedRole}
          onPress={() => setPickerOpen('role')}
          rtl={rtl}
        />

        <Modal
          visible={pickerOpen !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerOpen(null)}
          accessibilityViewIsModal
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setPickerOpen(null)}
              accessibilityRole="button"
              accessibilityLabel={t.cancel}
            />
            <View style={styles.modalSheet}>
              <Text
                style={[
                  styles.modalTitle,
                  { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
                ]}
                accessibilityRole="header"
              >
                {pickerOpen === 'category' ? t.jobRoleCategories : t.jobRole}
              </Text>
              <ScrollView
                style={styles.modalList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {pickerOpen === 'category' ? (
                  <>
                    <ChoiceRow
                      label={t.jobRoleAllCategories}
                      selected={categoryId === null}
                      onPress={() => {
                        onSelectCategory(null);
                        setPickerOpen(null);
                      }}
                      rtl={rtl}
                    />
                    {ONBOARDING_ROLE_CATEGORIES.map((cat) => (
                      <ChoiceRow
                        key={cat.id}
                        label={getRoleCategoryLabel(cat, lang)}
                        selected={categoryId === cat.id}
                        onPress={() => {
                          onSelectCategory(cat.id);
                          setPickerOpen(null);
                        }}
                        rtl={rtl}
                      />
                    ))}
                  </>
                ) : (
                  scopedRoles.map((role) => (
                    <ChoiceRow
                      key={role}
                      label={role}
                      selected={pickerSelectedRole === role}
                      onPress={() => selectSingleRole(role)}
                      rtl={rtl}
                    />
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {showChrome ? (
        <>
      <View style={[styles.searchWrap, rtl.row]}>
        <AppIcon
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.search,
            { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
          ]}
          accessibilityLabel={t.jobRoleSearchPlaceholder}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {hasActiveFilters ? (
        <View style={[styles.activeFilters, rtl.row]}>
          {categoryId && activeCategoryLabel ? (
            <FilterTag
              label={activeCategoryLabel}
              onClear={() => onSelectCategory(null)}
              clearLabel={t.jobRoleClearCategory}
            />
          ) : null}
          {query.trim() ? (
            <FilterTag
              label={`“${query.trim()}”`}
              onClear={() => setQuery('')}
              clearLabel={t.jobRoleClearSearch}
            />
          ) : null}
        </View>
      ) : null}

      <View style={styles.block}>
        <HorizontalChipScroller
          isRtl={rtl.isRtl}
          accessibilityLabel={t.jobRoleCategories}
        >
          <CategoryChip
            label={t.jobRoleAllCategories}
            selected={categoryId === null}
            onPress={() => onSelectCategory(null)}
          />
          {ONBOARDING_ROLE_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={getRoleCategoryChipLabel(cat, lang)}
              selected={categoryId === cat.id}
              onPress={() => onSelectCategory(cat.id)}
              accessibilityHint={getRoleCategoryLabel(cat, lang)}
            />
          ))}
        </HorizontalChipScroller>
      </View>
        </>
      ) : null}

      {listBanner ? (
        <Text style={[styles.listBanner, { textAlign: rtl.textAlign }]}>{listBanner}</Text>
      ) : null}

      {showList ? (
        <View style={styles.block}>
          {showChrome && categoryId && activeCategoryLabel ? (
            <Text style={[styles.listHeading, { textAlign: rtl.textAlign }]}>
              {activeCategoryLabel}
            </Text>
          ) : null}
          <ScrollView
            style={styles.list}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {filteredListRoles.map((role, index) => (
              <React.Fragment key={role}>
                {renderRole({ item: role })}
                {index < filteredListRoles.length - 1 ? <RoleSeparator /> : null}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {isEmpty ? (
        <Text style={[styles.empty, { textAlign: rtl.textAlignCenter }]}>
          {emptyMessage}
        </Text>
      ) : null}
    </View>
  );
});

const RoleSeparator = () => <View style={styles.listRowBorder} />;

function NativeChoiceField({
  label,
  valueLabel,
  placeholder,
  empty,
  onPress,
  rtl,
}: {
  label: string;
  valueLabel: string;
  placeholder: string;
  empty?: boolean;
  onPress: () => void;
  rtl: ReturnType<typeof useRtlStyles>;
}) {
  return (
    <View style={styles.pickerGroup}>
      <Text style={[styles.pickerLabel, { textAlign: rtl.textAlign }]}>
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.choiceField,
          rtl.row,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={valueLabel || placeholder}
      >
        <Text
          style={[
            styles.choiceValue,
            empty && styles.choiceValueEmpty,
            { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
          ]}
          numberOfLines={1}
        >
          {valueLabel || placeholder}
        </Text>
        <AppIcon
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
          style={rtl.isRtl ? styles.chevronRtl : styles.chevronLtr}
        />
      </Pressable>
    </View>
  );
}

function ChoiceRow({
  label,
  selected,
  onPress,
  rtl,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  rtl: ReturnType<typeof useRtlStyles>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceRow,
        rtl.row,
        selected && styles.choiceRowSelected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      android_ripple={{ color: 'rgba(19,88,206,0.15)', borderless: false }}
    >
      <Text
        style={[
          styles.choiceRowText,
          selected && styles.choiceRowTextSelected,
          { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
      {selected ? (
        <AppIcon name="checkmark-circle" size={22} color={colors.primary} />
      ) : (
        <View style={styles.checkSpacer} />
      )}
    </Pressable>
  );
}

function HorizontalChipScroller({
  children,
  isRtl,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  isRtl: boolean;
  accessibilityLabel: string;
}) {
  const [layoutW, setLayoutW] = useState(0);
  const [contentW, setContentW] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  const showScrollHint = useMemo(() => {
    if (contentW <= layoutW + 8) return false;
    const maxOffset = Math.max(0, contentW - layoutW);
    const distFromTrailing = isRtl ? offsetX : maxOffset - offsetX;
    return distFromTrailing > 12;
  }, [contentW, layoutW, offsetX, isRtl]);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setOffsetX(e.nativeEvent.contentOffset.x);
    setLayoutW(e.nativeEvent.layoutMeasurement.width);
    setContentW(e.nativeEvent.contentSize.width);
  }, []);

  return (
    <View style={styles.scrollerWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.chipRow,
          { flexDirection: isRtl ? 'row-reverse' : 'row' },
        ]}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel={accessibilityLabel}
        onScroll={onScroll}
        scrollEventThrottle={32}
        onContentSizeChange={(w) => setContentW(w)}
        onLayout={(e) => setLayoutW(e.nativeEvent.layout.width)}
      >
        {children}
      </ScrollView>
      {showScrollHint ? (
        <View
          style={[
            styles.scrollHint,
            isRtl ? styles.scrollHintStart : styles.scrollHintEnd,
          ]}
          pointerEvents="none"
        >
          <AppIcon
            name={isRtl ? 'chevron-back' : 'chevron-forward'}
            size={18}
            color={colors.textSecondary}
          />
        </View>
      ) : null}
    </View>
  );
}

function FilterTag({
  label,
  onClear,
  clearLabel,
}: {
  label: string;
  onClear: () => void;
  clearLabel: string;
}) {
  return (
    <View style={styles.filterTag}>
      <Text style={styles.filterTagText} numberOfLines={1}>
        {label}
      </Text>
      <Pressable
        onPress={onClear}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={clearLabel}
        style={styles.filterTagClear}
      >
        <Text style={styles.filterTagClearText}>×</Text>
      </Pressable>
    </View>
  );
}

function CategoryChip({
  label,
  selected,
  onPress,
  accessibilityHint,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryChip,
        selected && styles.categoryChipSelected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      android_ripple={{ color: 'rgba(19,88,206,0.15)', borderless: false }}
    >
      <Text
        style={[
          styles.categoryChipText,
          selected && styles.categoryChipTextSelected,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  searchIcon: { marginEnd: spacing.sm },
  search: {
    ...typography.body,
    flex: 1,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    minHeight: 44,
  },
  activeFilters: {
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    backgroundColor: colors.primaryTint,
    borderRadius: 20,
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: `${colors.primary}44`,
  },
  filterTagText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
    flexShrink: 1,
  },
  filterTagClear: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  filterTagClearText: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  block: { gap: spacing.xs },
  pickerGroup: {
    gap: spacing.xs,
  },
  pickerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  choiceField: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  choiceValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  choiceValueEmpty: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chevronLtr: { transform: [{ rotate: '90deg' }] },
  chevronRtl: { transform: [{ rotate: '-90deg' }] },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalSheet: {
    maxHeight: '74%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalList: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  choiceRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  choiceRowSelected: {
    backgroundColor: colors.primaryTint,
  },
  choiceRowText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  choiceRowTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  checkSpacer: { width: 22 },
  listBanner: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
  },
  scrollerWrap: { position: 'relative' },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 2,
    paddingEnd: spacing.xl,
  },
  scrollHint: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.scaffold,
    opacity: 0.92,
  },
  scrollHintEnd: { right: 0 },
  scrollHintStart: { left: 0 },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  categoryChipSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  categoryChipText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  listHeading: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  list: {
    maxHeight: 440,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  listRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 50,
    gap: spacing.md,
  },
  listRowBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  listRowSelected: {
    backgroundColor: colors.primaryTint,
  },
  listRowDisabled: {
    opacity: 0.45,
  },
  listLabel: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  listLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  listLabelDisabled: {
    color: colors.textSecondary,
  },
  listMeta: {
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  pressed: { opacity: interaction.pressed },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    paddingVertical: spacing.lg,
    lineHeight: 22,
  },
});
