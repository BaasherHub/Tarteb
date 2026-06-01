import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useLocale } from '../../i18n/LocaleContext';
import { colors } from '../../constants/colors';

export function MyUnlocksScreen() {
  const { t } = useLocale();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('unlocks')
        .select('id, unlocked_at, candidates(name, role)')
        .order('unlocked_at', { ascending: false });
      setRows((data ?? []) as Record<string, unknown>[]);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.myUnlocks}</Text>
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No unlocks yet</Text>}
        renderItem={({ item }) => {
          const c = item.candidates as Record<string, unknown> | null;
          return (
            <View style={styles.row}>
              <Text style={styles.name}>{String(c?.name ?? '—')}</Text>
              <Text style={styles.role}>{String(c?.role ?? '')}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.scaffold, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: '700', paddingHorizontal: 16, marginBottom: 8 },
  row: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  name: { fontSize: 16, fontWeight: '600' },
  role: { color: colors.textSecondary, marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 32, color: colors.textSecondary },
});
