import React, { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale, ARABIC_ENABLED } from '@/core/i18n/LocaleContext';
import { isPushPermissionDenied } from '@/core/services/notifications';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { api } from '@/core/lib/api';
import { getStoredUser } from '@/core/services/tokenStorage';
import { openWhatsAppSupport } from '@/shared/utils/whatsapp';
import { formatPhoneForDisplay } from '@/shared/utils/phone';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { SettingsLinkRow } from '@/shared/widgets/SettingsLinkRow';
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog';
import { useAppAlert } from '@/shared/hooks/useAppAlert';
import { getErrorMessage } from '@/shared/utils/errors';
import { ListRowSkeleton } from '@/shared/widgets/ListRowSkeleton';
import { SectionLabel } from '@/shared/widgets/SectionLabel';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';

type Props = {
  onLogout: () => void | Promise<void>;
  onEditProfile?: () => void | Promise<void>;
  onOpenPrivacy: () => void;
};

function AccountInfoRow({
  label,
  value,
  rtl,
  ltrValue,
  bordered,
}: {
  label: string;
  value: string;
  rtl: ReturnType<typeof useRtlStyles>;
  ltrValue?: boolean;
  bordered?: boolean;
}) {
  return (
    <View style={[styles.accountRow, rtl.row, bordered && styles.accountRowBorder]}>
      <Text style={[styles.accountLabel, { textAlign: rtl.textAlign }]} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[
          styles.accountValue,
          { textAlign: rtl.textAlignEnd },
          ltrValue && { writingDirection: 'ltr' },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  );
}

export function SettingsPanel({ onLogout, onEditProfile, onOpenPrivacy }: Props) {
  const { t, lang, setLang } = useLocale();
  const rtl = useRtlStyles();
  const [role, setRole] = useState<'candidate' | 'employer' | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | undefined>();
  const [retryCount, setRetryCount] = useState(0);
  const [pushDenied, setPushDenied] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const { showError } = useAppAlert();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const storedUser = await getStoredUser();
        if (!storedUser || cancelled) return;

        const profileResult = await api.profiles.me();
        if (cancelled) return;

        const profile = profileResult?.profile;
        if (profile?.role === 'candidate' || profile?.role === 'employer') {
          setRole(profile.role);
        }

        if (profile?.role === 'candidate') {
          const { candidate } = await api.candidates.me();
          if (!cancelled && candidate?.name) {
            setDisplayName(String(candidate.name).trim());
          }
        } else if (profile?.role === 'employer') {
          const { employer } = await api.employers.me();
          if (!cancelled && employer) {
            const name =
              String(employer.contact_name ?? '').trim() ||
              String(employer.company_name ?? '').trim();
            if (name) setDisplayName(name);
          }
        }

        if (storedUser.phone) setPhone(storedUser.phone);
        else if (profile?.phone) setPhone(profile.phone);
      } catch (e) {
        if (!cancelled) {
          setProfileError(getErrorMessage(e, t.errorGeneric));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang, t.errorGeneric, retryCount]);

  useEffect(() => {
    isPushPermissionDenied().then(setPushDenied).catch(() => {});
  }, []);

  const roleLabel =
    role === 'candidate' ? t.roleCandidate : role === 'employer' ? t.roleEmployer : null;

  const confirmLogout = () => setLogoutConfirmOpen(true);

  const runLogout = async () => {
    setLogoutLoading(true);
    try {
      await onLogout();
      setLogoutConfirmOpen(false);
    } catch (e) {
      showError(t.errorTitle, getErrorMessage(e, t.errorGeneric));
    } finally {
      setLogoutLoading(false);
    }
  };

  const phoneDisplay = phone ? formatPhoneForDisplay(phone) : null;
  const runEditProfile = async () => {
    if (!onEditProfile || editLoading) return;
    setEditLoading(true);
    try {
      await onEditProfile();
    } catch (e) {
      showError(t.errorTitle, getErrorMessage(e, t.errorGeneric));
    } finally {
      setEditLoading(false);
    }
  };
  const showEditAccount =
    (role === 'candidate' || role === 'employer') && Boolean(onEditProfile);
  const editAccountLabel =
    role === 'employer' ? t.settingsEditCompany : t.settingsEditProfile;
  const showAccountCard =
    loading || Boolean(displayName || phoneDisplay || showEditAccount);

  return (
    <View style={styles.root}>
      {profileError ? (
        <View style={styles.profileErrorRow}>
          <Text style={[styles.profileError, { textAlign: rtl.textAlign }]}>{profileError}</Text>
          <Pressable
            onPress={() => {
              setProfileError(undefined);
              setLoading(true);
              setRetryCount((n) => n + 1);
            }}
            accessibilityRole="button"
            accessibilityLabel={t.retry}
            style={({ pressed }) => pressed && styles.retryPressed}
          >
            <Text style={styles.retryText}>{t.retry}</Text>
          </Pressable>
        </View>
      ) : null}

      <SectionLabel variant="group" first>
        {t.settingsSectionAccount}
      </SectionLabel>
      {showAccountCard ? (
        loading ? (
          <SurfaceCard>
            <ListRowSkeleton showSeparator />
            <ListRowSkeleton showSeparator />
            <ListRowSkeleton showSeparator={false} />
          </SurfaceCard>
        ) : (
          <SurfaceCard>
            {displayName ? (
              <AccountInfoRow label={t.settingsNameLabel} value={displayName} rtl={rtl} />
            ) : null}
            {phoneDisplay ? (
              <AccountInfoRow
                label={t.settingsPhoneLabel}
                value={phoneDisplay}
                rtl={rtl}
                ltrValue
                bordered={Boolean(displayName)}
              />
            ) : null}
            {showEditAccount ? (
              <>
                {(displayName || phoneDisplay) ? (
                  <View style={styles.rowDivider} />
                ) : null}
                <SettingsLinkRow
                  label={editAccountLabel}
                  onPress={() => void runEditProfile()}
                  loading={editLoading}
                />
              </>
            ) : null}
            {phoneDisplay ? (
              <Text style={[styles.accountNotice, { textAlign: rtl.textAlign }]}>{t.accountNotice}</Text>
            ) : null}
          </SurfaceCard>
        )
      ) : null}

      {pushDenied ? (
        <View style={styles.pushDeniedRow}>
          <Text style={[styles.pushDeniedNote, { textAlign: rtl.textAlign }]}>
            {t.pushDeniedNote}
          </Text>
          <Pressable
            onPress={() => void Linking.openSettings()}
            accessibilityRole="button"
            accessibilityLabel={t.pushDeniedCta}
            style={({ pressed }) => pressed && styles.retryPressed}
          >
            <Text style={styles.pushDeniedCta}>{t.pushDeniedCta}</Text>
          </Pressable>
        </View>
      ) : null}

      <SectionLabel variant="group">{t.settingsSectionPreferences}</SectionLabel>
      <SurfaceCard inset>
        <Text style={[styles.languageHint, { textAlign: rtl.textAlign }]}>{t.settingsLanguageHint}</Text>
        <View style={[styles.chipRow, rtl.row]}>
          <Pressable
            style={[styles.chip, lang === 'en' && styles.chipOn]}
            onPress={() => setLang('en')}
            accessibilityRole="button"
            accessibilityState={{ selected: lang === 'en' }}
          >
            <Text style={[styles.chipText, lang === 'en' && styles.chipTextOn]}>{t.english}</Text>
          </Pressable>
          {ARABIC_ENABLED ? (
            <Pressable
              style={[styles.chip, lang === 'ar' && styles.chipOn]}
              onPress={() => setLang('ar')}
              accessibilityRole="button"
              accessibilityState={{ selected: lang === 'ar' }}
            >
              <Text style={[styles.chipText, lang === 'ar' && styles.chipTextOn]}>{t.arabic}</Text>
            </Pressable>
          ) : null}
        </View>
      </SurfaceCard>

      <SectionLabel variant="group">{t.settingsSectionHelp}</SectionLabel>
      <SurfaceCard>
        <SettingsLinkRow
          label={t.supportWhatsApp}
          onPress={() => openWhatsAppSupport(t.whatsappSupportMessage)}
        />
        <View style={styles.rowDivider} />
        <SettingsLinkRow label={t.privacyPolicy} onPress={onOpenPrivacy} />
      </SurfaceCard>

      {roleLabel ? (
        <>
          <SectionLabel variant="group">{t.settingsSectionAccountType}</SectionLabel>
          <SurfaceCard inset>
            <Text style={[styles.roleValue, { textAlign: rtl.textAlign }]} numberOfLines={2}>
              {roleLabel}
            </Text>
            <Text style={[styles.roleHelp, { textAlign: rtl.textAlign }]} numberOfLines={4}>
              {t.wrongRoleHelp}
            </Text>
            <Pressable
              onPress={() => {
                void openWhatsAppSupport(t.whatsappSupportMessage);
              }}
              accessibilityRole="button"
              accessibilityLabel={t.contactSupportRole}
            >
              <Text style={[styles.roleLink, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                {t.contactSupportRole}
              </Text>
            </Pressable>
          </SurfaceCard>
        </>
      ) : null}

      <SurfaceCard inset style={styles.uaePassCard}>
        <View style={[styles.uaePassRow, rtl.row]}>
          <Text style={[styles.uaePassBody, { textAlign: rtl.textAlign }]} numberOfLines={2}>
            {t.uaePassTitle}
          </Text>
          <View style={styles.uaePassBadge}>
            <Text style={styles.uaePassBadgeText}>{t.uaePassSoon}</Text>
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard style={[styles.logoutCard]}>
        <SettingsLinkRow
          label={t.logout}
          onPress={confirmLogout}
          danger
          showChevron={false}
          accessibilityLabel={t.logout}
        />
      </SurfaceCard>

      <ConfirmDialog
        visible={logoutConfirmOpen}
        title={t.settingsLogoutConfirmTitle}
        message={t.settingsLogoutConfirmMessage}
        confirmLabel={t.settingsLogoutConfirm}
        cancelLabel={t.cancel}
        loading={logoutLoading}
        onConfirm={() => void runLogout()}
        onCancel={() => {
          if (!logoutLoading) setLogoutConfirmOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  profileErrorRow: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  profileError: {
    ...typography.caption,
    color: colors.error,
    lineHeight: 18,
  },
  retryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  retryPressed: { opacity: 0.6 },
  pushDeniedRow: {
    backgroundColor: colors.warningTint,
    borderRadius: 10,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pushDeniedNote: {
    ...typography.caption,
    color: colors.warningText,
  },
  pushDeniedCta: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  accountRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  accountRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  accountLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    flexShrink: 0,
  },
  accountValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  accountNotice: {
    ...typography.caption,
    color: colors.placeholder,
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  languageHint: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  chipRow: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  chip: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.divider,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  chipText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  chipTextOn: { color: colors.primary },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginStart: spacing.lg,
  },
  roleValue: { ...typography.h3, color: colors.textPrimary, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  roleHelp: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  roleLink: { color: colors.primary, fontWeight: '700', fontSize: 14, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  uaePassCard: { marginTop: spacing.xs },
  uaePassRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    opacity: 0.9,
  },
  uaePassBody: { ...typography.body, color: colors.textSecondary, flex: 1 },
  uaePassBadge: {
    backgroundColor: colors.primaryTint,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  uaePassBadgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  logoutCard: { marginTop: spacing.xs },
});
