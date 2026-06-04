import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { env } from '@/core/config/env';
import { AppBrand } from '@/shared/widgets/AppBrand';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { FieldError } from '@/shared/widgets/FieldError';
import { PhoneNumberField } from '@/shared/widgets/PhoneNumberField';
import { AuthSuccessPulse } from '@/shared/widgets/AuthSuccessPulse';
import { useLocale } from '@/core/i18n/LocaleContext';
import { Screen } from '@/shared/widgets/Screen';
import { ScreenLoading } from '@/shared/widgets/ScreenLoading';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import {
  AuthRoutingError,
  routeAuthenticatedUser,
} from '@/features/auth/data/services/authNavigation';
import { useAuth } from '@/core/providers/AuthProvider';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { useFormattedPhoneInput } from '@/shared/hooks/useFormattedPhoneInput';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { getErrorMessage } from '@/shared/utils/errors';
import { fieldA11yLabel } from '@/shared/utils/a11y';
import { formatPhoneForDisplay } from '@/shared/utils/phone';
import {
  isOtpBypassEnabled,
  sendOtp,
  signInWithVerifiedPhone,
  verifyOtp,
} from '@/features/auth/data/services/twilioVerify';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneOtp'>;

type AuthPhase = 'phone' | 'otp' | 'success';

const SUCCESS_ROUTE_DELAY_MS = 700;

