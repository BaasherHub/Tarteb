import type { NavigationState, PartialState } from '@react-navigation/native';
import type { RootStackParamList } from '@/core/navigation/types';

export const candidateRootRoutes = new Set([
  'CandidateOnboarding',
  'CandidateAdditionalRoles',
  'CandidateShell',
]);

export const employerRootRoutes = new Set([
  'EmployerOnboarding',
  'EmployerShell',
  'CandidateDetail',
]);

type RouteLike = {
  name?: string;
  state?: NavigationState | PartialState<NavigationState>;
};

type StateLike = {
  index?: number;
  routes?: RouteLike[];
};

export function getRootRouteName(state: StateLike | undefined): string | undefined {
  const routes = state?.routes;
  if (!routes?.length) return undefined;
  const index = Math.min(Math.max(state?.index ?? routes.length - 1, 0), routes.length - 1);
  return routes[index]?.name;
}

export function routeGuardTarget(routeName: string | undefined):
  | 'candidate'
  | 'employer'
  | null {
  if (!routeName) return null;
  if (candidateRootRoutes.has(routeName)) return 'candidate';
  if (employerRootRoutes.has(routeName)) return 'employer';
  return null;
}

export function unauthenticatedRouteGuardRedirect(
  routeName: string | undefined,
): keyof RootStackParamList | null {
  return routeGuardTarget(routeName) ? 'PhoneOtp' : null;
}
