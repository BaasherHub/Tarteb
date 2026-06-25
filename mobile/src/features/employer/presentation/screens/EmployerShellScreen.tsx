import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { BackHandler, Platform, StyleSheet } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useLocale } from '@/core/i18n/LocaleContext';

import { api } from '@/core/lib/api';
import { logoutAndClearLocalState } from '@/core/services/logout';

import { EmployerTabParamList, RootStackParamList } from '@/core/navigation/types';

import { colors } from '@/core/theme/colors';

import { spacing } from '@/core/theme/spacing';

import { ScreenHeader } from '@/shared/widgets/ScreenHeader';

import { TabScreenLayout } from '@/shared/widgets/TabScreenLayout';

import { SettingsPanel } from '@/shared/widgets/SettingsPanel';

import { AppIcon } from '@/shared/widgets/AppIcon';

import type { AppIconName } from '@/shared/widgets/AppIcon.types';

import { BrowseScreen } from './BrowseScreen';

import { MyUnlocksScreen } from './MyUnlocksScreen';



const Tab = createBottomTabNavigator<EmployerTabParamList>();



function EmployerSettingsTab() {

  const { t } = useLocale();
  const tabNav = useNavigation<BottomTabNavigationProp<EmployerTabParamList>>();
  const stackNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const goBrowse = useCallback(() => {
    tabNav.navigate('BrowseTab');
  }, [tabNav]);

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        goBrowse();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => sub.remove();
    }, [goBrowse]),
  );



  const logout = async () => {
    await logoutAndClearLocalState({ queryClient });
    stackNav.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
  };



  const openEditCompany = async () => {
    const { employer } = await api.employers.me();
    if (!employer) throw new Error(t.errorGeneric);

    stackNav.navigate('EmployerOnboarding', {
      edit: true,

    });

  };



  return (

    <TabScreenLayout>

      <ScreenHeader title={t.settings} />

      <SettingsPanel

        onLogout={logout}

        onEditProfile={openEditCompany}

        onOpenPrivacy={() => stackNav.navigate('PrivacyPolicy')}

      />

    </TabScreenLayout>

  );

}



export function EmployerShellScreen() {

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

        name="BrowseTab"

        component={BrowseScreen}

        options={{

          tabBarLabel: t.browse,

          tabBarAccessibilityLabel: t.browse,

          tabBarIcon: ({ focused, color }) => (

            <AppIcon

              name={(focused ? 'search' : 'search-outline') as AppIconName}

              size={22}

              color={color}

            />

          ),

        }}

      />

      <Tab.Screen

        name="UnlocksTab"

        component={MyUnlocksScreen}

        options={{

          tabBarLabel: t.myUnlocks,

          tabBarAccessibilityLabel: t.myUnlocks,

          tabBarIcon: ({ focused, color }) => (

            <AppIcon

              name={(focused ? 'document-text' : 'document-text-outline') as AppIconName}

              size={22}

              color={color}

            />

          ),

        }}

      />

      <Tab.Screen

        name="SettingsTab"

        component={EmployerSettingsTab}

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


