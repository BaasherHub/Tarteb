import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useLocale } from '@/core/i18n/LocaleContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { t } = useLocale();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateDetail"
          component={CandidateDetailScreen}
          options={{ title: t.browse }}
        />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateOnboarding"
          component={CandidateOnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateShell"
          component={CandidateShellScreen}
          options={{ headerShown: false }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { SplashScreen } from '@/features/app/presentation/screens/SplashScreen';
import { PhoneOtpScreen } from '@/features/auth/presentation/screens/PhoneOtpScreen';
import { EmailOtpScreen } from '@/features/auth/presentation/screens/EmailOtpScreen';
import { RoleSelectionScreen } from '@/features/auth/presentation/screens/RoleSelectionScreen';
import { CandidateOnboardingScreen } from '@/features/candidate/presentation/screens/CandidateOnboardingScreen';
import { CandidateDashboardScreen } from '@/features/candidate/presentation/screens/CandidateDashboardScreen';
import { CandidateShellScreen } from '@/features/candidate/presentation/screens/CandidateShellScreen';
import { SettingsScreen } from '@/features/settings/presentation/screens/SettingsScreen';
import { CandidateDetailScreen } from '@/features/employer/presentation/screens/CandidateDetailScreen';
import { SubscriptionScreen } from '@/features/employer/presentation/screens/SubscriptionScreen';
import { EmployerOnboardingScreen } from '@/features/employer/presentation/screens/EmployerOnboardingScreen';
import { EmployerShellScreen } from '@/features/employer/presentation/screens/EmployerShellScreen';

