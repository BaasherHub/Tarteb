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

  const initial = props.route.params?.initial;

  return (

    <Screen style={styles.screen}>

      <EmployerOnboardingProvider initial={initial}>

        <Steps {...props} />

      </EmployerOnboardingProvider>

    </Screen>

  );

}



const styles = StyleSheet.create({

  screen: { paddingHorizontal: 0 },

  flex: { flex: 1, backgroundColor: colors.scaffold },

});

