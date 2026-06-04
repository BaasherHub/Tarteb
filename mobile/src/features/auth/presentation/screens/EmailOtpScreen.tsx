import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';
import {
  AuthRoutingError,
  routeAuthenticatedUser,
} from '@/features/auth/data/services/authNavigation';
import { colors } from '@/core/theme/colors';
import { getErrorMessage } from '@/shared/utils/errors';

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
      Alert.alert(t.errorTitle, getErrorMessage(e, t.errorGeneric));
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
      const msg =
        e instanceof AuthRoutingError
          ? e.message
          : getErrorMessage(e, t.errorGeneric);
      Alert.alert(t.errorTitle, msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ContentWidth>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <AppBrand showTagline={false} />
          <Text style={styles.title}>{t.signInWithEmail}</Text>
          {!sent ? (
            <View style={styles.card}>
              <Text style={styles.label}>{t.enterEmail}</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder={t.emailPlaceholder}
              />
              <PrimaryButton label={t.sendOtp} onPress={send} loading={loading} />
              <Pressable onPress={() => navigation.navigate('PhoneOtp')}>
                <Text style={styles.link}>{t.signInWithPhone}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.helper}>
                {t.codeSentTo} {email.trim()}
              </Text>
              <TextInput
                style={[styles.input, styles.otp]}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="000000"
              />
              <PrimaryButton label={t.verify} onPress={verify} loading={loading} />
              <SecondaryButton
                label={t.changeEmail}
                onPress={() => {
                  setSent(false);
                  setOtp('');
                }}
                disabled={loading}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  label: { color: colors.textSecondary, marginBottom: 6 },
  helper: { color: colors.textSecondary, marginBottom: 8 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  otp: { textAlign: 'center', letterSpacing: 8, fontSize: 22 },
  link: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
  },
});

import { AppBrand } from '@/shared/widgets/AppBrand';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { useLocale } from '@/core/i18n/LocaleContext';

