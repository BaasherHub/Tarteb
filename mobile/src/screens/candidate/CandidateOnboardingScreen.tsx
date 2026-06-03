import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { CandidateOnboardingProvider } from '../../context/CandidateOnboardingContext';
import { useCandidateOnboarding } from '../../context/CandidateOnboardingContext';
import { Step1PhotoRole } from './onboarding/Step1PhotoRole';
import { Step2Visa } from './onboarding/Step2Visa';
import { Step3Salary } from './onboarding/Step3Salary';
import { Step4Experience } from './onboarding/Step4Experience';
import { Step4Availability } from './onboarding/Step4Availability';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;

function OnboardingSteps(props: Props) {
  const { step } = useCandidateOnboarding();
  return (
    <View style={styles.flex}>
      {step === 1 && <Step1PhotoRole />}
      {step === 2 && <Step2Visa />}
      {step === 3 && <Step3Salary />}
      {step === 4 && <Step4Experience />}
      {step === 5 && <Step4Availability {...props} />}
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
