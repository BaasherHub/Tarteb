import AsyncStorage from '@react-native-async-storage/async-storage';
import { CandidateOnboardingData } from '@/features/candidate/domain/types/candidateOnboarding';

const DRAFT_PREFIX = '@tarteb/onboarding_draft_v2/';

export type OnboardingDraft = {
  data: CandidateOnboardingData;
  step: number;
  savedAt: string;
};

function draftKey(userId: string): string {
  return DRAFT_PREFIX + userId;
}

export async function loadOnboardingDraft(userId: string): Promise<OnboardingDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(draftKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingDraft;
    if (!parsed?.data || typeof parsed.step !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveOnboardingDraft(
  userId: string,
  data: CandidateOnboardingData,
  step: number,
): Promise<void> {
  const draft: OnboardingDraft = {
    data,
    step,
    savedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(draftKey(userId), JSON.stringify(draft));
}

export async function clearOnboardingDraft(userId: string): Promise<void> {
  await AsyncStorage.removeItem(draftKey(userId));
}
