import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useRoute, type RouteProp } from '@react-navigation/native';

import { useFocusEffect } from '@react-navigation/native';

import { useRtlStyles } from '@/core/hooks/useRtlStyles';

import {

  fetchEmployerAccount,

  hasActiveSubscription,

  TIER_LIMITS,

  SubscriptionTier,

} from '@/features/employer/data/services/employerSubscription';

import { RootStackParamList } from '@/core/navigation/types';

import { Screen } from '@/shared/widgets/Screen';

import { colors } from '@/core/theme/colors';

import { interaction } from '@/core/theme/interaction';

import { layout } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';

import { typography } from '@/core/theme/typography';

import { openWhatsAppSubscribe } from '@/shared/utils/whatsapp';

import { supabase } from '@/core/lib/supabase';

import { AppIcon } from '@/shared/widgets/AppIcon';

import { InfoBanner } from '@/shared/widgets/InfoBanner';

import { ContentWidth } from '@/shared/widgets/ContentWidth';

import { AppBrand } from '@/shared/widgets/AppBrand';

import { PrimaryButton } from '@/shared/widgets/PrimaryButton';

import { ScreenLoading } from '@/shared/widgets/ScreenLoading';

import { ErrorState } from '@/shared/widgets/ErrorState';

import { useLocale } from '@/core/i18n/LocaleContext';

import { getErrorMessage } from '@/shared/utils/errors';

import { useToast } from '@/core/providers/ToastProvider';

import {

  clearSubscriptionPending,

  getSubscriptionPendingAt,

  isSubscriptionPending,

} from '@/features/employer/data/services/subscriptionPending';



type Props = NativeStackScreenProps<RootStackParamList, 'Subscription'>;



const TIERS: SubscriptionTier[] = ['starter', 'business', 'agency'];



