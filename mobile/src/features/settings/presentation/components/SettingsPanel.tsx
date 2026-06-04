import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
import { openWhatsAppSupport } from '@/shared/utils/whatsapp';
import { colors } from '@/core/theme/colors';
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

      // Phone comes from auth metadata or profiles.phone
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
    <View>
      {(phone || memberSince) && (
        <View style={styles.accountCard}>
          {phone && (
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Phone</Text>
              <Text style={styles.accountValue}>{phone}</Text>
            </View>
          )}
          {memberSince && (
            <View style={[styles.accountRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.accountLabel}>Member since</Text>
              <Text style={styles.accountValue}>{memberSince}</Text>
            </View>
          )}
        </View>
      )}

      {roleLabel ? (
        <View style={styles.roleCard}>
          <Text style={[styles.roleTitle, { textAlign: rtl.textAlign }]}>
            {t.yourRole}
          </Text>
          <Text style={[styles.roleValue, { textAlign: rtl.textAlign }]}>{roleLabel}</Text>
          <InfoBanner message={t.wrongRoleHelp} variant="info" />
          <Pressable
            onPress={() => {
              void openWhatsAppSupport();
            }}
            style={styles.roleLink}
            accessibilityRole="button"
            accessibilityLabel={t.contactSupportRole}
          >
            <Text style={styles.roleLinkText}>{t.contactSupportRole}</Text>
          </Pressable>
        </View>
      ) : null}

      {/* UAE Pass — coming soon */}
      <View style={styles.uaePassCard}>
        <View style={styles.uaePassRow}>
          <View>
            <Text style={styles.uaePassTitle}>UAE Pass Verification</Text>
            <Text style={styles.uaePassSub}>Verify your identity with the UAE national ID</Text>
          </View>
          <View style={styles.uaePassBadge}>
            <Text style={styles.uaePassBadgeText}>Soon</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.language}</Text>
      <View style={[styles.row, rtl.row]}>
        <Pressable
          style={[styles.chip, lang === 'en' && styles.chipOn]}
          onPress={() => setLang('en')}
          accessibilityRole="button"
          accessibilityState={{ selected: lang === 'en' }}
        >
          <Text>{t.english}</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, lang === 'ar' && styles.chipOn]}
          onPress={() => setLang('ar')}
          accessibilityRole="button"
          accessibilityState={{ selected: lang === 'ar' }}
        >
          <Text>{t.arabic}</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.item}
        onPress={() => openWhatsAppSupport()}
        accessibilityRole="button"
      >
        <Text>{t.supportWhatsApp}</Text>
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={onLogout}
        accessibilityRole="button"
      >
        <Text style={styles.danger}>{t.logout}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  accountCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  accountLabel: { fontSize: 14, color: colors.textSecondary },
  accountValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  roleCard: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  roleTitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  roleValue: { fontSize: 18, fontWeight: '700', marginTop: 4, marginBottom: 8 },
  roleLink: { marginTop: 4 },
  roleLinkText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  section: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipOn: { borderColor: colors.primary, backgroundColor: `${colors.primary}15` },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    minHeight: 48,
    justifyContent: 'center',
  },
  danger: { color: colors.error },
  uaePassCard: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  uaePassRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  uaePassTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  uaePassSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  uaePassBadge: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  uaePassBadgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
});
