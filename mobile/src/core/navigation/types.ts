import type { NavigatorScreenParams } from '@react-navigation/native';
import type { CandidateOnboardingData } from '@/features/candidate/domain/types/candidateOnboarding';
import type { EmployerOnboardingData } from '@/features/employer/domain/types/employerOnboarding';

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
  LanguageSelection: undefined;
  PhoneOtp: undefined;
  EmailOtp: undefined;
  RoleSelection: undefined;
  EmployerOnboarding: { initial?: EmployerOnboardingData } | undefined;
  EmployerShell: NavigatorScreenParams<EmployerTabParamList> | undefined;
  CandidateOnboarding: { initial?: CandidateOnboardingData; startStep?: number };
  CandidateAdditionalRoles: undefined;
  CandidateDashboard: undefined;
  CandidateShell: NavigatorScreenParams<CandidateTabParamList> | undefined;
  CandidateDetail: { candidateId: string; hiringRole?: string };
  Subscription: { success?: boolean } | undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
};