export function SubscriptionScreen({ navigation }: Props) {

  const { t } = useLocale();

  const { showToast } = useToast();

  const route = useRoute<RouteProp<RootStackParamList, 'Subscription'>>();

  const rtl = useRtlStyles();

  const toastedSuccessRef = useRef(false);

  const [endsAt, setEndsAt] = useState<Date | null>(null);

  const [pendingAt, setPendingAt] = useState<Date | null>(null);

  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('starter');

  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('starter');

  const [unlocksUsed, setUnlocksUsed] = useState(0);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);



  const refresh = useCallback(async () => {

    try {

      setLoadError(null);

      const account = await fetchEmployerAccount();

      setEndsAt(account.subscriptionEndsAt);

      setCurrentTier(account.subscriptionTier);

      setSelectedTier(account.subscriptionTier);

      setUnlocksUsed(account.monthlyUnlocksUsed);

      const pending = await getSubscriptionPendingAt();

      setPendingAt(pending);

      if (hasActiveSubscription(account.subscriptionEndsAt)) {

        await clearSubscriptionPending();

        setPendingAt(null);

      }

    } catch (e) {

      setLoadError(getErrorMessage(e, t.errorGeneric));

    } finally {

      setLoading(false);

    }

  }, [t.errorGeneric]);



  useEffect(() => {

    refresh();

  }, [refresh]);



  useFocusEffect(useCallback(() => {

    refresh();

  }, [refresh]));



  useEffect(() => {

    if (route.params?.success && !toastedSuccessRef.current) {

      toastedSuccessRef.current = true;

      showToast({

        message: t.toastSubscriptionActive,

        variant: 'success',

        actionLabel: t.browse,

        onAction: () => {
          navigation.navigate('EmployerShell', { screen: 'BrowseTab' });
        },

      });

    }

  }, [route.params?.success, navigation, showToast, t]);



  const active = hasActiveSubscription(endsAt);

  const pending = isSubscriptionPending(pendingAt, active);

  const endsLabel = endsAt

    ? `${endsAt.getDate()}/${endsAt.getMonth() + 1}/${endsAt.getFullYear()}`

    : '';



  const remaining = useMemo(() => {

    if (!active) return null;

    const limit = TIER_LIMITS[currentTier];

    if (limit === null) return t.subscriptionRemainingUnlimited;

    return t.subscriptionRemainingCount(Math.max(0, limit - unlocksUsed));

  }, [active, currentTier, unlocksUsed, t]);



  const selectTier = useCallback((tier: SubscriptionTier) => {

    setSelectedTier(tier);

  }, []);



  const subscribe = async () => {

    const userId = (await supabase.auth.getUser()).data.user?.id;

    let contact = 'employer';

    if (userId) {

      const { data } = await supabase

        .from('employers')

        .select('phone')

        .eq('user_id', userId)

        .maybeSingle();

      if (data?.phone) contact = String(data.phone);

    }

    const tierName = t.tierDisplayName(selectedTier);
    const price = t.tierDisplayPrice(selectedTier);
    const message = t.whatsappSubscribeMessage(tierName, price, contact);
    await openWhatsAppSubscribe(contact, message);

    const at = await getSubscriptionPendingAt();

    setPendingAt(at);

  };



  const tierCards = useMemo(

    () =>

      TIERS.map((tier) => {

        const isCurrent = active && tier === currentTier;

        const isSelected = tier === selectedTier;

        const tierName = t.tierDisplayName(tier);

        const bullets = t.tierDisplayBullets(tier);

        return (

          <Pressable

            key={tier}

            style={({ pressed }) => [

              styles.tierCard,

              isSelected && styles.tierCardSelected,

              isCurrent && styles.tierCardCurrent,

              pressed && styles.tierCardPressed,

            ]}

            onPress={() => selectTier(tier)}

            accessibilityRole="radio"

            accessibilityState={{ selected: isSelected, checked: isSelected }}

            accessibilityLabel={`${tierName}. ${t.tierDisplayPrice(tier)}${isCurrent ? `. ${t.subscriptionA11yCurrentPlan}` : ''}`}

            accessibilityHint={t.a11ySelectPlan}

          >

            {isCurrent && (

              <View

                style={[

                  styles.currentBadge,

                  rtl.isRtl ? styles.badgeStart : styles.badgeEnd,

                ]}

              >

                <Text style={styles.currentBadgeText}>{t.subscriptionBadgeCurrent}</Text>

              </View>

            )}

            {tier === 'business' && !isCurrent && (

              <View

                style={[

                  styles.popularBadge,

                  rtl.isRtl ? styles.badgeStart : styles.badgeEnd,

                ]}

              >

                <Text style={styles.popularBadgeText}>{t.subscriptionBadgePopular}</Text>

              </View>

            )}

            <Text

              style={[styles.tierName, isSelected && styles.tierNameSelected, { textAlign: rtl.textAlign }]}

              numberOfLines={1}

            >

              {tierName}

            </Text>

            <Text

              style={[styles.tierPrice, isSelected && styles.tierPriceSelected, { textAlign: rtl.textAlign }]}

              numberOfLines={1}

            >

              {t.tierDisplayPrice(tier)}

            </Text>

            <View style={styles.tierBullets}>

              {bullets.map((b) => (

                <View key={b} style={[styles.bulletRow, rtl.row]}>

                  <Text style={[styles.bulletCheck, isSelected && styles.bulletCheckSelected]}>✓</Text>

                  <Text

                    style={[styles.bulletText, { textAlign: rtl.textAlign }]}

                    numberOfLines={3}

                  >

                    {b}

                  </Text>

                </View>

              ))}

            </View>

          </Pressable>

        );

      }),

    [active, currentTier, rtl.isRtl, rtl.textAlign, selectTier, selectedTier, t],

  );



  if (loading) {

    return (

      <Screen>

        <ScreenLoading message={t.loading} />

      </Screen>

    );

  }



  if (loadError && endsAt === null && pendingAt === null) {

    return (

      <Screen>

        <ContentWidth>

          <ErrorState

            title={t.errorTitle}

            message={loadError}

            actionLabel={t.retry}

            onAction={() => {

              setLoading(true);

              void refresh();

            }}

          />

        </ContentWidth>

      </Screen>

    );

  }



  const selectedTierName = t.tierDisplayName(selectedTier);



  return (

    <Screen>

      <ContentWidth>

        <Pressable

          onPress={() => navigation.goBack()}

          style={({ pressed }) => [

            styles.back,

            rtl.isRtl && styles.backRtl,

            pressed && styles.backPressed,

          ]}

          accessibilityRole="button"

          accessibilityLabel={t.back}

          accessibilityHint={t.a11yBackHint}

        >

          <AppIcon

            name={rtl.isRtl ? 'chevron-forward' : 'chevron-back'}

            size={24}

            color={colors.textPrimary}

          />

        </Pressable>



        <ScrollView contentContainerStyle={styles.scroll}>

          <AppBrand showTagline={false} centered />



          {active ? (

            <View style={styles.activeCard}>

              <Text style={styles.activeTitle} numberOfLines={2}>

                {t.subscriptionPlanActiveTitle(t.tierDisplayName(currentTier))}

              </Text>

              <Text style={styles.activeSub} numberOfLines={2}>

                {t.subscriptionValidUntil(endsLabel)}

              </Text>

              {remaining ? (

                <Text style={styles.activeRemaining} numberOfLines={2}>

                  {remaining}

                </Text>

              ) : null}

            </View>

          ) : (

            <Text style={[styles.headline, { textAlign: rtl.textAlignCenter }]} numberOfLines={2}>

              {t.subscriptionChoosePlan}

            </Text>

          )}



          {pending && !active && (

            <InfoBanner message={t.subscriptionPendingHint} variant="warning" />

          )}



          {loadError ? (

            <InfoBanner message={loadError} variant="warning" />

          ) : null}



          <View style={styles.tiers}>{tierCards}</View>



          {!active && (

            <PrimaryButton

              label={

                pending

                  ? t.subscribeViaWhatsApp

                  : t.subscriptionSubscribeToTier(selectedTierName)

              }

              onPress={subscribe}

            />

          )}

          {active && selectedTier !== currentTier && (

            <PrimaryButton

              label={t.subscriptionSwitchToTier(selectedTierName)}

              onPress={subscribe}

            />

          )}



          <Text

            style={[styles.note, { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection }]}

            numberOfLines={4}

          >

            {t.subscriptionPaymentNote}

          </Text>

        </ScrollView>

      </ContentWidth>

    </Screen>

  );

}



