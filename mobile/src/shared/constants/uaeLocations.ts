/** All seven UAE emirates (federal members). */
export const UAE_EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
] as const;

export type UaeEmirate = (typeof UAE_EMIRATES)[number];

/**
 * Major districts / communities per emirate (curated for hiring proximity).
 * Sources: UAE government emirate list, Dubai Land Department community names,
 * and widely used district names in the UAE.
 */
export const UAE_AREAS: Record<UaeEmirate, readonly string[]> = {
  'Abu Dhabi': [
    'Al Reem Island',
    'Al Khalidiyah',
    'Al Nahyan',
    'Al Mushrif',
    'Al Bateen',
    'Khalifa City',
    'Mohammed Bin Zayed City',
    'Mussafah',
    'Yas Island',
    'Saadiyat Island',
    'Al Raha Beach',
    'Baniyas',
    'Al Ain',
    'Al Dhafra',
  ],
  Dubai: [
    'Deira',
    'Bur Dubai',
    'Downtown Dubai',
    'Business Bay',
    'Dubai Marina',
    'Jumeirah Lakes Towers (JLT)',
    'Jumeirah Village Circle (JVC)',
    'Al Barsha',
    'Al Karama',
    'Al Satwa',
    'Al Qusais',
    'Al Nahda',
    'Mirdif',
    'Jumeirah',
    'Palm Jumeirah',
    'Dubai Hills Estate',
    'Arabian Ranches',
    'Dubai Silicon Oasis',
    'International City',
    'Dubai South',
    'MBR City',
    'Dubai Creek Harbour',
    'Al Quoz',
    'Discovery Gardens',
    'Motor City',
    'Sports City',
    'Jebel Ali',
    'Hatta',
  ],
  Sharjah: [
    'Al Majaz',
    'Al Nahda',
    'Al Taawun',
    'Al Khan',
    'Muwaileh',
    'Industrial Area',
    'Al Qasimia',
    'Al Rolla',
    'Al Yarmook',
    'University City',
    'Kalba',
    'Khor Fakkan',
  ],
  Ajman: [
    'Ajman City',
    'Al Nuaimiya',
    'Al Rashidiya',
    'Al Jurf',
    'Al Mowaihat',
    'Emirates City',
  ],
  'Umm Al Quwain': [
    'Umm Al Quwain City',
    'Al Salamah',
    'Al Raas',
    'Falaj Al Mualla',
  ],
  'Ras Al Khaimah': [
    'RAK City',
    'Al Nakheel',
    'Al Hamra',
    'Al Marjan Island',
    'Khuzam',
    'Al Dhait',
  ],
  Fujairah: [
    'Fujairah City',
    'Dibba Al Fujairah',
    'Kalba',
    'Mirbah',
    'Qidfa',
  ],
};

export const LOCATION_SEPARATOR = ' — ';

export function formatLocation(emirate: string, area?: string): string {
  if (!area?.trim()) return emirate;
  return `${emirate}${LOCATION_SEPARATOR}${area.trim()}`;
}

export function parseLocation(location: string): {
  emirate: string;
  area?: string;
} {
  const idx = location.indexOf(LOCATION_SEPARATOR);
  if (idx === -1) return { emirate: location };
  return {
    emirate: location.slice(0, idx),
    area: location.slice(idx + LOCATION_SEPARATOR.length),
  };
}

export function filterAreas(emirate: UaeEmirate, query: string, limit = 10): string[] {
  const areas = UAE_AREAS[emirate] ?? [];
  const q = query.trim().toLowerCase();
  if (!q) return [...areas].slice(0, limit);
  return areas.filter((a) => a.toLowerCase().includes(q)).slice(0, limit);
}

/** Flat list of all formatted locations for browse filters. */
export function allLocationOptions(): string[] {
  const options: string[] = [];
  for (const emirate of UAE_EMIRATES) {
    options.push(emirate);
    for (const area of UAE_AREAS[emirate]) {
      options.push(formatLocation(emirate, area));
    }
  }
  return options;
}

export function filterLocationOptions(query: string, limit = 12): string[] {
  const q = query.trim().toLowerCase();
  const all = allLocationOptions();
  if (!q) return all.slice(0, limit);
  return all.filter((loc) => loc.toLowerCase().includes(q)).slice(0, limit);
}

/**
 * Resolves typed area text to a canonical district name when unambiguous.
 * Exact match always wins; prefix/contains only when exactly one area matches.
 */
export function resolveArea(emirate: UaeEmirate, query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  const areas = UAE_AREAS[emirate] ?? [];

  const exact = areas.find((a) => a.toLowerCase() === lower);
  if (exact) return exact;

  if (trimmed.length < 2) return null;

  const starts = areas.filter((a) => a.toLowerCase().startsWith(lower));
  if (starts.length === 1) return starts[0];

  const contains = areas.filter((a) => a.toLowerCase().includes(lower));
  if (contains.length === 1) return contains[0];

  return null;
}

/** Resolves emirate + area query to stored location string. */
export function resolveLocationValue(emirate: UaeEmirate, areaQuery: string): string {
  const area = resolveArea(emirate, areaQuery);
  if (area) return formatLocation(emirate, area);
  if (!areaQuery.trim()) return emirate;
  return formatLocation(emirate, areaQuery.trim());
}
