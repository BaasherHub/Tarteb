import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { CandidateOnboardingProvider } from '@/features/candidate/providers/CandidateOnboardingContext';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { Step1Photo } from './onboarding/Step1Photo';
import { Step2JobRole } from './onboarding/Step2JobRole';
import { Step2Visa } from './onboarding/Step2Visa';
import { Step3Salary } from './onboarding/Step3Salary';
import { Step4Finish } from './onboarding/Step4Finish';
import { colors } from '@/core/theme/colors';


type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;

function OnboardingSteps(props: Props) {
  const { step } = useCandidateOnboarding();
  return (
    <View style={styles.flex}>
      {step === 1 && <Step1Photo />}
      {step === 2 && <Step2JobRole />}
      {step === 3 && <Step2Visa />}
      {step === 4 && <Step3Salary />}
      {step === 5 && <Step4Finish {...props} />}
    </View>
  );
}

export function CandidateOnboardingScreen(props: Props) {
  const initial = props.route.params?.initial;
  return (
    <CandidateOnboardingProvider initial={initial}>
      <OnboardingSteps {...props} />
    </CandidateOnboardingProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
});
