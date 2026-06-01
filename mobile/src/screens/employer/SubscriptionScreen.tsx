import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import {
  fetchEmployerAccount,
  hasActiveSubscription,
} from '../../services/employerSubscription';
import { openWhatsAppSubscribe } from '../../utils/whatsapp';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Subscription'>;

export function SubscriptionScreen({}: Props) {
  const { t } = useLocale();
  const [endsAt, setEndsAt] = useState<Date | null>(null);

  useEffect(() => {
    fetchEmployerAccount()
      .then((a) => setEndsAt(a.subscriptionEndsAt))
      .catch(() => setEndsAt(null));
  }, []);

  const active = hasActiveSubscription(endsAt);
  const endsLabel = endsAt
    ? `${endsAt.getDate()}/${endsAt.getMonth() + 1}/${endsAt.getFullYear()}`
    : '';

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.price}>{t.subscriptionPrice}</Text>
        <Text style={[styles.status, active && styles.statusActive]}>
          {active ? `Valid until ${endsLabel}` : t.subscriptionRequired}
        </Text>
        <Text style={styles.body}>
          Unlimited contact unlocks while your plan is active. Payment is confirmed via
          WhatsApp; we activate within 1 hour.
        </Text>
        {!active && (
          <PrimaryButton
            label={t.subscribeViaWhatsApp}
            onPress={() => openWhatsAppSubscribe('employer')}
          />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 24, gap: 16 },
  price: { fontSize: 28, fontWeight: '700' },
  status: { fontSize: 16, color: colors.textSecondary },
  statusActive: { color: colors.secondary, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, color: colors.textSecondary },
});
