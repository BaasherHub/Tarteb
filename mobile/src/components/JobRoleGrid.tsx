import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { POPULAR_ROLES, ROLE_CATEGORIES } from '../constants/candidate';
import { colors } from '../constants/colors';
import { useLocale } from '../i18n/LocaleContext';

type Props = {
  selectedRole?: string | null;
  onSelectRole: (role: string) => void;
  /** Optional map of role → candidate count to display on each card. */
  counts?: Record<string, number>;
};

export function JobRoleGrid({ selectedRole, onSelectRole, counts }: Props) {
  const { lang } = useLocale();

  const renderRole = (role: string) => {
    const selected = selectedRole === role;
    const count = counts?.[role];
    return (
      <Pressable
        key={role}
        onPress={() => onSelectRole(role)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={role}
        style={({ pressed }) => [
          styles.card,
          selected && styles.cardSelected,
          pressed && !selected && styles.cardPressed,
        ]}
      >
        <Text style={[styles.label, selected && styles.labelSelected]}>{role}</Text>
        {count != null && count > 0 && (
          <Text style={[styles.count, selected && styles.countSelected]}>
            {count}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>
        {lang === 'ar' ? 'الأكثر طلباً' : 'Popular'}
      </Text>
      <View style={styles.grid}>
        {POPULAR_ROLES.map(renderRole)}
      </View>

      {ROLE_CATEGORIES.map((cat) => (
        <View key={cat.label}>
          <Text style={styles.sectionHeader}>
            {lang === 'ar' ? cat.labelAr : cat.label}
          </Text>
          <View style={styles.grid}>
            {cat.roles.map(renderRole)}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 20,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    minWidth: '47%',
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  cardPressed: { opacity: 0.92 },
  label: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  labelSelected: { color: colors.primary },
  count: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 3,
  },
  countSelected: { color: colors.primary },
});
