import { RootStackParamList } from '../navigation/types';
import { supabase } from '../lib/supabase';

type Nav = {
  reset: (state: {
    index: number;
    routes: { name: keyof RootStackParamList }[];
  }) => void;
};

export async function routeAuthenticatedUser(navigation: Nav): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

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
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  navigation.reset({
    index: 0,
    routes: [
      {
        name: candidate ? 'CandidateDashboard' : 'CandidateOnboarding',
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