const styles = StyleSheet.create({

  back: { minWidth: 44, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },

  backRtl: { alignSelf: 'flex-end' },

  backPressed: { opacity: interaction.pressed },

  tierCardPressed: { opacity: interaction.cardPressed },

  scroll: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: layout.screenPaddingBottom,
    gap: spacing.lg,
  },

  headline: { ...typography.h2, marginTop: spacing.xs },

  activeCard: {

    padding: spacing.lg,

    borderRadius: layout.cardRadius,

    backgroundColor: colors.secondaryTint,

    borderWidth: 1,

    borderColor: `${colors.secondary}40`,

    alignItems: 'center',

    gap: spacing.xs,

  },

  activeTitle: { ...typography.h3, color: colors.secondary, textAlign: 'center' },

  activeSub: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },

  activeRemaining: {

    ...typography.body,

    fontWeight: '600',

    color: colors.textPrimary,

    marginTop: spacing.xs,

    textAlign: 'center',

  },

  tiers: { gap: spacing.md },

  tierCard: {

    padding: spacing.lg,

    borderRadius: layout.cardRadius,

    borderWidth: 1.5,

    borderColor: colors.divider,

    backgroundColor: colors.surface,

    position: 'relative',

    paddingTop: spacing.xxl,

  },

  tierCardSelected: {

    borderColor: colors.primary,

    backgroundColor: `${colors.primary}08`,

  },

  tierCardCurrent: {

    borderColor: colors.secondary,

    backgroundColor: `${colors.secondary}08`,

  },

  badgeEnd: { right: spacing.md },

  badgeStart: { left: spacing.md },

  currentBadge: {

    position: 'absolute',

    top: spacing.md,

    backgroundColor: colors.secondary,

    borderRadius: 6,

    paddingHorizontal: spacing.sm,

    paddingVertical: spacing.xs,

  },

  currentBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  popularBadge: {

    position: 'absolute',

    top: spacing.md,

    backgroundColor: colors.primary,

    borderRadius: 6,

    paddingHorizontal: spacing.sm,

    paddingVertical: spacing.xs,

  },

  popularBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  tierName: { ...typography.h3, color: colors.textSecondary },

  tierNameSelected: { color: colors.primary },

  tierPrice: {

    fontSize: 22,

    fontWeight: '800',

    color: colors.textPrimary,

    marginTop: spacing.xs,

    marginBottom: spacing.md,

  },

  tierPriceSelected: { color: colors.primary },

  tierBullets: { gap: spacing.sm },

  bulletRow: { gap: spacing.sm, alignItems: 'flex-start' },

  bulletCheck: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, width: 16, flexShrink: 0 },

  bulletCheckSelected: { color: colors.primary },

  bulletText: { ...typography.caption, fontSize: 14, color: colors.textSecondary, flex: 1, flexShrink: 1 },

  note: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },

});

