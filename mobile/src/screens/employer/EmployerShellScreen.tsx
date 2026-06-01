import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BrowseScreen } from './BrowseScreen';
import { MyUnlocksScreen } from './MyUnlocksScreen';
import { useLocale } from '../../i18n/LocaleContext';
import { colors } from '../../constants/colors';

const Tab = createBottomTabNavigator();

export function EmployerShellScreen() {
  const { t } = useLocale();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: Platform.select({
          ios: { borderTopWidth: 0.5, borderTopColor: colors.divider },
          android: {},
        }),
      }}
    >
      <Tab.Screen name="BrowseTab" component={BrowseScreen} options={{ title: t.browse }} />
      <Tab.Screen name="UnlocksTab" component={MyUnlocksScreen} options={{ title: t.myUnlocks }} />
    </Tab.Navigator>
  );
}
