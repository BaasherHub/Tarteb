import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import { routeAuthenticatedUser } from '../../services/authNavigation';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

export function RoleSelectionScreen({ navigation }: Props) {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  const selectRole = async (role: 'candidate' | 'employer') => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').insert({
        user_id: userId,
        role,
      });
      if (error) throw error;
      await routeAuthenticatedUser(navigation);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>{t.selectRole}</Text>
      <View style={styles.gap}>
        <RoleCard
          title={t.roleCandidate}
          subtitle={t.roleCandidateSubtitle}
          onPress={() => selectRole('candidate')}
          disabled={loading}
        />
        <RoleCard
          title={t.roleEmployer}
          subtitle={t.roleEmployerSubtitle}
          onPress={() => selectRole('employer')}
          disabled={loading}
        />
      </View>
    </Screen>
  );
}

function RoleCard({
  title,
  subtitle,
  onPress,
  disabled,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '600', marginVertical: 24 },
  gap: { gap: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSub: { marginTop: 8, color: colors.textSecondary },
});
