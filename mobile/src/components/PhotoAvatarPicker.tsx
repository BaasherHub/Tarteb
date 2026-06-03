import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon } from './AppIcon';
import { useLocale } from '../i18n/LocaleContext';
import { colors } from '../constants/colors';

type Props = {
  imageUri?: string | null;
  initial?: string;
  onPressCamera: () => void;
  onPressGallery: () => void;
};

export function PhotoAvatarPicker({
  imageUri,
  initial = '?',
  onPressCamera,
  onPressGallery,
}: Props) {
  const { t } = useLocale();

  return (
    <View style={styles.wrap}>
      <View style={styles.avatarRing}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <AppIcon name="camera" size={32} color={colors.primary} />
            <Text style={styles.tapLabel}>{t.tapToAddPhoto}</Text>
            <Text style={styles.initial}>{initial.toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onPressCamera}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel={t.camera}
        >
          <AppIcon name="camera" size={18} color={colors.primary} />
          <Text style={styles.actionText}>{t.camera}</Text>
        </Pressable>
        <Pressable
          onPress={onPressGallery}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel={t.gallery}
        >
          <AppIcon name="images" size={18} color={colors.primary} />
          <Text style={styles.actionText}>{t.gallery}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 16 },
  avatarRing: {
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    padding: 4,
    marginBottom: 12,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 70 },
  placeholder: {
    flex: 1,
    borderRadius: 70,
    backgroundColor: `${colors.primary}08`,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tapLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  initial: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: '700',
    color: `${colors.primary}30`,
  },
  actions: { flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  actionText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
});
