import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';
import { clearPushToken } from '@/core/services/notifications';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { SettingsPanel } from '@/features/settings/presentation/components/SettingsPanel';
import { useLocale } from '@/core/i18n/LocaleContext';


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
