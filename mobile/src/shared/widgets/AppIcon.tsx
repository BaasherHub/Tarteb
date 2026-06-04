import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '@/core/theme/colors';
import type { AppIconName } from '@/shared/widgets/AppIcon.types';

export type { AppIconName } from '@/shared/widgets/AppIcon.types';


type Props = {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function AppIcon({ name, size = 22, color = colors.primary, style }: Props) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
