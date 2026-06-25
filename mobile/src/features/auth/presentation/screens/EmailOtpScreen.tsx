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


import {

  AuthRoutingError,

  routeAuthenticatedUserAndFlush,

} from '@/features/auth/data/services/authNavigation';

import { colors } from '@/core/theme/colors';

import { layout } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';

import { typography } from '@/core/theme/typography';

import { getErrorMessage } from '@/shared/utils/errors';

import { useRtlStyles } from '@/core/hooks/useRtlStyles';

import { useLocale } from '@/core/i18n/LocaleContext';

import { AppBrand } from '@/shared/widgets/AppBrand';

import { PrimaryButton } from '@/shared/widgets/PrimaryButton';

import { Screen } from '@/shared/widgets/Screen';
import { ScreenLoading } from '@/shared/widgets/ScreenLoading';

import { ContentWidth } from '@/shared/widgets/ContentWidth';

import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

import { InfoBanner } from '@/shared/widgets/InfoBanner';

import { FormField } from '@/shared/widgets/FormField';

import { OtpCodeField } from '@/shared/widgets/OtpCodeField';

import { AuthSuccessPulse } from '@/shared/widgets/AuthSuccessPulse';

import { AUTH_SUCCESS_ROUTE_DELAY_MS } from '@/shared/constants/authTiming';
import { useAuth } from '@/core/providers/AuthProvider';



type Props = NativeStackScreenProps<RootStackParamList, 'EmailOtp'>;



type AuthPhase = 'email' | 'otp' | 'success';



