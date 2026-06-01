import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { useLocale } from '../i18n/LocaleContext';
import { supabase } from '../lib/supabase';
import { openWhatsAppSupport } from '../utils/whatsapp';
import { colors } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { t, lang, setLang } = useLocale();

  const logout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: 'PhoneOtp' }] });
  };

  return (
    <Screen>
      <Text style={styles.title}>{t.settings}</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.chip, lang === 'en' && styles.chipOn]}
          onPress={() => setLang('en')}
        >
          <Text>English</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, lang === 'ar' && styles.chipOn]}
          onPress={() => setLang('ar')}
        >
          <Text>العربية</Text>
        </Pressable>
      </View>
      <Pressable style={styles.item} onPress={() => openWhatsAppSupport()}>
        <Text>Support (WhatsApp)</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={logout}>
        <Text style={styles.danger}>Logout</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '600', marginVertical: 16 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: `${colors.primary}15` },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  danger: { color: colors.error },
});
