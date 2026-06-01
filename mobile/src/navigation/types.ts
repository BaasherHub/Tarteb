import type { CandidateOnboardingData } from '../types/candidateOnboarding';

export type RootStackParamList = {
  Splash: undefined;
  PhoneOtp: undefined;
  EmailOtp: undefined;
  RoleSelection: undefined;
  EmployerOnboarding: undefined;
  EmployerShell: undefined;
  CandidateOnboarding: { initial?: CandidateOnboardingData };
  CandidateDashboard: undefined;
  CandidateDetail: { candidate: Record<string, unknown> };
  Subscription: undefined;
  Settings: { isCandidate: boolean };
};
