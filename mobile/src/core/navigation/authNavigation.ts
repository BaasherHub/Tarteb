import { RootStackParamList } from '@/core/navigation/types';
import { api } from '@/core/lib/api';
import { getCurrentUserId } from '@/core/services/tokenStorage';
import {
  clearPendingAccountRole,
  getPendingAccountRole,
  type PendingAccountRole,
} from '@/core/services/pendingAccountRole';
import { flushPendingDeepLink } from '@/core/navigation/deepLink';
import { navigationRef } from '@/core/navigation/navigationRef';

export class AuthRoutingError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AuthRoutingError';
  }
}

type Nav = {
  reset: (state: {
    index: number;
    routes: { name: keyof RootStackParamList }[];
  }) => void;
};

export async function routeAuthenticatedUser(navigation: Nav, _depth = 0): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    navigation.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
    return;
  }

  let role: string | null = null;

  try {
    const result = await api.profiles.me();
    role = result?.profile?.role ?? null;
  } catch (cause) {
    throw new AuthRoutingError('Could not load your profile. Please try again.', cause);
  }

  if (!role) {
    const pendingRole = await getPendingAccountRole();
    if (pendingRole) {
      await applyPendingRole(pendingRole);
      if (_depth < 1) return routeAuthenticatedUser(navigation, _depth + 1);
      navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
      return;
    }
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
    return;
  }

  if (role === 'candidate') {
    await routeCandidate(navigation);
  } else if (role === 'employer') {
    await routeEmployer(navigation);
  } else {
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
  }
}

export async function routeAuthenticatedUserAndFlush(navigation: Nav): Promise<void> {
  await routeAuthenticatedUser(navigation);
  setTimeout(() => flushPendingDeepLink(navigationRef), 0);
}

async function applyPendingRole(role: PendingAccountRole): Promise<void> {
  try {
    await api.profiles.upsert({ role });
  } catch (cause) {
    throw new AuthRoutingError('Could not save your role. Please try again.', cause);
  }
  await clearPendingAccountRole();
}

async function routeCandidate(navigation: Nav): Promise<void> {
  try {
    const { candidate } = await api.candidates.me();
    if (candidate) {
      navigation.reset({ index: 0, routes: [{ name: 'CandidateShell' }] });
    } else {
      // Onboarding not yet complete — keep RoleSelection in the back stack so
      // the user can go back and change their role before they finish.
      navigation.reset({
        index: 1,
        routes: [{ name: 'RoleSelection' }, { name: 'CandidateOnboarding' }],
      });
    }
  } catch (cause) {
    throw new AuthRoutingError('Could not load candidate profile.', cause);
  }
}

async function routeEmployer(navigation: Nav): Promise<void> {
  try {
    const { employer } = await api.employers.me();
    if (employer) {
      navigation.reset({ index: 0, routes: [{ name: 'EmployerShell' }] });
    } else {
      navigation.reset({
        index: 1,
        routes: [{ name: 'RoleSelection' }, { name: 'EmployerOnboarding' }],
      });
    }
  } catch (cause) {
    throw new AuthRoutingError('Could not load employer profile.', cause);
  }
}
