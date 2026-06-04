import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { FieldError } from '@/shared/widgets/FieldError';

type Props = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (value: string) => void;
  options: string[];
  error?: string;
  hint?: string;
  emptyHint?: string;
};

export function AutocompleteField({
  label,
  value,
  onChangeText,
  onSelect,
  options,
  error,
  hint,
  emptyHint,
  placeholder,
  ...inputProps
}: Props) {
  const rtl = useRtlStyles();
  const [focused, setFocused] = useState(false);
  const showList = focused && options.length > 0;

  const list = useMemo(() => options, [options]);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { textAlign: rtl.textAlign }]}>{label}</Text>
      {hint ? (
        <Text style={[styles.hint, { textAlign: rtl.textAlign }]}>{hint}</Text>
      ) : null}
      <TextInput
        {...inputProps}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => setFocused(false), 150);
        }}
        style={[
          styles.input,
          error ? styles.inputError : null,
          { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
        ]}
        accessibilityLabel={label}
      />
      {showList ? (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={list}
            keyExtractor={(item) => item}
            nestedScrollEnabled
            style={styles.list}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  setFocused(false);
                }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: `${colors.primary}10` },
                ]}
              >
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      ) : focused && value.trim() && list.length === 0 && emptyHint ? (
        <Text style={styles.emptyHint}>{emptyHint}</Text>
      ) : null}
      <FieldError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 8, zIndex: 1 },
  label: { marginBottom: 4, color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  hint: { marginBottom: 6, color: colors.textSecondary, fontSize: 12, lineHeight: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.surface,
    fontSize: 16,
    minHeight: 48,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    backgroundColor: colors.surface,
    maxHeight: 200,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  list: { flexGrow: 0 },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  optionText: { fontSize: 15, color: colors.textPrimary },
  emptyHint: { marginTop: 6, fontSize: 12, color: colors.textSecondary },
});

