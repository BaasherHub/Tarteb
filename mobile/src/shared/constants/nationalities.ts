/** Standard demonyms — one canonical label per nationality to avoid duplicates. */
export const NATIONALITIES: readonly string[] = [
  'Afghan',
  'Albanian',
  'Algerian',
  'American',
  'Armenian',
  'Australian',
  'Azerbaijani',
  'Bangladeshi',
  'Bosnian',
  'Brazilian',
  'British',
  'Bulgarian',
  'Burmese',
  'Cambodian',
  'Canadian',
  'Chinese',
  'Colombian',
  'Croatian',
  'Egyptian',
  'Emirati',
  'Eritrean',
  'Ethiopian',
  'Filipino',
  'French',
  'Georgian',
  'German',
  'Ghanaian',
  'Greek',
  'Indian',
  'Indonesian',
  'Iranian',
  'Iraqi',
  'Italian',
  'Ivorian',
  'Japanese',
  'Jordanian',
  'Kazakh',
  'Kenyan',
  'Korean',
  'Kuwaiti',
  'Lebanese',
  'Libyan',
  'Malaysian',
  'Moroccan',
  'Nepalese',
  'Nigerian',
  'Omani',
  'Pakistani',
  'Palestinian',
  'Polish',
  'Portuguese',
  'Qatari',
  'Romanian',
  'Russian',
  'Saudi',
  'Senegalese',
  'Serbian',
  'Somali',
  'South African',
  'Spanish',
  'Sri Lankan',
  'Sudanese',
  'Syrian',
  'Tajik',
  'Tanzanian',
  'Thai',
  'Tunisian',
  'Turkish',
  'Ugandan',
  'Ukrainian',
  'Uzbek',
  'Vietnamese',
  'Yemeni',
  'Zimbabwean',
] as const;

/** Maps common country names / typos to canonical demonyms. */
export const NATIONALITY_ALIASES: Record<string, string> = {
  sudan: 'Sudanese',
  sudanese: 'Sudanese',
  india: 'Indian',
  indian: 'Indian',
  pakistan: 'Pakistani',
  pakistani: 'Pakistani',
  philippines: 'Filipino',
  filipino: 'Filipino',
  philippine: 'Filipino',
  pinoy: 'Filipino',
  egypt: 'Egyptian',
  egyptian: 'Egyptian',
  nepal: 'Nepalese',
  nepalese: 'Nepalese',
  nepali: 'Nepalese',
  'sri lanka': 'Sri Lankan',
  'sri lankan': 'Sri Lankan',
  uae: 'Emirati',
  emirati: 'Emirati',
  emirates: 'Emirati',
  bangladesh: 'Bangladeshi',
  bangladeshi: 'Bangladeshi',
  ethiopia: 'Ethiopian',
  ethiopian: 'Ethiopian',
  eritrea: 'Eritrean',
  eritrean: 'Eritrean',
  jordan: 'Jordanian',
  jordanian: 'Jordanian',
  lebanon: 'Lebanese',
  lebanese: 'Lebanese',
  syria: 'Syrian',
  syrian: 'Syrian',
  yemen: 'Yemeni',
  yemeni: 'Yemeni',
  iraq: 'Iraqi',
  iraqi: 'Iraqi',
  iran: 'Iranian',
  iranian: 'Iranian',
  afghanistan: 'Afghan',
  afghan: 'Afghan',
  somalia: 'Somali',
  somali: 'Somali',
  kenya: 'Kenyan',
  kenyan: 'Kenyan',
  uganda: 'Ugandan',
  ugandan: 'Ugandan',
  tanzania: 'Tanzanian',
  tanzanian: 'Tanzanian',
  nigeria: 'Nigerian',
  nigerian: 'Nigerian',
  ghana: 'Ghanaian',
  ghanaian: 'Ghanaian',
  morocco: 'Moroccan',
  moroccan: 'Moroccan',
  algeria: 'Algerian',
  algerian: 'Algerian',
  tunisia: 'Tunisian',
  tunisian: 'Tunisian',
  libya: 'Libyan',
  libyan: 'Libyan',
  china: 'Chinese',
  chinese: 'Chinese',
  indonesia: 'Indonesian',
  indonesian: 'Indonesian',
  thailand: 'Thai',
  thai: 'Thai',
  vietnam: 'Vietnamese',
  vietnamese: 'Vietnamese',
  russia: 'Russian',
  russian: 'Russian',
  ukraine: 'Ukrainian',
  ukrainian: 'Ukrainian',
  uk: 'British',
  british: 'British',
  usa: 'American',
  american: 'American',
  canada: 'Canadian',
  canadian: 'Canadian',
  australia: 'Australian',
  australian: 'Australian',
  'south africa': 'South African',
  'south african': 'South African',
};

export function filterNationalities(query: string, limit = 20): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...NATIONALITIES];

  const alias = NATIONALITY_ALIASES[q];
  const fromAlias = alias ? [alias] : [];

  const matches = NATIONALITIES.filter(
    (n) =>
      n.toLowerCase().includes(q) ||
      n.toLowerCase().startsWith(q),
  );

  return [...new Set([...fromAlias, ...matches])].slice(0, limit);
}

/** Returns canonical demonym if input matches list or alias; otherwise null. */
export function resolveNationality(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const exact = NATIONALITIES.find(
    (n) => n.toLowerCase() === trimmed.toLowerCase(),
  );
  if (exact) return exact;

  const alias = NATIONALITY_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;

  const starts = NATIONALITIES.filter((n) =>
    n.toLowerCase().startsWith(trimmed.toLowerCase()),
  );
  if (starts.length === 1) return starts[0];

  return null;
}
