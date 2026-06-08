import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import {
  UAE_EMIRATES,
  UaeEmirate,
  filterAreas,
  formatLocation,
  parseLocation,
  resolveArea,
} from '@/shared/constants/uaeLocations';
import { AutocompleteField } from '@/shared/widgets/AutocompleteField';
import { FieldError } from '@/shared/widgets/FieldError';
import { FieldLabel } from '@/shared/widgets/FieldLabel';
import { SelectableChip } from '@/shared/widgets/SelectableChip';

type Props = {
  value: string;
  onChange: (location: string) => void;
  error?: string;
  areaHint?: string;
  /** When true, area/district must be filled (candidate onboarding). */
  areaRequired?: boolean;
};

export function LocationPicker({
  value,
  onChange,
  error,
  areaHint,
  areaRequired = false,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const parsed = parseLocation(value);
  const [emirate, setEmirate] = useState<UaeEmirate>(
    (UAE_EMIRATES.includes(parsed.emirate as UaeEmirate)
      ? parsed.emirate
      : 'Dubai') as UaeEmirate,
  );
  const [areaQuery, setAreaQuery] = useState(parsed.area ?? '');

  useEffect(() => {
    const p = parseLocation(value);
    if (UAE_EMIRATES.includes(p.emirate as UaeEmirate)) {
      setEmirate(p.emirate as UaeEmirate);
    }
    setAreaQuery(p.area ?? '');
  }, [value]);

  const areaOptions = useMemo(
    () => filterAreas(emirate, areaQuery, 12),
    [emirate, areaQuery],
  );

  const commitAreaQuery = (q: string) => {
    setAreaQuery(q);
    const resolved = resolveArea(emirate, q);
    if (resolved) {
      onChange(formatLocation(emirate, resolved));
    } else if (!q.trim()) {
      onChange(emirate);
    }
  };

  const selectEmirate = (next: UaeEmirate) => {
    setEmirate(next);
    setAreaQuery('');
    onChange(next);
  };

  const selectArea = (area: string) => {
    setAreaQuery(area);
    onChange(formatLocation(emirate, area));
  };

  const handleAreaBlur = () => {
    const resolved = resolveArea(emirate, areaQuery);
    if (resolved && parseLocation(value).area !== resolved) {
      onChange(formatLocation(emirate, resolved));
      setAreaQuery(resolved);
    }
  };

  return (
    <View style={styles.wrap}>
      <FieldLabel label={t.locationEmirate} required />
      <FieldError message={error && !value ? error : undefined} />
      <View style={[styles.chips, rtl.row]}>
        {UAE_EMIRATES.map((e) => (
          <SelectableChip
            key={e}
            label={e}
            selected={parseLocation(value).emirate === e && !parseLocation(value).area}
            onPress={() => selectEmirate(e)}
          />
        ))}
      </View>
      <AutocompleteField
        label={t.locationArea}
        required={areaRequired}
        optional={!areaRequired}
        hint={areaHint ?? t.locationAreaHint}
        value={areaQuery}
        onChangeText={commitAreaQuery}
        onSelect={selectArea}
        options={areaOptions}
        placeholder={t.locationAreaPlaceholder}
        emptyHint={t.locationNoMatch}
        onBlur={handleAreaBlur}
      />
      {value ? (
        <Text
          style={[styles.selected, { textAlign: rtl.textAlign }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {t.locationSelected}: {value}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.sm, marginBottom: spacing.xs, gap: spacing.sm },
  chips: { flexWrap: 'wrap', gap: spacing.sm },
  selected: { ...typography.caption, color: colors.primary, fontWeight: '600' },
});
