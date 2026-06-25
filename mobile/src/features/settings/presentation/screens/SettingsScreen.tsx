import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { api } from '@/core/lib/api';
import { clearSession } from '@/core/services/tokenStorage';
import { clearPushToken } from '@/core/services/notifications';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { SettingsPanel } from '@/shared/widgets/SettingsPanel';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { TabScreenScroll } from '@/shared/widgets/TabScreenScroll';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { t } = useLocale();

  const logout = async () => {
    await clearPushToken().catch(() => {});
    await api.auth.logout().catch(() => {});
    await clearSession();
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
  };

  const openEditProfile = async () => {
    const { candidate } = await api.candidates.me();
    if (!candidate) throw new Error(t.errorGeneric);
    navigation.navigate('CandidateOnboarding', {
      startStep: 3,
    });
  };

  return (
    <Screen>
      <ContentWidth style={styles.flex}>
        <TabScreenScroll>
          <ScreenHeader title={t.settings} onBack={() => navigation.goBack()} />
          <SettingsPanel
            onLogout={logout}
            onEditProfile={openEditProfile}
            onOpenPrivacy={() => navigation.navigate('PrivacyPolicy')}
          />
        </TabScreenScroll>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
});
