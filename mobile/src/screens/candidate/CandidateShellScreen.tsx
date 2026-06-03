import React from 'react';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CandidateDashboardScreen } from './CandidateDashboardScreen';
import { useLocale } from '../../i18n/LocaleContext';
import { RootStackParamList } from '../../navigation/types';
import { ContentWidth } from '../../components/ContentWidth';
import { SettingsPanel } from '../../components/SettingsPanel';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/colors';

const Tab = createBottomTabNavigator();

function CandidateSettingsTab() {
  const { t } = useLocale();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const logout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
  };

  return (
    <ContentWidth style={styles.settingsTab}>
      <ScrollView contentContainerStyle={styles.settingsScroll}>
        <Text style={styles.settingsTitle}>{t.settings}</Text>
        <SettingsPanel onLogout={logout} />
      </ScrollView>
    </ContentWidth>
  );
}

export function CandidateShellScreen() {
  const { t } = useLocale();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: () => null,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
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
        options={{ tabBarLabel: t.home }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={CandidateSettingsTab}
        options={{ tabBarLabel: t.settings }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  settingsTab: { flex: 1, backgroundColor: colors.scaffold },
  settingsScroll: { padding: 24, paddingBottom: 48 },
  settingsTitle: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
});
