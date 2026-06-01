import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { supabase } from '../lib/supabase';
import { routeAuthenticatedUser } from '../services/authNavigation';
import { colors } from '../constants/colors';
import { useLocale } from '../i18n/LocaleContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { t } = useLocale();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        await routeAuthenticatedUser(navigation);
        return;
      }

      await new Promise((r) => setTimeout(r, 1200));
      if (cancelled) return;
      navigation.replace('PhoneOtp');
    })();

    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.appName}</Text>
      <Text style={styles.tagline}>{t.splashTagline}</Text>
      <ActivityIndicator color="#fff" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: { fontSize: 40, fontWeight: '700', color: '#fff' },
  tagline: { fontSize: 18, color: 'rgba(255,255,255,0.95)', marginTop: 16, textAlign: 'center' },
  spinner: { marginTop: 40 },
});
