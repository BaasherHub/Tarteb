import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { RootStackParamList } from '@/core/navigation/types';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { Screen } from '@/shared/widgets/Screen';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { ScreenHeader } from '@/shared/widgets/ScreenHeader';
import { TabScreenScroll } from '@/shared/widgets/TabScreenScroll';
import { layoutStyles } from '@/core/theme/layout';
import { privacyPolicySections } from '@/features/settings/presentation/content/privacyPolicySections';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export function PrivacyPolicyScreen({ navigation }: Props) {
  const { t, lang } = useLocale();
  const rtl = useRtlStyles();
  const sections = privacyPolicySections(lang);

  return (
    <Screen>
      <ContentWidth style={styles.flex}>
        <TabScreenScroll contentContainerStyle={layoutStyles.screenContent}>
          <ScreenHeader title={t.privacyPolicy} onBack={() => navigation.goBack()} />
          <Text style={[styles.updated, { textAlign: rtl.textAlign }]}>{t.privacyPolicyUpdated}</Text>
          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: rtl.textAlign }]}>{section.title}</Text>
              <Text style={[styles.sectionBody, { textAlign: rtl.textAlign }]}>{section.body}</Text>
            </View>
          ))}
        </TabScreenScroll>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
  updated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, marginBottom: spacing.xs },
  sectionBody: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
});
