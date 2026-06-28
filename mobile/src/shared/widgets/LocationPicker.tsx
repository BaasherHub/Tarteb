import { useEffect, useMemo, useRef, useState } from 'react';
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
  const keepTypedAreaQuery = useRef(false);

  useEffect(() => {
    const p = parseLocation(value);
    const nextEmirate = UAE_EMIRATES.includes(p.emirate as UaeEmirate)
      ? (p.emirate as UaeEmirate)
      : undefined;

    if (nextEmirate) {
      setEmirate(nextEmirate);
    }

    if (keepTypedAreaQuery.current && !p.area && (!nextEmirate || nextEmirate === emirate)) {
      keepTypedAreaQuery.current = false;
      return;
    }

    setAreaQuery(p.area ?? '');
  }, [emirate, value]);

  const areaOptions = useMemo(
    () => filterAreas(emirate, areaQuery, 12),
    [emirate, areaQuery],
  );

  const commitAreaQuery = (q: string) => {
    setAreaQuery(q);
    const resolved = resolveArea(emirate, q);
    if (resolved) {
      keepTypedAreaQuery.current = false;
      onChange(formatLocation(emirate, resolved));
    } else if (!q.trim()) {
      keepTypedAreaQuery.current = false;
      onChange(emirate);
    } else {
      keepTypedAreaQuery.current = true;
      onChange(emirate);
    }
  };

  const selectEmirate = (next: UaeEmirate) => {
    keepTypedAreaQuery.current = false;
    setEmirate(next);
    setAreaQuery('');
    onChange(next);
  };

  const selectArea = (area: string) => {
    keepTypedAreaQuery.current = false;
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
      <AutocompleteField
        label={t.locationEmirate}
        required
        value={emirate}
        onChangeText={() => undefined}
        onSelect={(next) => selectEmirate(next as UaeEmirate)}
        options={[...UAE_EMIRATES]}
        error={error && !value ? error : undefined}
        selectOnly
        dropdownMaxHeight={104}
        dropdownPlacement="above"
      />
      <AutocompleteField
        label={t.locationArea}
        required={areaRequired}
        optional={!areaRequired}
        hint={areaHint ?? t.locationAreaHint}
        value={areaQuery}
        onChangeText={commitAreaQuery}
        onSelect={selectArea}
        options={areaOptions}
        emptyHint={t.locationNoMatch}
        onBlur={handleAreaBlur}
        dropdownMaxHeight={104}
        dropdownPlacement="above"
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
  wrap: { marginTop: spacing.sm, marginBottom: spacing.xs, gap: spacing.sm, zIndex: 50 },
  selected: { ...typography.caption, color: colors.primary, fontWeight: '600' },
});
