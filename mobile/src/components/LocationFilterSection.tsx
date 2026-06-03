import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AutocompleteField } from './AutocompleteField';
import { SelectableChip } from './SelectableChip';
import { useLocale } from '../i18n/LocaleContext';
import { useRtlStyles } from '../hooks/useRtlStyles';
import {
  UAE_EMIRATES,
  UaeEmirate,
  filterAreas,
  formatLocation,
  resolveArea,
  resolveLocationValue,
} from '../constants/uaeLocations';
import { colors } from '../constants/colors';

type Props = {
  locations: string[];
  onChange: (locations: string[]) => void;
};

export function LocationFilterSection({ locations, onChange }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const [emirate, setEmirate] = useState<UaeEmirate>('Dubai');
  const [areaQuery, setAreaQuery] = useState('');

  const areaOptions = useMemo(
    () =>
      filterAreas(emirate, areaQuery, 12).filter(
        (area) => !locations.includes(formatLocation(emirate, area)),
      ),
    [emirate, areaQuery, locations],
  );

  const addLocation = (loc: string) => {
    if (locations.includes(loc)) return;
    onChange([...locations, loc]);
    setAreaQuery('');
  };

  const removeLocation = (loc: string) => {
    onChange(locations.filter((l) => l !== loc));
  };

  const commitArea = () => {
    const loc = resolveLocationValue(emirate, areaQuery);
    if (areaQuery.trim() || loc !== emirate) {
      addLocation(loc);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.hint, { textAlign: rtl.textAlign }]}>{t.locationFilterHint}</Text>
      {locations.length > 0 ? (
        <View style={[styles.chips, rtl.row]}>
          {locations.map((loc) => (
            <SelectableChip
              key={loc}
              label={loc}
              selected
              onPress={() => removeLocation(loc)}
            />
          ))}
        </View>
      ) : null}
      <Text style={[styles.subLabel, { textAlign: rtl.textAlign }]}>{t.locationEmirate}</Text>
      <View style={[styles.chips, rtl.row]}>
        {UAE_EMIRATES.map((e) => (
          <SelectableChip
            key={e}
            label={e}
            selected={emirate === e}
            onPress={() => {
              setEmirate(e);
              setAreaQuery('');
            }}
          />
        ))}
      </View>
      <AutocompleteField
        label={t.locationArea}
        value={areaQuery}
        onChangeText={(q) => {
          setAreaQuery(q);
          const resolved = resolveArea(emirate, q);
          if (resolved) {
            addLocation(formatLocation(emirate, resolved));
          }
        }}
        onSelect={(area) => addLocation(formatLocation(emirate, area))}
        options={areaOptions}
        placeholder={t.locationAreaPlaceholder}
        onBlur={commitArea}
      />
      <SelectableChip
        label={t.addEmirateOnly(emirate)}
        selected={false}
        onPress={() => addLocation(emirate)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  hint: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
  subLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
});
