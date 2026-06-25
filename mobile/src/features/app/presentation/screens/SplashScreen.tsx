import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import {
  AuthRoutingError,
  routeAuthenticatedUserAndFlush,
} from '@/core/navigation/authNavigation';
import { useAuth } from '@/core/providers/AuthProvider';
import { ApiError } from '@/core/lib/api';
import { clearSession, hasSession } from '@/core/services/tokenStorage';
import { colors } from '@/core/theme/colors';
import { layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { useLocale } from '@/core/i18n/LocaleContext';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { SectionHint } from '@/shared/widgets/SectionLabel';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { typography } from '@/core/theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { t, isHydrated, hasCompletedLanguageSelection } = useLocale();
  const { isReady } = useAuth();
  const [routeError, setRouteError] = useState<string | undefined>();
  const [retryCount, setRetryCount] = useState(0);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (isHydrated && !hasCompletedLanguageSelection) {
      navigation.replace('LanguageSelection');
    }
  }, [isHydrated, hasCompletedLanguageSelection, navigation]);

  useEffect(() => {
    if (!isReady || !isHydrated || !hasCompletedLanguageSelection) return;
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    let cancelled = false;

    const run = async () => {
      setRouteError(undefined);
      try {
        const sessionExists = await hasSession();
        if (cancelled) return;
        if (sessionExists) {
          await routeAuthenticatedUserAndFlush(navigation);
          return;
        }
        if (!cancelled) navigation.replace('RoleSelection');
      } catch (e) {
        if (cancelled) return;
        bootstrapped.current = false;
        // Check both the top-level error and the wrapped cause for JWT/auth errors
        const isAuthError = (err: unknown): boolean => {
          if (err instanceof ApiError && err.status === 401) return true;
          const msg = err instanceof Error ? err.message : String(err);
          return msg.includes('JWT') || msg.includes('token') || msg.includes('not authenticated') || msg.includes('AuthApiError');
        };
        if (isAuthError(e) || (e instanceof AuthRoutingError && isAuthError(e.cause))) {
          navigation.replace('PhoneOtp');
          return;
        }
        if (e instanceof AuthRoutingError) { setRouteError(e.message); return; }
        setRouteError(t.errorGeneric);
      }
    };

    void run();
    return () => { cancelled = true; };
  }, [isReady, isHydrated, hasCompletedLanguageSelection, retryCount]);

  return (
    <Screen style={styles.screen}>
      <ContentWidth variant="plain" style={styles.flex}>
        <View style={layoutStyles.screenContent}>
          <ScreenHeader title={t.appName} />
          <SectionHint>{t.splashTagline}</SectionHint>

          <View style={styles.center}>
            {routeError ? (
              <View style={styles.errorBlock}>
                <Text style={styles.errorText}>{routeError}</Text>
                <PrimaryButton
                  label={t.retry}
                  onPress={() => {
                    bootstrapped.current = false;
                    setRetryCount((c) => c + 1);
                  }}
                />
                <SecondaryButton
                  label="Sign in again"
                  onPress={async () => {
                    await clearSession();
                    navigation.replace('PhoneOtp');
                  }}
                />
              </View>
            ) : (
              <ActivityIndicator color={colors.primary} style={styles.spinner} />
            )}
          </View>
        </View>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  flex: { flex: 1, backgroundColor: colors.scaffold },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  spinner: { marginTop: spacing.lg },
  errorBlock: { alignItems: 'stretch', gap: spacing.md, width: '100%', maxWidth: 320 },
  errorText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
