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
import { RootStackParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';
import {
  AuthRoutingError,
  routeAuthenticatedUser,
} from '@/features/auth/data/services/authNavigation';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { getErrorMessage } from '@/shared/utils/errors';
import { AppBrand } from '@/shared/widgets/AppBrand';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog';
import { useLocale } from '@/core/i18n/LocaleContext';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';


type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

export function RoleSelectionScreen({ navigation }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
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
      const msg =
        e instanceof AuthRoutingError
          ? e.message
          : getErrorMessage(e, t.errorGeneric);
      if (Platform.OS === 'web' && typeof window !== 'undefined') window.alert(msg);
      else Alert.alert(t.errorTitle, msg);
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
          <Text
            style={[styles.subtitle, { writingDirection: rtl.writingDirection }]}
            numberOfLines={4}
          >
            {t.selectRoleSubtitle}
          </Text>
          <View style={styles.gap}>
            <RoleCard
              icon="person"
              title={t.roleCandidate}
              subtitle={t.roleCandidateSubtitle}
              onPress={() => setPendingRole('candidate')}
              disabled={loading !== null}
            />
            <RoleCard
              icon="business"
              title={t.roleEmployer}
              subtitle={t.roleEmployerSubtitle}
              onPress={() => setPendingRole('employer')}
              disabled={loading !== null}
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
}: {
  icon: 'person' | 'business';
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const rtl = useRtlStyles();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.card,
        rtl.row,
        pressed && !disabled && styles.cardPressed,
        disabled && styles.cardDisabled,
      ]}
    >
      <View style={styles.iconCircle}>
        <AppIcon name={icon} size={26} color={colors.primary} />
      </View>
      <View style={styles.cardText}>
        <Text style={[styles.cardTitle, { textAlign: rtl.textAlign }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.cardSub, { textAlign: rtl.textAlign }]} numberOfLines={3}>
          {subtitle}
        </Text>
      </View>
      <AppIcon
        name={rtl.isRtl ? 'chevron-back' : 'chevron-forward'}
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
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.h2,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  gap: { gap: spacing.md },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: spacing.lg,
    minHeight: 84,
  },
  cardPressed: { opacity: interaction.cardPressed },
  cardDisabled: { opacity: interaction.disabled },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, minWidth: 0 },
  cardTitle: { ...typography.h3, color: colors.textPrimary },
  cardSub: { marginTop: spacing.xs, ...typography.caption, color: colors.textSecondary },
});
