import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { CandidateOnboardingProvider } from '@/features/candidate/providers/CandidateOnboardingContext';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { Step1Photo } from './onboarding/Step1Photo';
import { Step2JobRole } from './onboarding/Step2JobRole';
import { Step3Location } from './onboarding/Step3Location';
import { Step4SalaryVisa } from './onboarding/Step4SalaryVisa';
import { Step4Finish } from './onboarding/Step4Finish';
import { colors } from '@/core/theme/colors';


type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;

function OnboardingSteps(props: Props) {
  const { step } = useCandidateOnboarding();
  return (
    <View style={styles.flex}>
      {step === 1 && <Step1Photo />}
      {step === 2 && <Step2JobRole />}
      {step === 3 && <Step3Location />}
      {step === 4 && <Step4SalaryVisa />}
      {step === 5 && <Step4Finish {...props} />}
    </View>
  );
}

export function CandidateOnboardingScreen(props: Props) {
  const initial = props.route.params?.initial;
  const startStep = props.route.params?.startStep;
  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <CandidateOnboardingProvider initial={initial} startStep={startStep}>
        <OnboardingSteps {...props} />
      </CandidateOnboardingProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
});
