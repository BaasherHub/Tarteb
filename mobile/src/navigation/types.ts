export type RootStackParamList = {
  Splash: undefined;
  PhoneOtp: undefined;
  RoleSelection: undefined;
  EmployerOnboarding: undefined;
  EmployerShell: undefined;
  CandidateOnboarding: undefined;
  CandidateDashboard: undefined;
  CandidateDetail: { candidate: Record<string, unknown> };
  Subscription: undefined;
  Settings: { isCandidate: boolean };
};
