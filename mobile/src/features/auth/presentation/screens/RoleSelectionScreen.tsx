import React, { useEffect, useRef, useState } from 'react';

import {

  Animated,

  Platform,

  Pressable,

  ScrollView,

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

import {

  setPendingAccountRole,

  type PendingAccountRole,

} from '@/core/services/pendingAccountRole';

import { useRtlStyles } from '@/core/hooks/useRtlStyles';

import { colors } from '@/core/theme/colors';

import { interaction } from '@/core/theme/interaction';

import { spacing } from '@/core/theme/spacing';

import { typography } from '@/core/theme/typography';

import { getErrorMessage } from '@/shared/utils/errors';

import { playSelectionHaptic } from '@/shared/utils/selectionHaptic';

import { AppBrand } from '@/shared/widgets/AppBrand';

import { AppIcon } from '@/shared/widgets/AppIcon';

import { RoleConfirmModal } from '@/features/auth/presentation/components/RoleConfirmModal';

import { useLocale } from '@/core/i18n/LocaleContext';

import { Screen } from '@/shared/widgets/Screen';

import { ContentWidth } from '@/shared/widgets/ContentWidth';

import { InfoBanner } from '@/shared/widgets/InfoBanner';



type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;



export function RoleSelectionScreen({ navigation }: Props) {

  const { t } = useLocale();

  const rtl = useRtlStyles();

  const [hasSession, setHasSession] = useState(false);

  const [loading, setLoading] = useState<'candidate' | 'employer' | null>(null);

  const [confirmRoleChoice, setConfirmRoleChoice] = useState<PendingAccountRole | null>(null);

  const [formError, setFormError] = useState<string | undefined>();



  useEffect(() => {

    void supabase.auth.getSession().then(({ data }) => {

      setHasSession(Boolean(data.session));

    });

  }, []);



  const confirmRole = async (role: PendingAccountRole) => {

    setLoading(role);

    setFormError(undefined);

    try {

      if (hasSession) {

        const userId = (await supabase.auth.getUser()).data.user?.id;

        if (!userId) {

          await setPendingAccountRole(role);

          navigation.replace('PhoneOtp');

          return;

        }

        const { error } = await supabase.from('profiles').insert({

          user_id: userId,

          role,

        });

        if (error) throw error;

        setConfirmRoleChoice(null);

        await routeAuthenticatedUser(navigation);

        return;

      }



      await setPendingAccountRole(role);

      setConfirmRoleChoice(null);

      navigation.replace('PhoneOtp');

    } catch (e) {

      const msg =

        e instanceof AuthRoutingError

          ? e.message

          : getErrorMessage(e, t.errorGeneric);

      setFormError(msg);

    } finally {

      setLoading(null);

    }

  };



  const openRole = (role: PendingAccountRole) => {
    if (loading) return;
    void playSelectionHaptic();
    setConfirmRoleChoice(role);
  };



  return (

    <Screen style={styles.screen}>

      <ScrollView

        contentContainerStyle={styles.scroll}

        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled"

      >

        <ContentWidth>

          <Text style={[styles.kicker, { textAlign: rtl.textAlignCenter }]}>

            {t.roleSelectionKicker}

          </Text>

          <AppBrand showTagline={false} />

          <Text style={[styles.title, { textAlign: rtl.textAlignCenter }]}>

            {t.selectRole}

          </Text>

          <Text

            style={[

              styles.subtitle,

              { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },

            ]}

          >

            {t.selectRoleSubtitle}

          </Text>



          {formError ? (

            <View style={styles.bannerWrap}>

              <InfoBanner message={formError} variant="warning" />

            </View>

          ) : null}



          <View style={styles.cards}>

            <RoleCard

              variant="candidate"

              icon="person"

              title={t.roleCandidate}

              subtitle={t.roleCandidateSubtitle}

              bullets={t.roleCandidateBullets}

              onPress={() => openRole('candidate')}

              disabled={loading !== null}

            />

            <RoleCard

              variant="employer"

              icon="business"

              title={t.roleEmployer}

              subtitle={t.roleEmployerSubtitle}

              bullets={t.roleEmployerBullets}

              onPress={() => openRole('employer')}

              disabled={loading !== null}

            />

          </View>



          <View style={[styles.trustRow, rtl.row]}>

            <AppIcon name="checkmark-circle" size={18} color={colors.textSecondary} />

            <Text

              style={[

                styles.trustText,

                { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },

              ]}

            >

              {t.roleSelectionTrust}

            </Text>

          </View>



          {!hasSession ? (

            <Text

              style={[

                styles.footerHint,

                { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },

              ]}

            >

              {t.roleSelectionNextHint}

            </Text>

          ) : null}

        </ContentWidth>

      </ScrollView>



      <RoleConfirmModal
        visible={confirmRoleChoice !== null}
        role={confirmRoleChoice ?? 'candidate'}
        loading={loading !== null}
        onConfirm={() => confirmRoleChoice && void confirmRole(confirmRoleChoice)}
        onClose={() => setConfirmRoleChoice(null)}
      />

    </Screen>

  );

}



function RoleCard({

  variant,

  icon,

  title,

  subtitle,

  bullets,

  onPress,

  disabled,

}: {

  variant: 'candidate' | 'employer';

  icon: 'person' | 'business';

  title: string;

  subtitle: string;

  bullets: readonly string[];

  onPress: () => void;

  disabled?: boolean;

}) {

  const rtl = useRtlStyles();

  const accent = variant === 'candidate' ? colors.primary : colors.secondary;

  const tint = variant === 'candidate' ? colors.primaryTint : colors.secondaryTint;

  const scale = useRef(new Animated.Value(1)).current;



  const animateTo = (value: number) => {

    Animated.spring(scale, {

      toValue: value,

      useNativeDriver: true,

      speed: 28,

      bounciness: 6,

    }).start();

  };



  return (

    <Pressable

      onPress={onPress}

      disabled={disabled}

      accessibilityRole="button"

      accessibilityLabel={title}

      onPressIn={() => !disabled && animateTo(interaction.pressScale)}

      onPressOut={() => animateTo(1)}

    >

      <Animated.View

        style={[

          styles.card,

          {

            borderColor: `${accent}55`,

            backgroundColor: tint,

            transform: [{ scale }],

          },

          disabled && styles.cardDisabled,

        ]}

      >

        <View style={[styles.cardHeader, rtl.row]}>

          <View style={[styles.iconCircle, { backgroundColor: accent }]}>

            <AppIcon name={icon} size={26} color="#fff" />

          </View>

          <View style={styles.cardHeaderText}>

            <Text style={[styles.cardTitle, { textAlign: rtl.textAlign }]} numberOfLines={2}>

              {title}

            </Text>

            <Text style={[styles.cardSub, { textAlign: rtl.textAlign }]} numberOfLines={2}>

              {subtitle}

            </Text>

          </View>

          <AppIcon

            name={rtl.isRtl ? 'chevron-back' : 'chevron-forward'}

            size={22}

            color={accent}

          />

        </View>

        <View style={styles.bulletList}>

          {bullets.map((line) => (

            <View key={line} style={[styles.bulletRow, rtl.row]}>

              <View style={[styles.bulletDot, { backgroundColor: accent }]} />

              <Text

                style={[

                  styles.bulletText,

                  { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },

                ]}

              >

                {line}

              </Text>

            </View>

          ))}

        </View>

      </Animated.View>

    </Pressable>

  );

}



const styles = StyleSheet.create({

  screen: { paddingHorizontal: 0 },

  scroll: {

    flexGrow: 1,

    paddingBottom: spacing.xxxl,

    paddingTop: spacing.lg,

  },

  kicker: {

    ...typography.caption,

    fontWeight: '700',

    color: colors.primary,

    textTransform: 'uppercase',

    letterSpacing: 1.2,

    marginBottom: spacing.sm,

  },

  title: {

    ...typography.h1,

    marginTop: spacing.md,

    marginBottom: spacing.sm,

  },

  subtitle: {

    ...typography.body,

    color: colors.textSecondary,

    marginBottom: spacing.xl,

    paddingHorizontal: spacing.xs,

    lineHeight: 24,

  },

  bannerWrap: { marginBottom: spacing.lg, width: '100%' },

  cards: { gap: spacing.lg, width: '100%' },

  card: {

    borderRadius: 20,

    padding: spacing.lg,

    borderWidth: 1.5,

    ...Platform.select({

      ios: {

        shadowColor: '#0f172a',

        shadowOpacity: 0.08,

        shadowRadius: 16,

        shadowOffset: { width: 0, height: 6 },

      },

      android: { elevation: 4 },

    }),

  },

  cardDisabled: { opacity: interaction.disabled },

  cardHeader: {

    alignItems: 'center',

    gap: spacing.md,

    marginBottom: spacing.md,

  },

  iconCircle: {

    width: 52,

    height: 52,

    borderRadius: 26,

    alignItems: 'center',

    justifyContent: 'center',

  },

  cardHeaderText: { flex: 1, minWidth: 0 },

  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },

  cardSub: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },

  bulletList: { gap: spacing.sm },

  bulletRow: { alignItems: 'flex-start', gap: spacing.sm },

  bulletDot: {

    width: 6,

    height: 6,

    borderRadius: 3,

    marginTop: 7,

  },

  bulletText: {

    ...typography.caption,

    color: colors.textPrimary,

    flex: 1,

    lineHeight: 20,

  },

  trustRow: {

    alignItems: 'center',

    gap: spacing.sm,

    marginTop: spacing.xl,

    paddingHorizontal: spacing.sm,

  },

  trustText: {

    ...typography.caption,

    color: colors.textSecondary,

    flex: 1,

    lineHeight: 18,

  },

  footerHint: {

    ...typography.caption,

    color: colors.textSecondary,

    marginTop: spacing.md,

    lineHeight: 20,

  },

});

