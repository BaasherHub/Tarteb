import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';

type Props = { active: boolean; pending?: boolean };

export function SubscriptionStepper({ active, pending = false }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const steps = [
    { title: t.subStep1Title, desc: t.subStep1Desc, icon: 'logo-whatsapp' as const },
    { title: t.subStep2Title, desc: t.subStep2Desc, icon: 'time' as const },
    { title: t.subStep3Title, desc: t.subStep3Desc, icon: 'checkmark-circle' as const },
  ];
  const current = active ? 3 : pending ? 2 : 1;

  return (
    <View style={styles.wrap}>
      {steps.map((step, i) => {
        const done = i + 1 < current;
        const currentStep = i + 1 === current;
        return (
          <View key={step.title} style={[styles.row, rtl.row]}>
            <View
              style={[
                styles.dot,
                done && styles.dotDone,
                currentStep && styles.dotCurrent,
              ]}
            >
              <AppIcon
                name={step.icon}
                size={16}
                color={done || currentStep ? '#fff' : colors.textSecondary}
              />
            </View>
            <View style={styles.textCol}>
              <Text
                style={[styles.title, (done || currentStep) && styles.titleActive, { textAlign: rtl.textAlign }]}
                numberOfLines={2}
              >
                {step.title}
              </Text>
              <Text
                style={[styles.desc, { textAlign: rtl.textAlign }]}
                numberOfLines={3}
              >
                {step.desc}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg, marginVertical: spacing.sm },
  row: { gap: spacing.md, alignItems: 'flex-start' },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotDone: { backgroundColor: colors.secondary },
  dotCurrent: { backgroundColor: colors.primary },
  textCol: { flex: 1, minWidth: 0 },
  title: { ...typography.h3, color: colors.textSecondary },
  titleActive: { color: colors.textPrimary },
  desc: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
