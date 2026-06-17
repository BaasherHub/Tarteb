import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
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
import { layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { getErrorMessage } from '@/shared/utils/errors';
import { ChangeLanguageLink } from '@/features/auth/presentation/components/ChangeLanguageLink';
import { RoleVisualCard, type RoleCardTheme } from '@/features/auth/presentation/components/RoleVisualCard';
import { useLocale } from '@/core/i18n/LocaleContext';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { ScreenFooter } from '@/shared/widgets/ScreenFooter';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import type { Lang } from '@/core/i18n/strings';

/** Role card colors — same hues as brand tokens, softened via icon opacity in RoleVisualCard. */
const ROLE_CARD_THEMES: Record<PendingAccountRole, RoleCardTheme> = {
  employer: {
    accent: colors.secondary,
    accentTint: colors.secondaryTint,
    icon: colors.secondary,
  },
  candidate: {
    accent: colors.primary,
    accentTint: colors.primaryTint,
    icon: colors.primary,
  },
};

const ROLE_SELECTION_COPY: Record<
  Lang,
  {
    tagline: string;
    pickHint: string;
    pickPrompt: string;
    accountTypeLabel: string;
  }
> = {
  en: {
    tagline: 'Hiring & jobs',
    pickHint: 'Tap Employer or Job seeker above to continue',
    pickPrompt: 'Select a role',
    accountTypeLabel: 'I am a…',
  },
  ar: {
    tagline: 'توظيف وعمل',
    pickHint: 'اضغط «صاحب عمل» أو «باحث عن عمل» أعلاه للمتابعة',
    pickPrompt: 'اختر نوع الحساب',
    accountTypeLabel: 'أنا…',
  },
};

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

export function RoleSelectionScreen({ navigation }: Props) {
  const { lang, t, isHydrated, hasCompletedLanguageSelection, resetLanguageSelection } = useLocale();
  const copy = ROLE_SELECTION_COPY[lang];
  const rtl = useRtlStyles();
  const [hasSession, setHasSession] = useState(false);
  const [selected, setSelected] = useState<PendingAccountRole | null>(null);
  const [loading, setLoading] = useState<'candidate' | 'employer' | null>(null);
  const [formError, setFormError] = useState<string | undefined>();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!error) setHasSession(Boolean(data.session));
    });
  }, []);

  useEffect(() => {
    if (isHydrated && !hasCompletedLanguageSelection) {
      navigation.replace('LanguageSelection');
    }
  }, [isHydrated, hasCompletedLanguageSelection, navigation]);

  if (!isHydrated || !hasCompletedLanguageSelection) {
    return (
      <Screen style={styles.screen}>
        <View style={[styles.flex, styles.boot]}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </Screen>
    );
  }

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
        await routeAuthenticatedUser(navigation);
        return;
      }

      await setPendingAccountRole(role);
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

  const roleLabel =
    selected === 'employer' ? t.roleEmployer : selected === 'candidate' ? t.roleCandidate : '';

  const goToLanguageSelection = () => {
    resetLanguageSelection();
    navigation.replace('LanguageSelection');
  };

  const contentWidthVariant = Platform.OS === 'web' ? 'card' : 'plain';

  return (
    <Screen style={styles.screen}>
      <View style={styles.flex}>
        <ContentWidth style={styles.flex} variant={contentWidthVariant}>
          <View style={[layoutStyles.screenContent, styles.langWrap]}>
            <ChangeLanguageLink onPress={goToLanguageSelection} />
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={[layoutStyles.screenContent, styles.scrollBody]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.centerBlock}>
              <View style={[styles.brandRow, rtl.row, styles.brandRowCentered]}>
                <View style={styles.mark}>
                  <Text style={styles.markLetter}>T</Text>
                </View>
                <Text style={styles.brandName} numberOfLines={1}>
                  {t.appName}
                </Text>
              </View>

              <Text
                style={[
                  styles.tagline,
                  { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
                ]}
              >
                {copy.tagline}
              </Text>

              {formError ? (
                <View style={styles.bannerWrap}>
                  <InfoBanner message={formError} variant="warning" />
                </View>
              ) : null}

              <Text
                style={[
                  styles.accountLabel,
                  { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
                ]}
                accessibilityRole="header"
              >
                {copy.accountTypeLabel}
              </Text>

              <View
                style={[styles.cards, rtl.row]}
                accessibilityRole="radiogroup"
                accessibilityLabel={copy.accountTypeLabel}
              >
                <RoleVisualCard
                  selected={selected === 'employer'}
                  onPress={() => setSelected('employer')}
                  icon="business"
                  title={t.roleEmployer}
                  theme={ROLE_CARD_THEMES.employer}
                  disabled={loading !== null}
                />
                <RoleVisualCard
                  selected={selected === 'candidate'}
                  onPress={() => setSelected('candidate')}
                  icon="person"
                  title={t.roleCandidate}
                  theme={ROLE_CARD_THEMES.candidate}
                  disabled={loading !== null}
                />
              </View>
            </View>
          </ScrollView>

          <ScreenFooter>
            {!selected ? (
              <Text
                style={[
                  styles.pickHint,
                  { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
                ]}
              >
                {copy.pickHint}
              </Text>
            ) : null}
            <PrimaryButton
              label={selected ? t.roleConfirmAction(roleLabel) : copy.pickPrompt}
              onPress={() => {
                if (selected) void confirmRole(selected);
              }}
              loading={loading !== null}
              disabled={loading !== null || !selected}
              accessibilityHint={!selected ? copy.pickHint : undefined}
            />
          </ScreenFooter>
        </ContentWidth>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  flex: { flex: 1, backgroundColor: colors.scaffold },
  boot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  langWrap: {
    paddingBottom: 0,
  },
  scrollBody: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing.lg,
  },
  centerBlock: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  brandRow: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  brandRowCentered: { justifyContent: 'center' },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markLetter: { color: '#fff', fontSize: 22, fontWeight: '700' },
  brandName: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: -0.3,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  accountLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.md,
  },
  bannerWrap: { marginBottom: spacing.md },
  cards: {
    gap: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
});