export function PhoneOtpScreen({ navigation }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { session, isReady } = useAuth();
  const routedRef = useRef(false);
  const otpInputRef = useRef<TextInput>(null);
  const [sessionRouting, setSessionRouting] = useState(false);
  const phone = useFormattedPhoneInput();
  const [phase, setPhase] = useState<AuthPhase>('phone');
  const [otp, setOtp] = useState('');
  const [sentPhone, setSentPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

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

  useEffect(() => {
    if (phase === 'otp') {
      const tmr = setTimeout(() => otpInputRef.current?.focus(), 320);
      return () => clearTimeout(tmr);
    }
  }, [phase]);

  const validatePhone = (): string | null => {
    if (!phone.isValid) {
      setPhoneError(
        phone.e164.length > 4 ? t.errPhoneInvalid : t.enterPhone,
      );
      return null;
    }
    return phone.e164;
  };

  const finishAuth = async () => {
    setPhase('success');
    setLoadingMessage(undefined);
    setLoading(false);
    await new Promise((r) => setTimeout(r, SUCCESS_ROUTE_DELAY_MS));
    await routeAuthenticatedUser(navigation);
  };

  const onSend = async () => {
    Keyboard.dismiss();
    const e164 = validatePhone();
    if (!e164) return;

    setPhoneError(undefined);
    setFormError(undefined);
    setLoading(true);
    setLoadingMessage(t.otpSending);
    try {
      if (otpBypass) {
        await signInWithVerifiedPhone(e164);
        await finishAuth();
        return;
      }
      await sendOtp(e164);
      setSentPhone(e164);
      phone.setValue(formatPhoneForDisplay(e164));
      setPhase('otp');
      setOtp('');
    } catch (e) {
      setFormError(
        e instanceof AuthRoutingError
          ? e.message
          : getErrorMessage(e, t.errorGeneric),
      );
    } finally {
      setLoading(false);
      setLoadingMessage(undefined);
    }
  };

  const onVerify = async () => {
    if (!sentPhone || otp.trim().length !== 6) {
      setOtpError(t.otpCode);
      return;
    }
    Keyboard.dismiss();
    setOtpError(undefined);
    setFormError(undefined);
    setLoading(true);
    setLoadingMessage(t.otpVerifying);
    try {
      const ok = await verifyOtp(sentPhone, otp);
      if (!ok) {
        setOtpError(t.errorGeneric);
        return;
      }
      await signInWithVerifiedPhone(sentPhone);
      await finishAuth();
    } catch (e) {
      setFormError(
        e instanceof AuthRoutingError
          ? e.message
          : getErrorMessage(e, t.errorGeneric),
      );
    } finally {
      if (phase !== 'success') {
        setLoading(false);
        setLoadingMessage(undefined);
      }
    }
  };

  if (!isReady || sessionRouting) {
    return (
      <Screen>
        <ScreenLoading message={t.loading} />
      </Screen>
    );
  }

  if (phase === 'success') {
    return (
      <Screen>
        <ContentWidth>
          <AuthSuccessPulse
            title={t.otpVerified}
            subtitle={t.loading}
          />
        </ContentWidth>
      </Screen>
    );
  }

  const showPhoneStep = phase === 'phone' || otpBypass;

  return (
    <Screen>
      <ContentWidth>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? spacing.xxl : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <AppBrand />

            <InfoBanner message={t.accountNotice} />

            {env.showDevOtpBanner && (
              <View style={styles.devBanner}>
                <Text style={styles.devBannerText}>{t.devOtpBanner}</Text>
              </View>
            )}

            {formError ? <InfoBanner message={formError} variant="warning" /> : null}

            {showPhoneStep ? (
              <View style={styles.card}>
                <PhoneNumberField
                  label={t.enterPhone}
                  value={phone.value}
                  onChangeText={(v) => {
                    phone.onChangeText(v);
                    setPhoneError(undefined);
                  }}
                  error={phoneError}
                  showExample
                />
                <PrimaryButton
                  label={otpBypass ? t.continueWithoutOtp : t.sendOtp}
                  onPress={onSend}
                  loading={loading}
                  accessibilityHint={loadingMessage}
                />
                {loading && loadingMessage ? (
                  <Text style={[styles.statusLine, { textAlign: rtl.textAlignCenter }]}>
                    {loadingMessage}
                  </Text>
                ) : null}
                <Pressable
                  onPress={() => navigation.navigate('EmailOtp')}
                  accessibilityRole="link"
                  accessibilityLabel={t.signInWithEmail}
                  accessibilityHint={t.a11ySignInEmail}
                  style={({ pressed }) => pressed && styles.linkPressed}
                >
                  <Text style={styles.emailLink}>{t.signInWithEmail}</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.card}>
                <Text
                  style={[
                    styles.helper,
                    { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
                  ]}
                >
                  {t.codeSentTo}{' '}
                  <Text style={styles.phoneLtr}>
                    {sentPhone ? formatPhoneForDisplay(sentPhone) : ''}
                  </Text>
                </Text>
                <TextInput
                  ref={otpInputRef}
                  style={[
                    styles.input,
                    styles.otp,
                    otpError ? styles.inputError : null,
                  ]}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder={t.otpPlaceholder}
                  placeholderTextColor={colors.placeholder}
                  value={otp}
                  onChangeText={(v) => {
                    setOtp(v.replace(/\D/g, '').slice(0, 6));
                    setOtpError(undefined);
                  }}
                  returnKeyType="done"
                  onSubmitEditing={onVerify}
                  accessibilityLabel={fieldA11yLabel(
                    t.otpCode,
                    otpError ? `${t.a11yFieldInvalid}. ${otpError}` : undefined,
                  )}
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                />
                <FieldError message={otpError} />
                <PrimaryButton label={t.verify} onPress={onVerify} loading={loading} />
                {loading && loadingMessage ? (
                  <Text style={[styles.statusLine, { textAlign: rtl.textAlignCenter }]}>
                    {loadingMessage}
                  </Text>
                ) : null}
                <SecondaryButton
                  label={t.changePhone}
                  onPress={() => {
                    setPhase('phone');
                    setSentPhone(null);
                    setOtp('');
                    phone.reset();
                  }}
                  disabled={loading}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    gap: spacing.lg,
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
  helper: { ...typography.body, color: colors.textSecondary },
  phoneLtr: { writingDirection: 'ltr' },
  statusLine: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.surface,
    minHeight: 48,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  otp: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 22,
    writingDirection: 'ltr',
  },
  emailLink: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  linkPressed: { opacity: 0.7 },
  devBanner: {
    backgroundColor: colors.warning,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  devBannerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
});
