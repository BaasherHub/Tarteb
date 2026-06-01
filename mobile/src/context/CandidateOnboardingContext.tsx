import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CandidateOnboardingData,
  emptyOnboardingData,
} from '../types/candidateOnboarding';

type Ctx = {
  data: CandidateOnboardingData;
  step: number;
  totalSteps: number;
  setStep: (n: number) => void;
  update: (patch: Partial<CandidateOnboardingData>) => void;
  reset: (initial?: CandidateOnboardingData) => void;
};

const CandidateOnboardingContext = createContext<Ctx | null>(null);

export function CandidateOnboardingProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: CandidateOnboardingData;
}) {
  const [data, setData] = useState<CandidateOnboardingData>(
    initial ?? emptyOnboardingData(),
  );
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const value = useMemo(
    () => ({
      data,
      step,
      totalSteps,
      setStep,
      update: (patch: Partial<CandidateOnboardingData>) =>
        setData((d) => ({ ...d, ...patch })),
      reset: (init?: CandidateOnboardingData) => {
        setData(init ?? emptyOnboardingData());
        setStep(1);
      },
    }),
    [data, step],
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
