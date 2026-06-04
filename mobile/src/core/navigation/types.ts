import type { NavigatorScreenParams } from '@react-navigation/native';
import type { CandidateOnboardingData } from '@/features/candidate/domain/types/candidateOnboarding';

export type EmployerTabParamList = {
  BrowseTab: undefined;
  UnlocksTab: undefined;
  SettingsTab: undefined;
};

export type CandidateTabParamList = {
  HomeTab: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  PhoneOtp: undefined;
  EmailOtp: undefined;
  RoleSelection: undefined;
  EmployerOnboarding: undefined;
  EmployerShell: NavigatorScreenParams<EmployerTabParamList> | undefined;
  CandidateOnboarding: { initial?: CandidateOnboardingData };
  CandidateDashboard: undefined;
  CandidateShell: NavigatorScreenParams<CandidateTabParamList> | undefined;
  CandidateDetail: { candidateId: string };
  Subscription: { success?: boolean } | undefined;
  Settings: undefined;
};


