import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import { routeAuthenticatedUser } from '../../services/authNavigation';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailOtp'>;

export function EmailOtpScreen({ navigation }: Props) {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!email.includes('@')) {
      Alert.alert(t.enterEmail);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setSent(true);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email',
      });
      if (error) throw error;
      await routeAuthenticatedUser(navigation);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <Text style={styles.title}>{t.signInWithEmail}</Text>
        {!sent ? (
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
            />
            <PrimaryButton label={t.sendOtp} onPress={send} loading={loading} />
          </View>
        ) : (
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
            />
            <PrimaryButton label={t.verify} onPress={verify} loading={loading} />
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
});
