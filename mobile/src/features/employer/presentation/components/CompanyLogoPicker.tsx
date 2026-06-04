import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { layout } from '@/core/theme/layout';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';

type Props = {
  imageUri?: string | null;
  companyInitial?: string;
  onPressGallery: () => void;
};

export function CompanyLogoPicker({ imageUri, companyInitial = 'C', onPressGallery }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const size = 112;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPressGallery}
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: layout.cardRadius,
            borderColor: imageUri ? colors.secondary : colors.primary,
            borderStyle: imageUri ? 'solid' : 'dashed',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t.companyLogoTap}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.logo} />
        ) : (
          <View style={styles.placeholder}>
            <AppIcon name="business" size={36} color={colors.primary} />
            <Text style={styles.initial}>{companyInitial.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </Pressable>
      <Text style={[styles.hint, { textAlign: rtl.textAlignCenter }]}>{t.companyLogoHint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.md },
  ring: {
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  logo: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  initial: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primary,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
