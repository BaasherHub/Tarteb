import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { AppBrand } from '@/shared/widgets/AppBrand';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { FieldError } from '@/shared/widgets/FieldError';
import { useLocale } from '@/core/i18n/LocaleContext';
import { Screen } from '@/shared/widgets/Screen';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import {
  AuthRoutingError,
  routeAuthenticatedUser,
} from '@/features/auth/data/services/authNavigation';
import { useAuth } from '@/core/providers/AuthProvider';
import { colors } from '@/core/theme/colors';
import { getErrorMessage } from '@/shared/utils/errors';
import {
  isOtpBypassEnabled,
  normalizeE164,
  sendOtp,
  signInWithVerifiedPhone,
  verifyOtp,
} from '@/features/auth/data/services/twilioVerify';


type Props = NativeStackScreenProps<RootStackParamList, 'PhoneOtp'>;

const DEFAULT_DIAL = '+971';

export function PhoneOtpScreen({ navigation }: Props) {
  const { t } = useLocale();
  const { session, isReady } = useAuth();
  const routedRef = useRef(false);
  const [sessionRouting, setSessionRouting] = useState(false);
  const [localNumber, setLocalNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sentPhone, setSentPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const fullPhone = normalizeE164(`${DEFAULT_DIAL}${localNumber.replace(/\D/g, '')}`);
  const otpBypass = isOtpBypassEnabled();

  useEffect(() => {
    if (!isReady || !session || routedRef.current) return;
    routedRef.current = true;
    setSessionRouting(true);
    routeAuthenticatedUser(navigation)
      .catch((e) => {
        routedRef.current = false;
        setFormError(
          e instanceof AuthRoutingError
            ? e.message
            : getErrorMessage(e, t.errorGeneric),
        );
      })
      .finally(() => setSessionRouting(false));
  }, [isReady, session, navigation, t.errorGeneric]);

  const onSend = async () => {
    if (!localNumber.trim()) {
      setPhoneError(t.enterPhone);
      return;
    }
    setPhoneError(undefined);
    setFormError(undefined);
    setLoading(true);
    try {
      if (otpBypass) {
        await signInWithVerifiedPhone(fullPhone);
        await routeAuthenticatedUser(navigation);
        return;
      }
      await sendOtp(fullPhone);
      setSentPhone(fullPhone);
    } catch (e) {
      setFormError(
        e instanceof AuthRoutingError
          ? e.message
          : getErrorMessage(e, t.errorGeneric),
      );
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!sentPhone || otp.trim().length !== 6) {
      setOtpError(t.otpCode);
      return;
    }
    setOtpError(undefined);
    setFormError(undefined);
    setLoading(true);
    try {
      const ok = await verifyOtp(sentPhone, otp);
      if (!ok) {
        setOtpError(t.errorGeneric);
        return;
      }
      await signInWithVerifiedPhone(sentPhone);
      await routeAuthenticatedUser(navigation);
    } catch (e) {
      setFormError(
        e instanceof AuthRoutingError
          ? e.message
          : getErrorMessage(e, t.errorGeneric),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isReady || sessionRouting) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ContentWidth>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <AppBrand />

        <InfoBanner message={t.accountNotice} />

        {otpBypass && (
          <View style={styles.devBanner}>
            <Text style={styles.devBannerText}>{t.devOtpBanner}</Text>
          </View>
        )}

        {formError ? <InfoBanner message={formError} variant="warning" /> : null}

        {!sentPhone || otpBypass ? (
          <View style={styles.card}>
            <Text style={styles.helper}>{t.otpHelper}</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.dial}>{DEFAULT_DIAL}</Text>
              <TextInput
                style={[styles.input, phoneError ? styles.inputError : null]}
                keyboardType="phone-pad"
                placeholder={t.phonePlaceholder}
                placeholderTextColor={colors.placeholder}
                value={localNumber}
                onChangeText={(v) => {
                  setLocalNumber(v);
                  setPhoneError(undefined);
                }}
                accessibilityLabel={t.enterPhone}
              />
            </View>
            <FieldError message={phoneError} />
            <PrimaryButton
              label={otpBypass ? t.continueWithoutOtp : t.sendOtp}
              onPress={onSend}
              loading={loading}
            />
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
              style={[styles.input, styles.otp, otpError ? styles.inputError : null]}
              keyboardType="number-pad"
              maxLength={6}
              placeholder={t.otpPlaceholder}
              placeholderTextColor={colors.placeholder}
              value={otp}
              onChangeText={(v) => {
                setOtp(v);
                setOtpError(undefined);
              }}
              accessibilityLabel={t.otpCode}
            />
            <FieldError message={otpError} />
            <PrimaryButton label={t.verify} onPress={onVerify} loading={loading} />
            <SecondaryButton
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
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    minHeight: 48,
  },
  inputError: { borderColor: colors.error },
  otp: { textAlign: 'center', letterSpacing: 8, fontSize: 22 },
  emailLink: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  devBanner: {
    backgroundColor: '#F57C00',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  devBannerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
});
