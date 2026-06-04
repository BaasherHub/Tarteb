import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { linking } from '@/core/navigation/linking';
import { flushPendingDeepLink } from '@/core/navigation/deepLink';
import { navigationRef } from '@/core/navigation/navigationRef';
import { RootStackParamList } from './types';
import { useLocale } from '@/core/i18n/LocaleContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { t, isRtl } = useLocale();
  const stackAnimation = isRtl ? 'slide_from_left' : 'slide_from_right';

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => flushPendingDeepLink(navigationRef)}
    >
      <Stack.Navigator
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
          name="Subscription"
          component={SubscriptionScreen}
          options={{ headerShown: false, presentation: 'modal' }}
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
import { PhoneOtpScreen } from '@/features/auth/presentation/screens/PhoneOtpScreen';
import { EmailOtpScreen } from '@/features/auth/presentation/screens/EmailOtpScreen';
import { RoleSelectionScreen } from '@/features/auth/presentation/screens/RoleSelectionScreen';
import { EmployerOnboardingScreen } from '@/features/employer/presentation/screens/EmployerOnboardingScreen';
import { EmployerShellScreen } from '@/features/employer/presentation/screens/EmployerShellScreen';
import { CandidateDetailScreen } from '@/features/employer/presentation/screens/CandidateDetailScreen';
import { SubscriptionScreen } from '@/features/employer/presentation/screens/SubscriptionScreen';
import { CandidateOnboardingScreen } from '@/features/candidate/presentation/screens/CandidateOnboardingScreen';
import { CandidateAdditionalRolesScreen } from '@/features/candidate/presentation/screens/CandidateAdditionalRolesScreen';
import { CandidateShellScreen } from '@/features/candidate/presentation/screens/CandidateShellScreen';
import { CandidateDashboardScreen } from '@/features/candidate/presentation/screens/CandidateDashboardScreen';
import { SettingsScreen } from '@/features/settings/presentation/screens/SettingsScreen';
import { PrivacyPolicyScreen } from '@/features/settings/presentation/screens/PrivacyPolicyScreen';
