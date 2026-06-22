import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  clearOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
} from '@/features/candidate/data/services/onboardingDraft';
import {
  CandidateOnboardingData,
  emptyOnboardingData,
} from '@/features/candidate/domain/types/candidateOnboarding';


type Ctx = {
  data: CandidateOnboardingData;
  step: number;
  totalSteps: number;
  isEditMode: boolean;
  draftSavedAt: string | null;
  setStep: (n: number) => void;
  update: (patch: Partial<CandidateOnboardingData>) => void;
  reset: (initial?: CandidateOnboardingData) => void;
  discardDraft: () => Promise<void>;
};

const CandidateOnboardingContext = createContext<Ctx | null>(null);

function mergeOnboardingData(
  patch?: Partial<CandidateOnboardingData>,
): CandidateOnboardingData {
  const base = emptyOnboardingData();
  if (!patch) return base;
  return {
    ...base,
    ...patch,
    additionalRoles: Array.isArray(patch.additionalRoles)
      ? patch.additionalRoles
      : base.additionalRoles,
    languages: Array.isArray(patch.languages) ? patch.languages : base.languages,
  };
}

export function CandidateOnboardingProvider({
  children,
  initial,
  startStep,
}: {
  children: React.ReactNode;
  initial?: CandidateOnboardingData;
  startStep?: number;
}) {
  const isEditMode = Boolean(initial?.candidateId);
  const [data, setData] = useState<CandidateOnboardingData>(() =>
    mergeOnboardingData(initial),
  );
  const initialStep = Math.min(Math.max(startStep ?? 1, 1), 5);
  const [step, setStepState] = useState(isEditMode ? initialStep : 1);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const hydrated = useRef(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSteps = 5;

  useEffect(() => {
    if (isEditMode || hydrated.current) return;
    hydrated.current = true;
    loadOnboardingDraft().then((draft) => {
      if (!draft) return;
      setData(mergeOnboardingData(draft.data));
      setStepState(Math.min(Math.max(draft.step, 1), totalSteps));
      setDraftSavedAt(draft.savedAt);
    });
  }, [isEditMode]);

  const persistDraft = useCallback(
    (nextData: CandidateOnboardingData, nextStep: number) => {
      if (isEditMode) return;
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(async () => {
        try {
          await saveOnboardingDraft(nextData, nextStep);
          setDraftSavedAt(new Date().toISOString());
        } catch (e) {
          console.warn('[onboarding] draft save failed', e);
        }
      }, 500);
    },
    [isEditMode],
  );

  const setStep = useCallback(
    (n: number) => {
      setStepState(n);
      if (!isEditMode) persistDraft(data, n);
    },
    [data, isEditMode, persistDraft],
  );

  const update = useCallback(
    (patch: Partial<CandidateOnboardingData>) => {
      setData((d) => {
        const next = mergeOnboardingData({ ...d, ...patch });
        if (!isEditMode) persistDraft(next, step);
        return next;
      });
    },
    [isEditMode, persistDraft, step],
  );

  const reset = useCallback((init?: CandidateOnboardingData) => {
    setData(mergeOnboardingData(init));
    setStepState(1);
  }, []);

  const discardDraft = useCallback(async () => {
    await clearOnboardingDraft();
    setDraftSavedAt(null);
    reset();
  }, [reset]);

  const value = useMemo(
    () => ({
      data,
      step,
      totalSteps,
      isEditMode,
      draftSavedAt,
      setStep,
      update,
      reset,
      discardDraft,
    }),
    [data, step, isEditMode, draftSavedAt, setStep, update, reset, discardDraft],
  );

  return (
    <CandidateOnboardingContext.Provider value={value}>
      {children}
    </CandidateOnboardingContext.Provider>
  );
}

export function useCandidateOnboarding() {
  const ctx = useContext(CandidateOnboardingContext);
  if (!ctx) {
    throw new Error('useCandidateOnboarding requires CandidateOnboardingProvider');
  }
  return ctx;
}

export async function clearCandidateOnboardingDraft() {
  await clearOnboardingDraft();
}
