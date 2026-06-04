import { Image, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import type { AppIconName } from '@/shared/widgets/AppIcon.types';

type Props = {
  imageUri?: string | null;
  onPressCamera: () => void;
  onPressGallery: () => void;
  size?: 'default' | 'large';
};

function ActionButton({
  label,
  icon,
  onPress,
  variant,
  rtlRow,
}: {
  label: string;
  icon: AppIconName;
  onPress: () => void;
  variant: 'primary' | 'secondary';
  rtlRow: ViewStyle['flexDirection'];
}) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        primary ? styles.actionPrimary : styles.actionSecondary,
        pressed && styles.actionPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.actionInner, { flexDirection: rtlRow }]}>
        <View style={styles.iconSlot}>
          <AppIcon
            name={icon}
            size={20}
            color={primary ? '#fff' : colors.primary}
          />
        </View>
        <Text
          style={primary ? styles.actionTextPrimary : styles.actionText}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function PhotoAvatarPicker({
  imageUri,
  onPressCamera,
  onPressGallery,
  size = 'default',
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const large = size === 'large';
  const ring = large ? 168 : 132;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.avatarRing,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            borderColor: imageUri ? colors.secondary : colors.primary,
            borderStyle: imageUri ? 'solid' : 'dashed',
          },
        ]}
      >
        {imageUri ? (
          <>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.avatar,
                {
                  width: ring - 12,
                  height: ring - 12,
                  borderRadius: (ring - 12) / 2,
                },
              ]}
            />
            <View style={[styles.checkBadge, rtl.isRtl ? styles.checkRtl : styles.checkLtr]}>
              <AppIcon name="checkmark-circle" size={26} color={colors.secondary} />
            </View>
          </>
        ) : (
          <Pressable
            onPress={onPressGallery}
            style={[
              styles.placeholder,
              {
                width: ring - 12,
                height: ring - 12,
                borderRadius: (ring - 12) / 2,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t.tapToAddPhoto}
          >
            <AppIcon name="person" size={large ? 40 : 32} color={colors.primary} />
            <Text style={[styles.tapLabel, large && styles.tapLabelLarge]} numberOfLines={2}>
              {t.tapToAddPhoto}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.actionsRow, rtl.row]}>
        <ActionButton
          label={t.camera}
          icon="camera"
          onPress={onPressCamera}
          variant="primary"
          rtlRow={rtl.row.flexDirection}
        />
        <ActionButton
          label={t.gallery}
          icon="images-outline"
          onPress={onPressGallery}
          variant="secondary"
          rtlRow={rtl.row.flexDirection}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.sm,
  },
  avatarRing: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  avatar: {
    backgroundColor: colors.divider,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 2,
  },
  checkLtr: { right: 2 },
  checkRtl: { left: 2 },
  placeholder: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tapLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 120,
  },
  tapLabelLarge: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    width: '100%',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  actionBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  actionPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionSecondary: {
    backgroundColor: colors.surface,
    borderColor: `${colors.primary}55`,
  },
  actionPressed: {
    opacity: 0.88,
  },
  actionInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconSlot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
  actionTextPrimary: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
});
