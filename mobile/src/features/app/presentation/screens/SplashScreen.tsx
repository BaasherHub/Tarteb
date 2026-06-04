import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import {
  AuthRoutingError,
  routeAuthenticatedUser,
} from '@/features/auth/data/services/authNavigation';
import { useAuth } from '@/core/providers/AuthProvider';
import { supabase } from '@/core/lib/supabase';
import { colors } from '@/core/theme/colors';
import { useLocale } from '@/core/i18n/LocaleContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { t } = useLocale();
  const { isReady } = useAuth();
  const [routeError, setRouteError] = useState<string | undefined>();
  const bootstrapped = useRef(false);

  const bootstrapRoute = async () => {
    setRouteError(undefined);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session) {
        await routeAuthenticatedUser(navigation);
        return;
      }
      navigation.replace('PhoneOtp');
    } catch (e) {
      bootstrapped.current = false;
      if (e instanceof AuthRoutingError) {
        setRouteError(e.message);
        return;
      }
      setRouteError(t.errorGeneric);
    }
  };

  useEffect(() => {
    if (!isReady || bootstrapped.current) return;
    bootstrapped.current = true;
    void bootstrapRoute();
  }, [isReady]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.appName}</Text>
      <Text style={styles.tagline}>{t.splashTagline}</Text>
      {routeError ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{routeError}</Text>
          <Pressable
            style={styles.retryBtn}
            onPress={() => {
              bootstrapped.current = false;
              void bootstrapRoute();
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <ActivityIndicator color="#fff" style={styles.spinner} />
      )}
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
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 16,
    textAlign: 'center',
  },
  spinner: { marginTop: 40 },
  errorBlock: { marginTop: 24, alignItems: 'center', gap: 12 },
  errorText: { color: '#fff', textAlign: 'center', fontSize: 15 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
