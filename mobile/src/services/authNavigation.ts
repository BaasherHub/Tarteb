import { RootStackParamList } from '../navigation/types';
import { supabase } from '../lib/supabase';

type Nav = {
  reset: (state: {
    index: number;
    routes: { name: keyof RootStackParamList }[];
  }) => void;
};

export async function routeAuthenticatedUser(navigation: Nav): Promise<void> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      navigation.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

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
  } catch {
    navigation.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
  }
}

async function routeCandidate(navigation: Nav, userId: string): Promise<void> {
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  navigation.reset({
    index: 0,
    routes: [
      {
        name: candidate ? 'CandidateShell' : 'CandidateOnboarding',
      },
    ],
  });
}

async function routeEmployer(navigation: Nav, userId: string): Promise<void> {
  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  navigation.reset({
    index: 0,
    routes: [
      {
        name: employer ? 'EmployerShell' : 'EmployerOnboarding',
      },
    ],
  });
}
