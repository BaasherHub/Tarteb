import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { colors } from '@/core/theme/colors';
import type { AppIconName } from '@/shared/widgets/AppIcon.types';


type Props = {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const WEB_SYMBOLS: Record<AppIconName, string> = {
  person: '👤',
  business: '🏢',
  settings: '⚙',
  camera: '📷',
  images: '🖼',
  'chevron-forward': '›',
  'chevron-back': '‹',
  home: '⌂',
  search: '⌕',
  'checkmark-circle': '✓',
  time: '◷',
  'logo-whatsapp': '💬',
};

export function AppIcon({ name, size = 22, color = colors.primary, style }: Props) {
  return (
    <Text style={[{ fontSize: size, color, lineHeight: size + 2 }, style]}>
      {WEB_SYMBOLS[name]}
    </Text>
  );
}
