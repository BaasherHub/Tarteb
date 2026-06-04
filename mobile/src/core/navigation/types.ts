import type { CandidateOnboardingData } from '@/features/candidate/domain/types/candidateOnboarding';

export type RootStackParamList = {
  Splash: undefined;
  PhoneOtp: undefined;
  EmailOtp: undefined;
  RoleSelection: undefined;
  EmployerOnboarding: undefined;
  EmployerShell: undefined;
  CandidateOnboarding: { initial?: CandidateOnboardingData };
  CandidateDashboard: undefined;
  CandidateShell: undefined;
  CandidateDetail: { candidateId: string };
  Subscription: undefined;
  Settings: undefined;
};


