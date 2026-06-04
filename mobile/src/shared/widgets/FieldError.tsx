import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '@/core/theme/colors';

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.text} accessibilityRole="alert">{message}</Text>;
}

const styles = StyleSheet.create({
  text: { color: colors.error, fontSize: 13, marginTop: 4, marginBottom: 4 },
});


