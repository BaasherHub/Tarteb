import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { ContentWidth } from '../../components/ContentWidth';
import { AppBrand } from '../../components/AppBrand';
import { AppIcon } from '../../components/AppIcon';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import { routeAuthenticatedUser } from '../../services/authNavigation';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

export function RoleSelectionScreen({ navigation }: Props) {
  const { t, isRtl } = useLocale();
  const [loading, setLoading] = useState<'candidate' | 'employer' | null>(null);
  const [pendingRole, setPendingRole] = useState<'candidate' | 'employer' | null>(null);

  const insertRole = async (role: 'candidate' | 'employer') => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    setLoading(role);
    try {
      const { error } = await supabase.from('profiles').insert({
        user_id: userId,
        role,
      });
      if (error) throw error;
      setPendingRole(null);
      await routeAuthenticatedUser(navigation);
    } catch (e) {
      const msg = e instanceof Error ? e.message : t.errorGeneric;
      if (Platform.OS === 'web' && typeof window !== 'undefined') window.alert(msg);
      else Alert.alert('Error', msg);
    } finally {
      setLoading(null);
    }
  };

  const pendingLabel =
    pendingRole === 'candidate' ? t.roleCandidate : pendingRole === 'employer' ? t.roleEmployer : '';

  return (
    <Screen style={styles.screen}>
      <ContentWidth>
        <View style={styles.centered}>
          <AppBrand />
          <Text style={styles.title}>{t.selectRole}</Text>
          <Text style={[styles.subtitle, isRtl && styles.rtlText]}>{t.selectRoleSubtitle}</Text>
          <View style={styles.gap}>
            <RoleCard
              icon="person"
              title={t.roleCandidate}
              subtitle={t.roleCandidateSubtitle}
              onPress={() => setPendingRole('candidate')}
              disabled={loading !== null}
              isRtl={isRtl}
            />
            <RoleCard
              icon="business"
              title={t.roleEmployer}
              subtitle={t.roleEmployerSubtitle}
              onPress={() => setPendingRole('employer')}
              disabled={loading !== null}
              isRtl={isRtl}
            />
          </View>
        </View>
      </ContentWidth>

      <ConfirmDialog
        visible={pendingRole !== null}
        title={t.roleConfirmTitle}
        message={t.roleConfirmMessage}
        highlight={pendingLabel}
        confirmLabel={t.roleConfirmAction(pendingLabel)}
        cancelLabel={t.roleSelectDifferent}
        loading={loading !== null}
        onConfirm={() => pendingRole && void insertRole(pendingRole)}
        onCancel={() => setPendingRole(null)}
      />
    </Screen>
  );
}

function RoleCard({
  icon,
  title,
  subtitle,
  onPress,
  disabled,
  isRtl,
}: {
  icon: 'person' | 'business';
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
  isRtl: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.card,
        isRtl && styles.cardRtl,
        pressed && !disabled && { opacity: 0.92 },
        disabled && styles.cardDisabled,
      ]}
    >
      <View style={styles.iconCircle}>
        <AppIcon name={icon} size={26} color={colors.primary} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      <AppIcon
        name={isRtl ? 'chevron-back' : 'chevron-forward'}
        size={22}
        color={colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  centered: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  title: { ...typography.h2, marginTop: 8, marginBottom: 8, textAlign: 'center' },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  rtlText: { writingDirection: 'rtl' },
  gap: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: 14,
    minHeight: 84,
  },
  cardRtl: { flexDirection: 'row-reverse' },
  cardDisabled: { opacity: 0.7 },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  cardSub: { marginTop: 4, color: colors.textSecondary, lineHeight: 20, fontSize: 14 },
});
