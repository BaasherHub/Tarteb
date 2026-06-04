import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import {
  matchHiringRoleFilter,
  parseCandidateRoles,
} from '@/shared/utils/candidateRoles';

type Layout = 'card' | 'detail' | 'profile';

type Props = {
  role?: unknown;
  additional_roles?: unknown;
  hiringRole?: string | null;
  layout?: Layout;
};

export const CandidateRolesDisplay = memo(function CandidateRolesDisplay({
  role,
  additional_roles,
  hiringRole,
  layout = 'detail',
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const parsed = parseCandidateRoles({ role, additional_roles });

  if (!parsed) return null;

  const isEmployer = layout !== 'profile';
  const filterMatch = isEmployer
    ? matchHiringRoleFilter({ role, additional_roles }, hiringRole)
    : null;
  const primaryLabel =
    layout === 'profile' ? t.candidatePrimaryRoleBadge : t.employerPrimaryRoleBadge;
  const alsoPrefix =
    layout === 'profile' ? t.candidateAlsoOpenTo : t.employerAlsoOpenTo;

  if (layout === 'card') {
    return (
      <View style={styles.cardRoot}>
        {filterMatch === 'additional' ? (
          <Text style={[styles.matchLineSecondary, { textAlign: rtl.textAlign }]} numberOfLines={2}>
            {t.employerMatchSecondaryShort(hiringRole!)}
          </Text>
        ) : null}
        {filterMatch === 'primary' ? (
          <Text style={[styles.matchLinePrimary, { textAlign: rtl.textAlign }]} numberOfLines={1}>
            {t.employerMatchPrimaryShort}
          </Text>
        ) : null}
        <Text style={[styles.cardPrimary, { textAlign: rtl.textAlign }]} numberOfLines={1}>
          <Text style={styles.cardLabel}>{primaryLabel} · </Text>
          {parsed.primary}
        </Text>
        {parsed.additional.length > 0 ? (
          <Text
            style={[styles.cardAlso, { textAlign: rtl.textAlign }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            <Text style={styles.cardLabel}>{alsoPrefix}: </Text>
            {parsed.additional.join(', ')}
          </Text>
        ) : null}
      </View>
    );
  }

  if (layout === 'profile') {
    return (
      <View style={styles.cardRoot}>
        <Text style={[styles.cardPrimary, { textAlign: rtl.textAlignCenter }]} numberOfLines={2}>
          <Text style={styles.cardLabel}>{primaryLabel} · </Text>
          {parsed.primary}
        </Text>
        {parsed.additional.length > 0 ? (
          <Text
            style={[styles.cardAlso, { textAlign: rtl.textAlignCenter }]}
            numberOfLines={2}
          >
            <Text style={styles.cardLabel}>{alsoPrefix}: </Text>
            {parsed.additional.join(', ')}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.detailRoot}>
      {filterMatch === 'additional' ? (
        <Text style={[styles.matchLineSecondary, { textAlign: rtl.textAlign }]} numberOfLines={2}>
          {t.employerMatchSecondaryShort(hiringRole!)}
        </Text>
      ) : null}
      {filterMatch === 'primary' ? (
        <Text style={[styles.matchLinePrimary, { textAlign: rtl.textAlign }]} numberOfLines={1}>
          {t.employerMatchPrimaryShort}
        </Text>
      ) : null}
      <Text style={[styles.detailPrimary, { textAlign: rtl.textAlign }]}>
        <Text style={styles.detailLabel}>{primaryLabel} · </Text>
        {parsed.primary}
      </Text>
      {parsed.additional.length > 0 ? (
        <Text style={[styles.detailAlso, { textAlign: rtl.textAlign }]}>
          <Text style={styles.detailLabel}>{alsoPrefix}: </Text>
          {parsed.additional.join(' · ')}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  cardRoot: { gap: 2, marginTop: spacing.xs },
  detailRoot: { gap: spacing.xs, width: '100%' },
  matchLinePrimary: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  matchLineSecondary: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  cardLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  cardPrimary: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardAlso: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  detailPrimary: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailAlso: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
