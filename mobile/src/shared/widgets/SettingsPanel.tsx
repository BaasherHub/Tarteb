import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale, ARABIC_ENABLED } from '@/core/i18n/LocaleContext';
import type { Lang } from '@/core/i18n/strings';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
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
  onEditProfile?: () => void;
  onOpenPrivacy: () => void;
};

function formatMemberSince(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

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
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | undefined>();
  const { showError } = useAppAlert();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user || cancelled) return;

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('role, created_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cancelled) return;
        if (profileError) throw profileError;

        if (data?.role === 'candidate' || data?.role === 'employer') {
          setRole(data.role);
        }
        if (data?.created_at) {
          setMemberSince(formatMemberSince(data.created_at as string, lang));
        }

        if (data?.role === 'candidate') {
          const { data: candidate } = await supabase
            .from('candidates')
            .select('name')
            .eq('user_id', user.id)
            .maybeSingle();
          if (!cancelled && candidate?.name) {
            setDisplayName(String(candidate.name).trim());
          }
        } else if (data?.role === 'employer') {
          const { data: employer } = await supabase
            .from('employers')
            .select('contact_name, company_name')
            .eq('user_id', user.id)
            .maybeSingle();
          if (!cancelled && employer) {
            const name =
              String(employer.contact_name ?? '').trim() ||
              String(employer.company_name ?? '').trim();
            if (name) setDisplayName(name);
          }
        }

        const authPhone = user.phone;
        if (authPhone) setPhone(authPhone);
        else {
          const { data: p } = await supabase
            .from('profiles')
            .select('phone')
            .eq('user_id', user.id)
            .maybeSingle();
          if (p?.phone) setPhone(p.phone as string);
        }
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
  }, [lang, t.errorGeneric]);

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
  const showEditAccount =
    (role === 'candidate' || role === 'employer') && Boolean(onEditProfile);
  const editAccountLabel =
    role === 'employer' ? t.settingsEditCompany : t.settingsEditProfile;
  const showAccountCard =
    loading || Boolean(displayName || phoneDisplay || memberSince || showEditAccount);

  return (
    <View style={styles.root}>
      {profileError ? (
        <Text style={[styles.profileError, { textAlign: rtl.textAlign }]}>{profileError}</Text>
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
            {memberSince ? (
              <AccountInfoRow
                label={t.settingsMemberSince}
                value={memberSince}
                rtl={rtl}
                bordered={Boolean(displayName || phoneDisplay)}
              />
            ) : null}
            {showEditAccount ? (
              <>
                {(displayName || phoneDisplay || memberSince) ? (
                  <View style={styles.rowDivider} />
                ) : null}
                <SettingsLinkRow label={editAccountLabel} onPress={onEditProfile!} />
              </>
            ) : null}
            {phoneDisplay ? (
              <Text style={[styles.accountNotice, { textAlign: rtl.textAlign }]}>{t.accountNotice}</Text>
            ) : null}
          </SurfaceCard>
        )
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
        {Platform.OS !== 'web' ? (
          <Text style={[styles.rtlHint, { textAlign: rtl.textAlign }]}>{t.settingsRtlReloadHint}</Text>
        ) : null}
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
  profileError: {
    ...typography.caption,
    color: colors.error,
    paddingHorizontal: spacing.xs,
    lineHeight: 18,
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
  rtlHint: {
    ...typography.caption,
    color: colors.placeholder,
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
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
