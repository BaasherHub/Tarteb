import React, { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { env } from '@/core/config/env';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
import { openWhatsAppSupport } from '@/shared/utils/whatsapp';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { InfoBanner } from '@/shared/widgets/InfoBanner';

type Props = {
  onLogout: () => void;
};

export function SettingsPanel({ onLogout }: Props) {
  const { t, lang, setLang } = useLocale();
  const rtl = useRtlStyles();
  const [role, setRole] = useState<'candidate' | 'employer' | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('role, created_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.role === 'candidate' || data?.role === 'employer') {
        setRole(data.role);
      }
      if (data?.created_at) {
        const d = new Date(data.created_at as string);
        setMemberSince(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
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
    })();
  }, []);

  const roleLabel =
    role === 'candidate' ? t.roleCandidate : role === 'employer' ? t.roleEmployer : null;

  return (
    <View style={styles.root}>
      {(phone || memberSince) && (
        <View style={styles.accountCard}>
          {phone && (
            <View style={[styles.accountRow, rtl.rowBetween]}>
              <Text style={[styles.accountLabel, { textAlign: rtl.textAlign }]} numberOfLines={1}>
                {t.settingsPhoneLabel}
              </Text>
              <Text
                style={[styles.accountValue, { textAlign: rtl.textAlignEnd, writingDirection: 'ltr' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {phone}
              </Text>
            </View>
          )}
          {memberSince && (
            <View style={[styles.accountRow, rtl.rowBetween, styles.accountRowLast]}>
              <Text style={[styles.accountLabel, { textAlign: rtl.textAlign }]} numberOfLines={1}>
                {t.settingsMemberSince}
              </Text>
              <Text style={[styles.accountValue, { textAlign: rtl.textAlignEnd }]} numberOfLines={1}>
                {memberSince}
              </Text>
            </View>
          )}
        </View>
      )}

      {roleLabel ? (
        <View style={styles.roleCard}>
          <Text style={[styles.roleTitle, { textAlign: rtl.textAlign }]}>{t.yourRole}</Text>
          <Text style={[styles.roleValue, { textAlign: rtl.textAlign }]} numberOfLines={2}>
            {roleLabel}
          </Text>
          <InfoBanner message={t.wrongRoleHelp} variant="info" />
          <Pressable
            onPress={() => {
              void openWhatsAppSupport(t.whatsappSupportMessage);
            }}
            style={styles.roleLink}
            accessibilityRole="button"
            accessibilityLabel={t.contactSupportRole}
          >
            <Text style={styles.roleLinkText} numberOfLines={2}>
              {t.contactSupportRole}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.uaePassCard}>
        <View style={[styles.uaePassRow, rtl.rowBetween]}>
          <View style={styles.uaePassCopy}>
            <Text style={[styles.uaePassTitle, { textAlign: rtl.textAlign }]} numberOfLines={2}>
              {t.uaePassTitle}
            </Text>
            <Text style={[styles.uaePassSub, { textAlign: rtl.textAlign }]} numberOfLines={3}>
              {t.uaePassSub}
            </Text>
          </View>
          <View style={styles.uaePassBadge}>
            <Text style={styles.uaePassBadgeText}>{t.uaePassSoon}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.language}</Text>
      <View style={[styles.chipRow, rtl.row]}>
        <Pressable
          style={[styles.chip, lang === 'en' && styles.chipOn]}
          onPress={() => setLang('en')}
          accessibilityRole="button"
          accessibilityState={{ selected: lang === 'en' }}
        >
          <Text style={styles.chipText}>{t.english}</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, lang === 'ar' && styles.chipOn]}
          onPress={() => setLang('ar')}
          accessibilityRole="button"
          accessibilityState={{ selected: lang === 'ar' }}
        >
          <Text style={styles.chipText}>{t.arabic}</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.item}
        onPress={() => void Linking.openURL(env.privacyPolicyUrl)}
        accessibilityRole="link"
        accessibilityLabel={t.privacyPolicy}
      >
        <Text style={[styles.itemText, { textAlign: rtl.textAlign }]} numberOfLines={2}>
          {t.privacyPolicy}
        </Text>
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() => openWhatsAppSupport(t.whatsappSupportMessage)}
        accessibilityRole="button"
      >
        <Text style={[styles.itemText, { textAlign: rtl.textAlign }]} numberOfLines={2}>
          {t.supportWhatsApp}
        </Text>
      </Pressable>
      <Pressable style={styles.item} onPress={onLogout} accessibilityRole="button">
        <Text style={[styles.danger, { textAlign: rtl.textAlign }]}>{t.logout}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  accountCard: {
    marginBottom: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  accountRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  accountRowLast: { borderBottomWidth: 0 },
  accountLabel: { ...typography.body, color: colors.textSecondary, flex: 1, flexShrink: 0 },
  accountValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    flexShrink: 1,
    marginStart: spacing.md,
  },
  roleCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  roleTitle: { ...typography.label, color: colors.textSecondary },
  roleValue: { ...typography.h2, color: colors.textPrimary },
  roleLink: { marginTop: spacing.xs },
  roleLinkText: { color: colors.primary, fontWeight: '600', fontSize: 14, lineHeight: 20 },
  section: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  chipRow: { gap: spacing.sm, marginBottom: spacing.xxl },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  chipText: { fontSize: 15, color: colors.textPrimary },
  item: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    minHeight: 48,
    justifyContent: 'center',
  },
  itemText: { fontSize: 16, color: colors.textPrimary, lineHeight: 22 },
  danger: { color: colors.error, fontSize: 16, fontWeight: '600' },
  uaePassCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  uaePassRow: { alignItems: 'flex-start' },
  uaePassCopy: { flex: 1, flexShrink: 1, minWidth: 0 },
  uaePassTitle: { ...typography.h3, color: colors.textPrimary },
  uaePassSub: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  uaePassBadge: {
    backgroundColor: colors.primaryTint,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexShrink: 0,
  },
  uaePassBadgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
});
