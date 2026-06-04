const MAX_ADDITIONAL_ROLES = 2;

export type ParsedCandidateRoles = {
  primary: string;
  additional: string[];
  all: string[];
};

export function parseAdditionalRoles(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(String).filter(Boolean);
}

export function parseCandidateRoles(row: {
  role?: unknown;
  additional_roles?: unknown;
}): ParsedCandidateRoles | null {
  const primary = String(row.role ?? '').trim();
  if (!primary) return null;
  const additional = parseAdditionalRoles(row.additional_roles).filter((r) => r !== primary);
  return {
    primary,
    additional: additional.slice(0, MAX_ADDITIONAL_ROLES),
    all: [primary, ...additional],
  };
}

export function normalizeAdditionalRoles(
  primary: string,
  additional: string[],
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of additional) {
    const trimmed = r.trim();
    if (!trimmed || trimmed === primary || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
    if (out.length >= MAX_ADDITIONAL_ROLES) break;
  }
  return out;
}

export function toggleAdditionalRole(
  primary: string | undefined,
  current: string[],
  role: string,
): string[] {
  if (!primary || role === primary) return current;
  if (current.includes(role)) return current.filter((r) => r !== role);
  if (current.length >= MAX_ADDITIONAL_ROLES) return current;
  return [...current, role];
}

export type RoleFilterMatch = 'primary' | 'additional' | null;

export function matchHiringRoleFilter(
  row: { role?: unknown; additional_roles?: unknown },
  hiringRole: string | null | undefined,
): RoleFilterMatch {
  if (!hiringRole?.trim()) return null;
  const parsed = parseCandidateRoles(row);
  if (!parsed) return null;
  const target = hiringRole.trim();
  if (parsed.primary === target) return 'primary';
  if (parsed.additional.includes(target)) return 'additional';
  return null;
}

export function candidateMatchesAnyHiringRole(
  row: { role?: unknown; additional_roles?: unknown },
  hiringRoles: string[],
): boolean {
  if (!hiringRoles.length) return true;
  return hiringRoles.some((r) => matchHiringRoleFilter(row, r) != null);
}

function postgrestEqValue(value: string): string {
  if (/^[a-zA-Z0-9 _-]+$/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function postgrestArrayContainsValue(value: string): string {
  if (/^[a-zA-Z0-9 _-]+$/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

/** PostgREST filter: primary or additional_roles contains each hiring role. */
export function postgrestRoleOrFilter(hiringRoles: string[]): string {
  const clauses = hiringRoles.flatMap((role) => {
    const trimmed = role.trim();
    const eq = postgrestEqValue(trimmed);
    const arr = postgrestArrayContainsValue(trimmed);
    return [`role.eq.${eq}`, `additional_roles.cs.{${arr}}`];
  });
  return clauses.join(',');
}

export const MAX_ADDITIONAL_ROLES_EXPORT = MAX_ADDITIONAL_ROLES;

export function formatCandidateRolesA11y(
  row: { role?: unknown; additional_roles?: unknown },
  hiringRole: string | null | undefined,
  labels: {
    main: string;
    also: string;
    matchPrimary: string;
    matchSecondary: (role: string) => string;
  },
): string {
  const parsed = parseCandidateRoles(row);
  if (!parsed) return '';
  const parts = [`${labels.main}: ${parsed.primary}`];
  if (parsed.additional.length) {
    parts.push(`${labels.also}: ${parsed.additional.join(', ')}`);
  }
  const match = matchHiringRoleFilter(row, hiringRole);
  if (match === 'primary') parts.push(labels.matchPrimary);
  if (match === 'additional' && hiringRole) {
    parts.push(labels.matchSecondary(hiringRole));
  }
  return parts.join('. ');
}
