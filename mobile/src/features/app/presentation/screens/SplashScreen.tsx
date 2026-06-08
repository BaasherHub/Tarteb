import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import {
  AuthRoutingError,
  routeAuthenticatedUser,
} from '@/core/navigation/authNavigation';
import { useAuth } from '@/core/providers/AuthProvider';
import { flushPendingDeepLink } from '@/core/navigation/deepLink';
import { navigationRef } from '@/core/navigation/navigationRef';
import { supabase } from '@/core/lib/supabase';
import { colors } from '@/core/theme/colors';
import { layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { SectionHint } from '@/shared/widgets/SectionLabel';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { t, isHydrated, hasCompletedLanguageSelection } = useLocale();
  const rtl = useRtlStyles();
  const { isReady } = useAuth();
  const [routeError, setRouteError] = useState<string | undefined>();
  const bootstrapped = useRef(false);

  const bootstrapRoute = async () => {
    setRouteError(undefined);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session) {
        await routeAuthenticatedUser(navigation);
        flushPendingDeepLink(navigationRef);
        return;
      }
      navigation.replace('RoleSelection');
    } catch (e) {
      bootstrapped.current = false;
      if (e instanceof AuthRoutingError) {
        setRouteError(e.message);
        return;
      }
      setRouteError(t.errorGeneric);
    }
  };

  useEffect(() => {
    if (isHydrated && !hasCompletedLanguageSelection) {
      navigation.replace('LanguageSelection');
    }
  }, [isHydrated, hasCompletedLanguageSelection, navigation]);

  useEffect(() => {
    if (!isReady || !isHydrated || !hasCompletedLanguageSelection) return;
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void bootstrapRoute();
  }, [isReady, isHydrated, hasCompletedLanguageSelection]);

  return (
    <Screen style={styles.screen}>
      <ContentWidth variant="plain" style={styles.flex}>
        <View style={layoutStyles.screenContent}>
          <ScreenHeader title={t.appName} />
          <SectionHint>{t.splashTagline}</SectionHint>

          <View style={styles.center}>
            {routeError ? (
              <View style={styles.errorBlock}>
                <Text style={[styles.errorText, { textAlign: rtl.textAlignCenter }]}>
                  {routeError}
                </Text>
                <Pressable
                  style={styles.retryBtn}
                  onPress={() => {
                    bootstrapped.current = false;
                    void bootstrapRoute();
                  }}
                >
                  <Text style={styles.retryText}>{t.retry}</Text>
                </Pressable>
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
  errorBlock: { alignItems: 'center', gap: spacing.md },
  errorText: { color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
  retryBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
