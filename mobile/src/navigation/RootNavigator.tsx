import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { PhoneOtpScreen } from '../screens/auth/PhoneOtpScreen';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { EmployerOnboardingScreen } from '../screens/employer/EmployerOnboardingScreen';
import { EmployerShellScreen } from '../screens/employer/EmployerShellScreen';
import { CandidateDetailScreen } from '../screens/employer/CandidateDetailScreen';
import { SubscriptionScreen } from '../screens/employer/SubscriptionScreen';
import { CandidateOnboardingScreen } from '../screens/candidate/CandidateOnboardingScreen';
import { CandidateDashboardScreen } from '../screens/candidate/CandidateDashboardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
        }}
      >
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
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{ title: 'Tarteb' }}
        />
        <Stack.Screen
          name="EmployerOnboarding"
          component={EmployerOnboardingScreen}
          options={{ title: 'Company' }}
        />
        <Stack.Screen
          name="EmployerShell"
          component={EmployerShellScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateDetail"
          component={CandidateDetailScreen}
          options={{ title: 'Candidate' }}
        />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{ title: 'Subscription' }}
        />
        <Stack.Screen
          name="CandidateOnboarding"
          component={CandidateOnboardingScreen}
          options={{ title: 'Your profile' }}
        />
        <Stack.Screen
          name="CandidateDashboard"
          component={CandidateDashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
