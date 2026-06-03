import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppIcon } from './AppIcon';
import { useLocale } from '../i18n/LocaleContext';
import { colors } from '../constants/colors';

type Props = { active: boolean; pending?: boolean };

export function SubscriptionStepper({ active, pending = false }: Props) {
  const { t, isRtl } = useLocale();
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
          <View
            key={step.title}
            style={[styles.row, isRtl && styles.rowRtl]}
          >
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
              <Text style={[styles.title, (done || currentStep) && styles.titleActive]}>
                {step.title}
              </Text>
              <Text style={styles.desc}>{step.desc}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14, marginVertical: 8 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  rowRtl: { flexDirection: 'row-reverse' },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.secondary },
  dotCurrent: { backgroundColor: colors.primary },
  textCol: { flex: 1 },
  title: { fontWeight: '600', fontSize: 15, color: colors.textSecondary },
  titleActive: { color: colors.textPrimary },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
});
