import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateDashboard'>;

export function CandidateDashboardScreen({ navigation }: Props) {
  const { t } = useLocale();

  return (
    <Screen>
      <View style={styles.box}>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.body}>
          Candidate dashboard (pause profile, views, edit) — port from Flutter next.
        </Text>
        <PrimaryButton
          label={t.settings}
          onPress={() => navigation.navigate('Settings', { isCandidate: true })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  body: { color: colors.textSecondary, lineHeight: 22 },
});
