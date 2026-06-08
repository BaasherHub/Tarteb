import React, { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, getStateFromPath as defaultGetStateFromPath } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { linking } from '@/core/navigation/linking';
import { flushPendingDeepLink } from '@/core/navigation/deepLink';
import { navigationRef } from '@/core/navigation/navigationRef';
import { RootStackParamList } from './types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { t, isRtl, isHydrated, hasCompletedLanguageSelection } = useLocale();
  const stackAnimation = isRtl ? 'slide_from_left' : 'slide_from_right';

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const initialRouteName = hasCompletedLanguageSelection ? 'Splash' : 'LanguageSelection';

  const gatedLinking = useMemo((): LinkingOptions<RootStackParamList> => {
    if (hasCompletedLanguageSelection) return linking;

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

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={gatedLinking}
      onReady={() => flushPendingDeepLink(navigationRef)}
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
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
          options={{ headerShown: false, animation: 'fade' }}
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
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="CandidateDetail"
          component={CandidateDetailScreen}
          options={{ title: t.candidateProfileTitle }}
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
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="CandidateDashboard"
          component={CandidateDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
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
import { CandidateDashboardScreen } from '@/features/candidate/presentation/screens/CandidateDashboardScreen';
import { SettingsScreen } from '@/features/settings/presentation/screens/SettingsScreen';
import { PrivacyPolicyScreen } from '@/features/settings/presentation/screens/PrivacyPolicyScreen';

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.scaffold,
  },
});
