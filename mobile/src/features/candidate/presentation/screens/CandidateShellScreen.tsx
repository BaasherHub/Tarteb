import React, { useCallback } from 'react';
import { BackHandler, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CandidateDashboardScreen } from './CandidateDashboardScreen';
import { useLocale } from '@/core/i18n/LocaleContext';
import { RootStackParamList, CandidateTabParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';
import { clearPushToken } from '@/core/services/notifications';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { TabScreenLayout } from '@/shared/widgets/TabScreenLayout';
import { SettingsPanel } from '@/shared/widgets/SettingsPanel';
import { AppIcon } from '@/shared/widgets/AppIcon';
import type { AppIconName } from '@/shared/widgets/AppIcon.types';
import { onboardingFromRow } from '@/features/candidate/domain/types/candidateOnboarding';

const Tab = createBottomTabNavigator<CandidateTabParamList>();

function CandidateSettingsTab() {
  const { t } = useLocale();
  const tabNav = useNavigation<BottomTabNavigationProp<CandidateTabParamList>>();
  const stackNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goHome = useCallback(() => {
    tabNav.navigate('HomeTab');
  }, [tabNav]);

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        goHome();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => sub.remove();
    }, [goHome]),
  );

  const logout = async () => {
    await clearPushToken().catch(() => {});
    await supabase.auth.signOut();
    stackNav.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
  };

  const openEditProfile = async () => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;
    const { data: row } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (!row) return;
    stackNav.navigate('CandidateOnboarding', {
      initial: onboardingFromRow(row as Record<string, unknown>),
      startStep: 3,
    });
  };

  return (
    <TabScreenLayout>
      <ScreenHeader title={t.settings} />
      <SettingsPanel
        onLogout={logout}
        onEditProfile={openEditProfile}
        onOpenPrivacy={() => stackNav.navigate('PrivacyPolicy')}
      />
    </TabScreenLayout>
  );
}

export function CandidateShellScreen() {
  const { t } = useLocale();

  return (
    <Tab.Navigator
      screenOptions={{
        sceneStyle: styles.scene,
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : spacing.sm,
        },
        tabBarStyle: Platform.select({
          web: {
            borderTopWidth: 1,
            borderTopColor: colors.divider,
            maxWidth: 520,
            alignSelf: 'center',
            width: '100%',
          },
          ios: { borderTopWidth: 0.5, borderTopColor: colors.divider },
          android: {},
          default: {},
        }),
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={CandidateDashboardScreen}
        options={{
          tabBarLabel: t.home,
          tabBarAccessibilityLabel: t.home,
          tabBarIcon: ({ focused, color }) => (
            <AppIcon
              name={(focused ? 'person' : 'person-outline') as AppIconName}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={CandidateSettingsTab}
        options={{
          tabBarLabel: t.settings,
          tabBarAccessibilityLabel: t.settings,
          tabBarIcon: ({ focused, color }) => (
            <AppIcon
              name={(focused ? 'settings' : 'settings-outline') as AppIconName}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.scaffold,
  },
});

