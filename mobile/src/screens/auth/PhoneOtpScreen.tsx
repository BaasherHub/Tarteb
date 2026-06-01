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
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import {
  normalizeE164,
  sendOtp,
  signInWithVerifiedPhone,
  verifyOtp,
} from '../../services/twilioVerify';
import { routeAuthenticatedUser } from '../../services/authNavigation';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneOtp'>;

const DEFAULT_DIAL = '+971';

export function PhoneOtpScreen({ navigation }: Props) {
  const { t } = useLocale();
  const [localNumber, setLocalNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sentPhone, setSentPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fullPhone = normalizeE164(`${DEFAULT_DIAL}${localNumber.replace(/\D/g, '')}`);

  const onSend = async () => {
    if (!localNumber.trim()) {
      Alert.alert(t.enterPhone);
      return;
    }
    setLoading(true);
    try {
      await sendOtp(fullPhone);
      setSentPhone(fullPhone);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!sentPhone || otp.trim().length !== 6) {
      Alert.alert(t.otpCode, 'Enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const ok = await verifyOtp(sentPhone, otp);
      if (!ok) {
        Alert.alert('Error', 'Invalid or expired code');
        return;
      }
      await signInWithVerifiedPhone(sentPhone);
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
        <Text style={styles.title}>{t.welcomeToTarteb}</Text>
        <Text style={styles.sub}>{t.splashTagline}</Text>

        {!sentPhone ? (
          <View style={styles.card}>
            <Text style={styles.helper}>{t.otpHelper}</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.dial}>{DEFAULT_DIAL}</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="501234567"
                value={localNumber}
                onChangeText={setLocalNumber}
              />
            </View>
            <PrimaryButton label={t.sendOtp} onPress={onSend} loading={loading} />
            <Pressable onPress={() => navigation.navigate('EmailOtp')}>
              <Text style={styles.emailLink}>{t.signInWithEmail}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.helper}>
              {t.codeSentTo} {sentPhone}
            </Text>
            <TextInput
              style={[styles.input, styles.otp]}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
            />
            <PrimaryButton label={t.verify} onPress={onVerify} loading={loading} />
            <PrimaryButton
              label={t.changePhone}
              onPress={() => {
                setSentPhone(null);
                setOtp('');
              }}
              disabled={loading}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingTop: 24 },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  sub: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
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
  helper: { color: colors.textSecondary },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dial: { fontSize: 16, fontWeight: '600' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  otp: { textAlign: 'center', letterSpacing: 8, fontSize: 22 },
  emailLink: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
});
