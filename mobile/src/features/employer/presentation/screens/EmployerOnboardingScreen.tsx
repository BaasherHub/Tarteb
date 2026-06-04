import React from 'react';

import { StyleSheet, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/core/navigation/types';

import { colors } from '@/core/theme/colors';

import { Screen } from '@/shared/widgets/Screen';

import { EmployerOnboardingProvider } from '@/features/employer/providers/EmployerOnboardingContext';

import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';

import { EmployerStep1Company } from './onboarding/EmployerStep1Company';

import { EmployerStep2Contact } from './onboarding/EmployerStep2Contact';



type Props = NativeStackScreenProps<RootStackParamList, 'EmployerOnboarding'>;



function Steps(props: Props) {

  const { step } = useEmployerOnboarding();

  return (

    <View style={styles.flex}>

      {step === 1 ? <EmployerStep1Company /> : <EmployerStep2Contact {...props} />}

    </View>

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

