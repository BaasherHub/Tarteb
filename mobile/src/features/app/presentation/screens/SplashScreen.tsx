import React, { useCallback, useEffect, useState } from 'react';
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
import { colors } from '@/core/theme/colors';
import { useLocale } from '@/core/i18n/LocaleContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { t } = useLocale();
  const { session, isReady } = useAuth();
  const [routeError, setRouteError] = useState<string | undefined>();

  const navigateFromAuth = useCallback(async () => {
    setRouteError(undefined);
    try {
      if (session) {
        await routeAuthenticatedUser(navigation);
        return;
      }
      navigation.replace('PhoneOtp');
    } catch (e) {
      if (e instanceof AuthRoutingError) {
        setRouteError(e.message);
        return;
      }
      setRouteError(t.errorGeneric);
    }
  }, [navigation, session, t.errorGeneric]);

  useEffect(() => {
    if (!isReady) return;
    void navigateFromAuth();
  }, [isReady, navigateFromAuth]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.appName}</Text>
      <Text style={styles.tagline}>{t.splashTagline}</Text>
      {routeError ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{routeError}</Text>
          <Pressable style={styles.retryBtn} onPress={() => void navigateFromAuth()}>
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
