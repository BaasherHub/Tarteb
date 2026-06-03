import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { PhoneOtpScreen } from '../screens/auth/PhoneOtpScreen';
import { EmailOtpScreen } from '../screens/auth/EmailOtpScreen';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { EmployerOnboardingScreen } from '../screens/employer/EmployerOnboardingScreen';
import { EmployerShellScreen } from '../screens/employer/EmployerShellScreen';
import { CandidateDetailScreen } from '../screens/employer/CandidateDetailScreen';
import { SubscriptionScreen } from '../screens/employer/SubscriptionScreen';
import { CandidateOnboardingScreen } from '../screens/candidate/CandidateOnboardingScreen';
import { CandidateDashboardScreen } from '../screens/candidate/CandidateDashboardScreen';
import { CandidateShellScreen } from '../screens/candidate/CandidateShellScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useLocale } from '../i18n/LocaleContext';

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
