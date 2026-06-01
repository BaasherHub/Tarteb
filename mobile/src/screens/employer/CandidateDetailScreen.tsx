import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import {
  fetchEmployerAccount,
  hasActiveSubscription,
} from '../../services/employerSubscription';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateDetail'>;

export function CandidateDetailScreen({ route, navigation }: Props) {
  const { t } = useLocale();
  const [candidate, setCandidate] = useState(route.params.candidate);
  const [loading, setLoading] = useState(false);

  const phone = candidate.phone as string | undefined;
  const whatsapp = candidate.whatsapp as string | undefined;
  const unlocked = phone != null;

  const unlock = async () => {
    const account = await fetchEmployerAccount();
    if (!hasActiveSubscription(account.subscriptionEndsAt)) {
      navigation.navigate('Subscription');
      return;
    }

    setLoading(true);
    try {
      await supabase.rpc('unlock_candidate', {
        p_candidate_id: candidate.id,
      });
      const { data } = await supabase
        .from('candidate_browse')
        .select('*')
        .eq('id', candidate.id)
        .single();
      if (data) setCandidate(data as Record<string, unknown>);
      Alert.alert(t.contactUnlocked);
    } catch (e) {
      const msg = e instanceof Error ? e.message : t.errorGeneric;
      if (msg.toLowerCase().includes('subscription')) {
        navigation.navigate('Subscription');
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {candidate.photo_url ? (
        <Image source={{ uri: String(candidate.photo_url) }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPh]} />
      )}
      <Text style={styles.name}>{String(candidate.name ?? '')}</Text>
      <Text style={styles.role}>{String(candidate.role ?? '')}</Text>
      <Text style={styles.line}>{String(candidate.location ?? '')}</Text>

      {unlocked ? (
        <View style={styles.actions}>
          {phone && (
            <PrimaryButton label="Call" onPress={() => Linking.openURL(`tel:${phone}`)} />
          )}
          {whatsapp && (
            <PrimaryButton
              label="WhatsApp"
              onPress={() =>
                Linking.openURL(
                  `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
                )
              }
            />
          )}
        </View>
      ) : (
        <PrimaryButton label={t.unlockContact} onPress={unlock} loading={loading} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.scaffold },
  content: { padding: 20, alignItems: 'center' },
  photo: { width: 160, height: 160, borderRadius: 16 },
  photoPh: { backgroundColor: `${colors.primary}15` },
  name: { fontSize: 24, fontWeight: '700', marginTop: 16 },
  role: { fontSize: 18, marginTop: 8 },
  line: { color: colors.textSecondary, marginTop: 8 },
  actions: { width: '100%', gap: 12, marginTop: 24 },
});
