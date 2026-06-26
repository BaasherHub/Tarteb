import React, { useId, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import {
  ARAB_PHONE_COUNTRIES,
  countryLabel,
  type ArabPhoneCountry,
} from '@/shared/constants/arabPhoneCountries';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { FieldError } from '@/shared/widgets/FieldError';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { playSelectionHaptic } from '@/shared/utils/selectionHaptic';
import { fieldA11yLabel } from '@/shared/utils/a11y';
import { FieldLabel, type FieldLabelFlags } from '@/shared/widgets/FieldLabel';

type Props = FieldLabelFlags & {
  label?: string;
  country: ArabPhoneCountry;
  onCountryChange: (country: ArabPhoneCountry) => void;
  localNumber: string;
  onChangeLocalNumber: (value: string) => void;
  error?: string;
};

export function AuthPhoneNumberField({
  label,
  country,
  onCountryChange,
  localNumber,
  onChangeLocalNumber,
  error,
  required: requiredProp,
  optional: optionalProp,
}: Props) {
  const { lang, t } = useLocale();
  const rtl = useRtlStyles();
  const inputId = useId();
  const [pickerOpen, setPickerOpen] = useState(false);
  const fieldLabel = label ?? t.phoneNumber;
  const required = requiredProp ?? !optionalProp;
  const optional = optionalProp;
  const flags = { required, optional };

  const pickCountry = (next: ArabPhoneCountry) => {
    void playSelectionHaptic();
    onCountryChange(next);
    setPickerOpen(false);
  };

  return (
    <View style={styles.wrap}>
      <FieldLabel
        label={fieldLabel}
        required={required}
        optional={optional}
        nativeID={`${inputId}-label`}
      />

      <View style={[styles.row, error ? styles.rowError : null]}>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={({ pressed }) => [styles.countryBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={t.phoneSelectCountry}
          accessibilityHint={countryLabel(country, lang)}
        >
          <Text style={styles.dial}>{country.dial}</Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>

        <TextInput
          nativeID={inputId}
          value={localNumber}
          onChangeText={onChangeLocalNumber}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          maxLength={country.localMaxLength}
          style={styles.input}
          accessibilityLabel={fieldA11yLabel(
            fieldLabel,
            error ? `${t.a11yFieldInvalid}. ${error}` : undefined,
            undefined,
            flags,
            t,
          )}
        />
      </View>

      {error ? <FieldError message={error} /> : null}

      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
        accessibilityViewIsModal
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setPickerOpen(false)}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          />
          <View style={styles.sheet}>
            <Text style={[styles.sheetTitle, { textAlign: rtl.textAlignCenter }]}>
              {t.phoneSelectCountry}
            </Text>
            <SurfaceCard style={styles.listCard}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {ARAB_PHONE_COUNTRIES.map((item, index) => {
                  const selected = item.id === country.id;
                  return (
                    <React.Fragment key={item.id}>
                      {index > 0 ? <View style={styles.divider} /> : null}
                      <Pressable
                        onPress={() => pickCountry(item)}
                        style={({ pressed }) => [
                          styles.countryRow,
                          rtl.row,
                          selected && styles.countryRowSelected,
                          pressed && styles.pressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                      >
                        <Text style={[styles.countryDial, { textAlign: rtl.textAlign }]}>
                          {item.dial}
                        </Text>
                        <Text
                          style={[styles.countryName, { textAlign: rtl.textAlign }]}
                          numberOfLines={1}
                        >
                          {countryLabel(item, lang)}
                        </Text>
                        {selected ? (
                          <AppIcon name="checkmark-circle" size={20} color={colors.primary} />
                        ) : (
                          <View style={styles.checkSpacer} />
                        )}
                      </Pressable>
                    </React.Fragment>
                  );
                })}
              </ScrollView>
            </SurfaceCard>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginBottom: spacing.fieldGap },
  row: {
    flexDirection: 'row',
    writingDirection: 'ltr',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacing.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    minHeight: 48,
  },
  rowError: {
    borderColor: colors.error,
  },
  countryBtn: {
    flexDirection: 'row',
    writingDirection: 'ltr',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.divider,
    minWidth: 108,
    justifyContent: 'center',
  },
  dial: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  chevron: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    writingDirection: 'ltr',
    textAlign: 'left',
    fontVariant: ['tabular-nums'],
  },
  pressed: { backgroundColor: colors.primaryTint },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sheetTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  listCard: { maxHeight: 420, overflow: 'hidden' },
  countryRow: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  countryRowSelected: {
    backgroundColor: colors.primaryTint,
  },
  countryDial: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    width: 56,
    fontVariant: ['tabular-nums'],
  },
  countryName: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  checkSpacer: { width: 20 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
});