export function EmailOtpScreen({ navigation }: Props) {

  const { t } = useLocale();

  const rtl = useRtlStyles();

  const { session, isReady } = useAuth();

  const routedRef = useRef(false);
  const submittingRef = useRef(false);

  const otpInputRef = useRef<TextInput>(null);

  const [phase, setPhase] = useState<AuthPhase>('email');

  const [email, setEmail] = useState('');

  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();

  const [emailError, setEmailError] = useState<string | undefined>();

  const [otpError, setOtpError] = useState<string | undefined>();

  const [formError, setFormError] = useState<string | undefined>();

  const [sessionRouting, setSessionRouting] = useState(false);

  useEffect(() => {
    if (!isReady || !session || routedRef.current || submittingRef.current) return;
    routedRef.current = true;
    setSessionRouting(true);
    routeAuthenticatedUserAndFlush(navigation)
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

  const finishAuth = async () => {

    setPhase('success');

    setLoadingMessage(undefined);

    setLoading(false);

    await new Promise((r) => setTimeout(r, AUTH_SUCCESS_ROUTE_DELAY_MS));

    await routeAuthenticatedUserAndFlush(navigation);

  };



  const send = async () => {

    Keyboard.dismiss();

    const trimmed = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {

      setEmailError(t.errEmailInvalid);

      return;

    }

    setEmailError(undefined);

    setFormError(undefined);

    setLoading(true);

    setLoadingMessage(t.otpSending);

    try {

      throw new Error('Email sign-in is not supported');

      setPhase('otp');

      setOtp('');

    } catch (e) {

      setFormError(getErrorMessage(e, t.errorGeneric));

    } finally {

      setLoading(false);

      setLoadingMessage(undefined);

    }

  };



  const verify = async (codeOverride?: string) => {

    const code = (codeOverride ?? otp).trim();

    if (code.length !== 6) {

      setOtpError(t.otpCode);

      return;

    }

    if (loading) return;

    Keyboard.dismiss();

    setOtpError(undefined);

    setFormError(undefined);

    setLoading(true);

    setLoadingMessage(t.otpVerifying);
    submittingRef.current = true;

    try {

      throw new Error('Email sign-in is not supported');

      await finishAuth();

    } catch (e) {

      const msg =

        e instanceof AuthRoutingError

          ? e.message

          : getErrorMessage(e, t.errorGeneric);

      setFormError(msg);

    } finally {
      submittingRef.current = false;

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

          <AppBrand showTagline={false} />

          <AuthSuccessPulse

            title={t.otpVerifiedEmail}

            subtitle={t.otpSuccessSubtitle}

          />

        </ContentWidth>

      </Screen>

    );

  }



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

            <AppBrand showTagline={false} />

            <Text style={[styles.title, { textAlign: rtl.textAlignCenter }]}>

              {t.signInWithEmail}

            </Text>



            <InfoBanner message={t.accountNotice} />



            {formError ? <InfoBanner message={formError} variant="warning" /> : null}



            {phase === 'email' ? (

              <View style={styles.card}>

                <Text style={[styles.stepHint, { textAlign: rtl.textAlignCenter }]}>

                  {t.otpHelper}

                </Text>

                <FormField

                  label={t.enterEmail}

                  required

                  value={email}

                  onChangeText={(v) => {

                    setEmail(v);

                    setEmailError(undefined);

                  }}

                  keyboardType="email-address"

                  autoCapitalize="none"

                  error={emailError}

                />

                <PrimaryButton label={t.sendOtp} onPress={send} loading={loading} />

                {loading && loadingMessage ? (

                  <Text style={[styles.statusLine, { textAlign: rtl.textAlignCenter }]}>

                    {loadingMessage}

                  </Text>

                ) : null}

                <Pressable

                  onPress={() => navigation.replace('PhoneOtp')}

                  accessibilityRole="link"

                  accessibilityLabel={t.signInWithPhone}

                  accessibilityHint={t.a11yBackHint}

                  android_ripple={{ color: 'rgba(19,88,206,0.1)', borderless: true }}

                  style={({ pressed }) => pressed && styles.linkPressed}

                >

                  <Text style={styles.link}>{t.signInWithPhone}</Text>

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

                  {t.codeSentTo} {email.trim()}

                </Text>

                <OtpCodeField

                  value={otp}

                  onChange={(digits) => {
                    setOtp(digits);
                    setOtpError(undefined);
                  }}

                  error={otpError}

                  inputRef={otpInputRef}

                  autoFocus

                  disabled={loading}

                  onComplete={(code) => void verify(code)}

                />

                <PrimaryButton

                  label={t.verify}

                  onPress={() => void verify()}

                  loading={loading}

                />

                {loading && loadingMessage ? (

                  <Text style={[styles.statusLine, { textAlign: rtl.textAlignCenter }]}>

                    {loadingMessage}

                  </Text>

                ) : null}

                <Pressable

                  onPress={send}

                  disabled={loading}

                  accessibilityRole="button"

                  accessibilityLabel={t.resendOtp}

                  style={({ pressed }) => [

                    styles.resendWrap,

                    (pressed || loading) && styles.linkPressed,

                  ]}

                >

                  <Text style={styles.link}>{t.resendOtp}</Text>

                </Pressable>

                <SecondaryButton

                  label={t.changeEmail}

                  onPress={() => {

                    setPhase('email');

                    setOtp('');

                    setOtpError(undefined);

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

  title: {

    ...typography.h1,

    marginBottom: spacing.lg,

  },

  stepHint: {

    ...typography.caption,

    color: colors.textSecondary,

    marginBottom: -spacing.sm,

  },

  helper: { ...typography.body, color: colors.textSecondary },

  statusLine: {

    ...typography.caption,

    color: colors.textSecondary,

    marginTop: -spacing.sm,

  },

  card: {

    backgroundColor: colors.surface,

    borderRadius: layout.cardRadius,

    padding: layout.cardPadding,

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

  link: {

    textAlign: 'center',

    color: colors.primary,

    fontWeight: '600',

    fontSize: typography.body.fontSize,

    lineHeight: typography.body.lineHeight,

  },

  resendWrap: { alignSelf: 'center' },

  linkPressed: { opacity: 0.7 },

});


