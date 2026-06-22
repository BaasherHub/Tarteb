import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { layoutStyles } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { playSelectionHaptic } from '@/shared/utils/selectionHaptic';
import { AppBrand } from '@/shared/widgets/AppBrand';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { Screen } from '@/shared/widgets/Screen';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { AppIcon } from '@/shared/widgets/AppIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'LanguageSelection'>;

/** Bilingual copy — shown before a language preference exists. */
const COPY = {
  titleEn: 'Choose your language',
  titleAr: 'اختر لغتك',
  english: 'English',
  arabic: 'العربية',
} as const;

export function LanguageSelectionScreen({ navigation }: Props) {
  const { setLang } = useLocale();

  const pick = (lang: 'en' | 'ar') => {
    void playSelectionHaptic();
    setLang(lang);
    navigation.replace('Splash');
  };

  return (
    <Screen style={styles.screen}>
      <ContentWidth variant="plain" style={styles.flex}>
        <View style={[layoutStyles.screenContent, styles.body]}>
          <AppBrand showTagline={false} />

          <View style={styles.headings}>
            <Text style={styles.titleEn}>{COPY.titleEn}</Text>
            <Text style={styles.titleAr}>{COPY.titleAr}</Text>
          </View>

          <SurfaceCard style={styles.card}>
            <LanguageRow label={COPY.english} onPress={() => pick('en')} />
            <View style={styles.divider} />
            <LanguageRow label={COPY.arabic} onPress={() => pick('ar')} />
          </SurfaceCard>
        </View>
      </ContentWidth>
    </Screen>
  );
}

function LanguageRow({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.iconWrap}>
        <AppIcon name="language-outline" size={22} color={colors.primary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <AppIcon name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  flex: { flex: 1, backgroundColor: colors.scaffold },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xxxl,
  },
  headings: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  titleEn: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titleAr: {
    ...typography.h2,
    color: colors.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  card: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 64,
  },
  rowPressed: { backgroundColor: colors.primaryTint },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
});
