import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { VisaChip } from '@/shared/widgets/VisaChip';

type Props = {
  item: Record<string, unknown>;
  onPress: () => void;
};

export const CandidateBrowseCard = memo(function CandidateBrowseCard({
  item,
  onPress,
}: Props) {
  const { t, isRtl } = useLocale();
  const name = String(item.name ?? '—');
  const role = String(item.role ?? '');
  const location = String(item.location ?? '');
  const nationality = String(item.nationality ?? '');
  const visa = String(item.visa_status ?? '');
  const salary = item.salary_expectation;
  const photoUrl = item.photo_url as string | undefined;
  const unlocked = item.phone != null;
  const lastActiveAt = item.last_active_at as string | undefined;
  const activeDays = lastActiveAt
    ? Math.floor((Date.now() - new Date(lastActiveAt).getTime()) / 86_400_000)
    : null;

  return (
    <Pressable
      style={[styles.row, isRtl && styles.rowRtl]}
      onPress={onPress}
    >
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.initials}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.meta}>
        <View style={[styles.nameRow, isRtl && styles.rowRtl]}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {unlocked ? (
            <View style={styles.unlockedBadge}>
              <Text style={styles.unlockedText}>{t.unlockedBadge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.role} numberOfLines={1}>
          {role}
        </Text>
        <View style={[styles.chipRow, isRtl && styles.rowRtl]}>
          {visa ? <VisaChip label={visa} /> : null}
          {nationality ? (
            <Text style={styles.nat} numberOfLines={1}>
              {nationality}
            </Text>
          ) : null}
        </View>
        <Text style={styles.sub} numberOfLines={1}>
          {location}
          {salary != null ? ` · ${t.salaryPerMonth(String(salary))}` : ''}
        </Text>
        {activeDays !== null && (
          <Text style={[styles.activeAgo, activeDays <= 3 && styles.activeAgoFresh]}>
            {t.activeAgo(activeDays)}
          </Text>
        )}
      </View>
      <Text style={styles.chevron}>{isRtl ? '‹' : '›'}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.surface,
    gap: 12,
  },
  rowRtl: { flexDirection: 'row-reverse' },
  photo: { width: 56, height: 56, borderRadius: 12 },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 22, fontWeight: '700', color: colors.primary },
  meta: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: { fontSize: 17, fontWeight: '700', flexShrink: 1 },
  role: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  nat: { fontSize: 12, color: colors.textSecondary, maxWidth: 100 },
  sub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  chevron: { fontSize: 22, color: colors.textSecondary, fontWeight: '300' },
  unlockedBadge: {
    backgroundColor: `${colors.secondary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unlockedText: { fontSize: 11, fontWeight: '700', color: colors.secondary },
  activeAgo: { fontSize: 11, color: colors.textSecondary, marginTop: 3 },
  activeAgoFresh: { color: colors.secondary, fontWeight: '600' },
});


