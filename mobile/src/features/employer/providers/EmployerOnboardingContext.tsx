import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  EmployerOnboardingData,
  emptyEmployerOnboardingData,
} from '@/features/employer/domain/types/employerOnboarding';

type Ctx = {
  data: EmployerOnboardingData;
  step: number;
  totalSteps: number;
  isEditMode: boolean;
  setStep: (n: number) => void;
  update: (patch: Partial<EmployerOnboardingData>) => void;
};

const EmployerOnboardingContext = createContext<Ctx | null>(null);

export function EmployerOnboardingProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: EmployerOnboardingData;
}) {
  const isEditMode = Boolean(initial?.employerId);
  const [data, setData] = useState<EmployerOnboardingData>(
    initial ?? emptyEmployerOnboardingData(),
  );
  const [step, setStepState] = useState(1);
  const totalSteps = 2;

  const setStep = useCallback((n: number) => {
    setStepState(Math.min(Math.max(n, 1), totalSteps));
  }, []);

  const update = useCallback((patch: Partial<EmployerOnboardingData>) => {
    setData((d) => ({ ...d, ...patch }));
  }, []);

  const value = useMemo(
    () => ({ data, step, totalSteps, isEditMode, setStep, update }),
    [data, step, isEditMode, setStep, update],
  );

  return (
    <EmployerOnboardingContext.Provider value={value}>
      {children}
    </EmployerOnboardingContext.Provider>
  );
}

export function useEmployerOnboarding() {
  const ctx = useContext(EmployerOnboardingContext);
  if (!ctx) {
    throw new Error('useEmployerOnboarding requires EmployerOnboardingProvider');
  }
  return ctx;
}

export type { EmployerOnboardingData } from '@/features/employer/domain/types/employerOnboarding';
