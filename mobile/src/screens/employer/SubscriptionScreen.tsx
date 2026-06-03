import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { ContentWidth } from '../../components/ContentWidth';
import { AppBrand } from '../../components/AppBrand';
import { AppIcon } from '../../components/AppIcon';
import { InfoBanner } from '../../components/InfoBanner';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import { useRtlStyles } from '../../hooks/useRtlStyles';
import {
  fetchEmployerAccount,
  hasActiveSubscription,
  monthlyUnlocksRemaining,
  TIER_LABELS,
  TIER_LIMITS,
  TIER_PRICES,
  SubscriptionTier,
} from '../../services/employerSubscription';
import {
  clearSubscriptionPending,
  getSubscriptionPendingAt,
  isSubscriptionPending,
} from '../../services/subscriptionPending';
import { openWhatsAppSubscribe } from '../../utils/whatsapp';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Subscription'>;

const TIERS: SubscriptionTier[] = ['starter', 'business', 'agency'];

const TIER_BULLETS: Record<SubscriptionTier, string[]> = {
  starter: ['5 unlocks / month', 'Phone & WhatsApp contact', 'All job categories'],
  business: ['25 unlocks / month', 'Phone & WhatsApp contact', 'All job categories', 'Priority support'],
  agency: ['Unlimited unlocks', 'Phone & WhatsApp contact', 'All job categories', 'Priority support', 'Multi-role hiring'],
};

export function SubscriptionScreen({ navigation }: Props) {
  const { t, isRtl } = useLocale();
  const rtl = useRtlStyles();
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const [pendingAt, setPendingAt] = useState<Date | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('starter');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('starter');
  const [unlocksUsed, setUnlocksUsed] = useState(0);

  const refresh = useCallback(async () => {
    const account = await fetchEmployerAccount().catch(() => null);
    if (account) {
      setEndsAt(account.subscriptionEndsAt);
      setCurrentTier(account.subscriptionTier);
      setSelectedTier(account.subscriptionTier);
      setUnlocksUsed(account.monthlyUnlocksUsed);
    }
    const pending = await getSubscriptionPendingAt();
    setPendingAt(pending);
    if (account && hasActiveSubscription(account.subscriptionEndsAt)) {
      await clearSubscriptionPending();
      setPendingAt(null);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const active = hasActiveSubscription(endsAt);
  const pending = isSubscriptionPending(pendingAt, active);
  const endsLabel = endsAt
    ? `${endsAt.getDate()}/${endsAt.getMonth() + 1}/${endsAt.getFullYear()}`
    : '';

  const remaining = active
    ? (TIER_LIMITS[currentTier] === null ? 'Unlimited' : `${Math.max(0, (TIER_LIMITS[currentTier] ?? 0) - unlocksUsed)} left this month`)
    : null;

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
    await openWhatsAppSubscribe(contact, selectedTier, TIER_PRICES[selectedTier]);
    const at = await getSubscriptionPendingAt();
    setPendingAt(at);
  };

  return (
    <Screen>
      <ContentWidth>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.back, isRtl && styles.backRtl]}
          accessibilityRole="button"
          accessibilityLabel={t.back}
        >
          <AppIcon
            name={isRtl ? 'chevron-forward' : 'chevron-back'}
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>

        <ScrollView contentContainerStyle={styles.scroll}>
          <AppBrand showTagline={false} centered />

          {active ? (
            <View style={styles.activeCard}>
              <Text style={styles.activeTitle}>{TIER_LABELS[currentTier]} Plan — Active</Text>
              <Text style={styles.activeSub}>{t.subscriptionValidUntil(endsLabel)}</Text>
              {remaining && <Text style={styles.activeRemaining}>{remaining}</Text>}
            </View>
          ) : (
            <Text style={[styles.headline, { textAlign: rtl.textAlignCenter }]}>
              Choose a plan
            </Text>
          )}

          {pending && !active && (
            <InfoBanner message={t.subscriptionPendingHint} variant="warning" />
          )}

          {/* Tier cards */}
          <View style={styles.tiers}>
            {TIERS.map((tier) => {
              const isCurrent = active && tier === currentTier;
              const isSelected = tier === selectedTier;
              return (
                <Pressable
                  key={tier}
                  style={[
                    styles.tierCard,
                    isSelected && styles.tierCardSelected,
                    isCurrent && styles.tierCardCurrent,
                  ]}
                  onPress={() => setSelectedTier(tier)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                  {tier === 'business' && !isCurrent && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>Popular</Text>
                    </View>
                  )}
                  <Text style={[styles.tierName, isSelected && styles.tierNameSelected]}>
                    {TIER_LABELS[tier]}
                  </Text>
                  <Text style={[styles.tierPrice, isSelected && styles.tierPriceSelected]}>
                    {TIER_PRICES[tier]}
                  </Text>
                  <View style={styles.tierBullets}>
                    {TIER_BULLETS[tier].map((b) => (
                      <View key={b} style={styles.bulletRow}>
                        <Text style={[styles.bulletCheck, isSelected && styles.bulletCheckSelected]}>✓</Text>
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {!active && (
            <PrimaryButton
              label={pending ? t.subscribeViaWhatsApp : `Subscribe to ${TIER_LABELS[selectedTier]}`}
              onPress={subscribe}
            />
          )}
          {active && selectedTier !== currentTier && (
            <PrimaryButton
              label={`Switch to ${TIER_LABELS[selectedTier]} via WhatsApp`}
              onPress={subscribe}
            />
          )}

          <Text style={styles.note}>
            Payment confirmed via WhatsApp · Activated within 1 hour · Cancel anytime
          </Text>
        </ScrollView>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { minWidth: 44, minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
  backRtl: { alignSelf: 'flex-end' },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  headline: { ...typography.h2, textAlign: 'center', marginTop: 4 },
  activeCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: `${colors.secondary}15`,
    borderWidth: 1,
    borderColor: `${colors.secondary}40`,
    alignItems: 'center',
    gap: 4,
  },
  activeTitle: { fontSize: 17, fontWeight: '700', color: colors.secondary },
  activeSub: { fontSize: 13, color: colors.textSecondary },
  activeRemaining: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginTop: 4 },
  tiers: { gap: 12 },
  tierCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  tierCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  tierCardCurrent: {
    borderColor: colors.secondary,
    backgroundColor: `${colors.secondary}08`,
  },
  currentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.secondary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currentBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  popularBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  tierName: { fontSize: 17, fontWeight: '700', color: colors.textSecondary },
  tierNameSelected: { color: colors.primary },
  tierPrice: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginTop: 4, marginBottom: 12 },
  tierPriceSelected: { color: colors.primary },
  tierBullets: { gap: 6 },
  bulletRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  bulletCheck: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, width: 16 },
  bulletCheckSelected: { color: colors.primary },
  bulletText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  note: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
