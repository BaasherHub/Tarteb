import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';
import { clearPushToken } from '@/core/services/notifications';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { SettingsPanel } from '@/shared/widgets/SettingsPanel';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { TabScreenScroll } from '@/shared/widgets/TabScreenScroll';
import { onboardingFromRow } from '@/shared/domain/candidateOnboarding';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { t } = useLocale();

  const logout = async () => {
    await clearPushToken().catch(() => {});
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
  };

  const openEditProfile = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = userData.user?.id;
    if (!userId) throw new Error(t.errorGeneric);
    const { data: row, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!row) throw new Error(t.errorGeneric);
    navigation.navigate('CandidateOnboarding', {
      initial: onboardingFromRow(row as Record<string, unknown>),
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
