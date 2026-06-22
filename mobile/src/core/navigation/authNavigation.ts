import { RootStackParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';
import {
  clearPendingAccountRole,
  getPendingAccountRole,
  type PendingAccountRole,
} from '@/core/services/pendingAccountRole';

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

export async function routeAuthenticatedUser(navigation: Nav): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) {
    navigation.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
    return;
  }

  let profile: { role: string } | null = null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    profile = data;
  } catch (cause) {
    throw new AuthRoutingError('Could not load your profile. Please try again.', cause);
  }

  if (!profile) {
    const pendingRole = await getPendingAccountRole();
    if (pendingRole) {
      await applyPendingRole(userId, pendingRole);
      return routeAuthenticatedUser(navigation);
    }
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
    return;
  }

  const role = profile.role as string;
  if (role === 'candidate') {
    await routeCandidate(navigation, userId);
  } else if (role === 'employer') {
    await routeEmployer(navigation, userId);
  } else {
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
  }
}

async function applyPendingRole(
  userId: string,
  role: PendingAccountRole,
): Promise<void> {
  const { error } = await supabase.from('profiles').insert({
    user_id: userId,
    role,
  });
  if (error) throw error;
  await clearPendingAccountRole();
}

async function routeCandidate(navigation: Nav, userId: string): Promise<void> {
  try {
    const { data: candidate, error } = await supabase
      .from('candidates')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

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

async function routeEmployer(navigation: Nav, userId: string): Promise<void> {
  try {
    const { data: employer, error } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

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
