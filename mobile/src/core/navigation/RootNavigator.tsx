import React, { useCallback, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, getStateFromPath as defaultGetStateFromPath } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { linking } from '@/core/navigation/linking';
import { stashPendingDeepLink } from '@/core/navigation/deepLink';
import { navigationRef } from '@/core/navigation/navigationRef';
import { RootStackParamList } from './types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useAuth } from '@/core/providers/AuthProvider';
import { fetchAccountRole } from '@/core/navigation/deepLinkRole';
import {
  getRootRouteName,
  routeGuardTarget,
  unauthenticatedRouteGuardRedirect,
} from '@/core/navigation/routeGuard';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isRtl, isHydrated, hasCompletedLanguageSelection } = useLocale();
  const { session, isReady: authReady } = useAuth();
  const reducedMotion = useReducedMotion();
  const stackAnimation = reducedMotion
    ? 'none'
    : isRtl
      ? 'slide_from_left'
      : 'slide_from_right';
  const fadeAnimation = reducedMotion ? 'none' : 'fade';

  const guardCurrentRoute = useCallback(async () => {
    if (!authReady || !navigationRef.isReady()) return;
    const routeName = getRootRouteName(navigationRef.getRootState());
    const target = routeGuardTarget(routeName);

    const unauthenticatedRedirect = !session
      ? unauthenticatedRouteGuardRedirect(routeName)
      : null;
    if (unauthenticatedRedirect) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: unauthenticatedRedirect }],
      });
      return;
    }
    if (!session || !target) return;

    try {
      const role = await fetchAccountRole();
      if (!role) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'RoleSelection' }],
        });
      } else if (target === 'candidate' && role !== 'candidate') {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'EmployerShell' }],
        });
      } else if (target === 'employer' && role !== 'employer') {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'CandidateShell' }],
        });
      }
    } catch {
      // Preserve the current route during transient account-role failures.
    }
  }, [authReady, session]);

  useEffect(() => {
    void guardCurrentRoute();
  }, [guardCurrentRoute]);

  const gatedLinking = useMemo((): LinkingOptions<RootStackParamList> => {
    if (hasCompletedLanguageSelection) {
      return {
        ...linking,
        getStateFromPath(path, options) {
          if (path && path !== '/' && path !== '') {
            const normalized = path.startsWith('/') ? path : `/${path}`;
            stashPendingDeepLink(`tarteb:/${normalized}`);
            return { routes: [{ name: 'Splash' }], index: 0 };
          }
          return defaultGetStateFromPath(path, options);
        },
      };
    }

    return {
      ...linking,
      config: {
        screens: {
          LanguageSelection: '',
        },
      },
      getStateFromPath(path, options) {
        const state = defaultGetStateFromPath(path, options);
        if (state?.routes[0]?.name === 'LanguageSelection') return state;
        return { routes: [{ name: 'LanguageSelection' as const }] };
      },
    };
  }, [hasCompletedLanguageSelection]);

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const initialRouteName = hasCompletedLanguageSelection ? 'Splash' : 'LanguageSelection';

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={gatedLinking}
      onReady={() => void guardCurrentRoute()}
      onStateChange={() => void guardCurrentRoute()}
    >
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShadowVisible: false,
          animation: stackAnimation,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false, animation: fadeAnimation }}
        />
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
          options={{ headerShown: false, animation: fadeAnimation }}
        />
        <Stack.Screen
          name="PhoneOtp"
          component={PhoneOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailOtp"
          component={EmailOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmployerOnboarding"
          component={EmployerOnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmployerShell"
          component={EmployerShellScreen}
          options={{ headerShown: false, animation: fadeAnimation }}
        />
        <Stack.Screen
          name="CandidateDetail"
          component={CandidateDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateOnboarding"
          component={CandidateOnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateAdditionalRoles"
          component={CandidateAdditionalRolesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateShell"
          component={CandidateShellScreen}
          options={{ headerShown: false, animation: fadeAnimation }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { SplashScreen } from '@/features/app/presentation/screens/SplashScreen';
import { LanguageSelectionScreen } from '@/features/auth/presentation/screens/LanguageSelectionScreen';
import { PhoneOtpScreen } from '@/features/auth/presentation/screens/PhoneOtpScreen';
import { EmailOtpScreen } from '@/features/auth/presentation/screens/EmailOtpScreen';
import { RoleSelectionScreen } from '@/features/auth/presentation/screens/RoleSelectionScreen';
import { EmployerOnboardingScreen } from '@/features/employer/presentation/screens/EmployerOnboardingScreen';
import { EmployerShellScreen } from '@/features/employer/presentation/screens/EmployerShellScreen';
import { CandidateDetailScreen } from '@/features/employer/presentation/screens/CandidateDetailScreen';
import { CandidateOnboardingScreen } from '@/features/candidate/presentation/screens/CandidateOnboardingScreen';
import { CandidateAdditionalRolesScreen } from '@/features/candidate/presentation/screens/CandidateAdditionalRolesScreen';
import { CandidateShellScreen } from '@/features/candidate/presentation/screens/CandidateShellScreen';
import { PrivacyPolicyScreen } from '@/features/settings/presentation/screens/PrivacyPolicyScreen';

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.scaffold,
  },
});
