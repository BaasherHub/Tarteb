import React, { useEffect, useRef } from 'react';

import { StyleSheet, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/core/navigation/types';

import { colors } from '@/core/theme/colors';

import { Screen } from '@/shared/widgets/Screen';

import { EmployerOnboardingProvider } from '@/features/employer/providers/EmployerOnboardingContext';

import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';

import { EmployerStep1Company } from './onboarding/EmployerStep1Company';

import { EmployerStep2Contact } from './onboarding/EmployerStep2Contact';
import { StepTransition } from '@/shared/widgets/StepTransition';
import { ScreenLoading } from '@/shared/widgets/ScreenLoading';
import { useLocale } from '@/core/i18n/LocaleContext';
import { api } from '@/core/lib/api';
import {
  EmployerOnboardingData,
  employerFromRow,
} from '@/features/employer/domain/types/employerOnboarding';



type Props = NativeStackScreenProps<RootStackParamList, 'EmployerOnboarding'>;



function Steps(props: Props) {

  const { step, setStep } = useEmployerOnboarding();
  const previousStep = useRef(step);
  const direction: 1 | -1 = step >= previousStep.current ? 1 : -1;

  useEffect(() => {
    previousStep.current = step;
  }, [step]);

  useEffect(
    () =>
      props.navigation.addListener('beforeRemove', (event) => {
        if (step <= 1) return;
        const actionType = event.data.action.type;
        if (actionType !== 'GO_BACK' && actionType !== 'POP') return;
        event.preventDefault();
        setStep(step - 1);
      }),
    [props.navigation, setStep, step],
  );

  return (
    <StepTransition key={step} direction={direction}>
      <View style={styles.flex}>
        {step === 1 ? <EmployerStep1Company /> : <EmployerStep2Contact {...props} />}
      </View>
    </StepTransition>

  );

}



export function EmployerOnboardingScreen(props: Props) {
  const { t } = useLocale();

  const routeInitial = props.route.params?.initial;
  const shouldResolveEditInitial = Boolean(props.route.params?.edit && !routeInitial);
  const [resolvedInitial, setResolvedInitial] = React.useState<
    EmployerOnboardingData | undefined
  >(routeInitial);
  const [initialResolved, setInitialResolved] = React.useState(!shouldResolveEditInitial);

  useEffect(() => {
    if (!shouldResolveEditInitial) {
      setResolvedInitial(routeInitial);
      setInitialResolved(true);
      return;
    }

    let cancelled = false;
    api.employers
      .me()
      .then(({ employer }) => {
        if (cancelled) return;
        setResolvedInitial(employer ? employerFromRow(employer) : undefined);
      })
      .catch(() => {
        if (!cancelled) setResolvedInitial(undefined);
      })
      .finally(() => {
        if (!cancelled) setInitialResolved(true);
      });

    return () => {
      cancelled = true;
    };
  }, [routeInitial, shouldResolveEditInitial]);

  if (!initialResolved) return <ScreenLoading message={t.loading} />;

  return (

    <Screen style={styles.screen}>

      <EmployerOnboardingProvider initial={resolvedInitial}>

        <Steps {...props} />

      </EmployerOnboardingProvider>

    </Screen>

  );

}



const styles = StyleSheet.create({

  screen: { paddingHorizontal: 0 },

  flex: { flex: 1, backgroundColor: colors.scaffold },

});

