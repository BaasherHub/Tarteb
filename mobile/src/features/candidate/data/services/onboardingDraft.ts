import AsyncStorage from '@react-native-async-storage/async-storage';
import { CandidateOnboardingData } from '@/features/candidate/domain/types/candidateOnboarding';


const DRAFT_KEY = 'candidate_onboarding_draft_v1';

export type OnboardingDraft = {
  data: CandidateOnboardingData;
  step: number;
  savedAt: string;
};

export async function loadOnboardingDraft(): Promise<OnboardingDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingDraft;
    if (!parsed?.data || typeof parsed.step !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveOnboardingDraft(
  data: CandidateOnboardingData,
  step: number,
): Promise<void> {
  try {
    const draft: OnboardingDraft = {
      data,
      step,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore storage errors
  }
}

export async function clearOnboardingDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
