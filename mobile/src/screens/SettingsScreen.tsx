import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ContentWidth } from '../components/ContentWidth';
import { SettingsPanel } from '../components/SettingsPanel';
import { useLocale } from '../i18n/LocaleContext';
import { supabase } from '../lib/supabase';
import { clearPushToken } from '../services/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { t } = useLocale();

  const logout = async () => {
    await clearPushToken().catch(() => {});
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
  };

  return (
    <Screen>
      <ContentWidth>
        <Text style={styles.title}>{t.settings}</Text>
        <SettingsPanel onLogout={logout} />
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '600', marginVertical: 16 },
});
