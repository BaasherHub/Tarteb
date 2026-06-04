import { RootStackParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';

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
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
    return;
  }

  const role = profile.role as string;
  if (role === 'candidate') {
    await routeCandidate(navigation, userId);
  } else {
    await routeEmployer(navigation, userId);
  }
}

async function routeCandidate(navigation: Nav, userId: string): Promise<void> {
  try {
    const { data: candidate, error } = await supabase
      .from('candidates')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    navigation.reset({
      index: 0,
      routes: [
        {
          name: candidate ? 'CandidateShell' : 'CandidateOnboarding',
        },
      ],
    });
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

    navigation.reset({
      index: 0,
      routes: [
        {
          name: employer ? 'EmployerShell' : 'EmployerOnboarding',
        },
      ],
    });
  } catch (cause) {
    throw new AuthRoutingError('Could not load employer profile.', cause);
  }
}
