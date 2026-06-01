import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { useLocale } from '../../i18n/LocaleContext';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;

/** Step 4 parity with Flutter — full multi-step UI coming next. */
export function CandidateOnboardingScreen({}: Props) {
  const { t } = useLocale();

  return (
    <Screen>
      <View style={styles.box}>
        <Text style={styles.title}>Candidate onboarding</Text>
        <Text style={styles.body}>
          React Native migration: photo, role, visa, salary, and availability steps will
          match the Flutter 4-step flow. Use the Flutter app to complete profiles until
          this screen is finished.
        </Text>
        <Text style={styles.step}>{t.stepOf(1, 4)}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 24,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '600' },
  body: { color: colors.textSecondary, lineHeight: 22 },
  step: { fontWeight: '600', color: colors.primary },
});
