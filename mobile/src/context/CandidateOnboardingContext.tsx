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
  CandidateOnboardingData,
  emptyOnboardingData,
} from '../types/candidateOnboarding';
import {
  clearOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
} from '../services/onboardingDraft';

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

export function CandidateOnboardingProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: CandidateOnboardingData;
}) {
  const isEditMode = Boolean(initial?.candidateId);
  const [data, setData] = useState<CandidateOnboardingData>(
    initial ?? emptyOnboardingData(),
  );
  const [step, setStepState] = useState(1);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const hydrated = useRef(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSteps = 5;

  useEffect(() => {
    if (isEditMode || hydrated.current) return;
    hydrated.current = true;
    loadOnboardingDraft().then((draft) => {
      if (!draft) return;
      setData(draft.data);
      setStepState(Math.min(Math.max(draft.step, 1), totalSteps));
      setDraftSavedAt(draft.savedAt);
    });
  }, [isEditMode]);

  const persistDraft = useCallback(
    (nextData: CandidateOnboardingData, nextStep: number) => {
      if (isEditMode) return;
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(async () => {
        await saveOnboardingDraft(nextData, nextStep);
        setDraftSavedAt(new Date().toISOString());
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
        const next = { ...d, ...patch };
        if (!isEditMode) persistDraft(next, step);
        return next;
      });
    },
    [isEditMode, persistDraft, step],
  );

  const reset = useCallback((init?: CandidateOnboardingData) => {
    setData(init ?? emptyOnboardingData());
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
