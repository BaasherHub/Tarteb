import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '@/core/lib/supabase';
import { useLocale } from '@/core/i18n/LocaleContext';
import { RootStackParamList } from '@/core/navigation/types';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { EmptyState } from '@/shared/widgets/EmptyState';
import { colors } from '@/core/theme/colors';


type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MyUnlocksScreen() {
  const { t } = useLocale();
  const navigation = useNavigation<Nav>();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('unlocks')
        .select('id, candidate_id, unlocked_at, candidates(name, role, visa_status, location)')
        .order('unlocked_at', { ascending: false });
      setRows((data ?? []) as Record<string, unknown>[]);
    })();
  }, []);

  return (
    <ContentWidth style={styles.container}>
      <Text style={styles.title}>{t.myUnlocks}</Text>
      <FlatList
        style={styles.list}
        data={rows}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <EmptyState
            title={t.noUnlocksYet}
            message={t.noUnlocksHint}
            actionLabel={t.browse}
            onAction={() =>
              navigation.getParent()?.navigate('BrowseTab' as never)
            }
          />
        }
        renderItem={({ item }) => {
          const c = item.candidates as Record<string, unknown> | null;
          return (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() =>
                navigation.navigate('CandidateDetail', {
                  candidateId: String(item.candidate_id),
                })
              }
            >
              <Text style={styles.name}>{String(c?.name ?? '—')}</Text>
              <Text style={styles.role}>{String(c?.role ?? '')}</Text>
              {c?.visa_status ? (
                <Text style={styles.visa}>{String(c.visa_status)}</Text>
              ) : null}
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.scaffold, paddingTop: 16 },
  list: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', paddingHorizontal: 16, marginBottom: 8 },
  row: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  rowPressed: { opacity: 0.75 },
  name: { fontSize: 16, fontWeight: '600' },
  role: { color: colors.textSecondary, marginTop: 4 },
  visa: { fontSize: 12, color: colors.primary, marginTop: 6, fontWeight: '600' },
  sep: { height: 1, backgroundColor: colors.divider },
});
