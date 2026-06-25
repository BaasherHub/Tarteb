export function candidateIdFromUnlockRow(row: Record<string, unknown>): string {
  return String(row.candidate_id ?? row.id ?? '');
}
