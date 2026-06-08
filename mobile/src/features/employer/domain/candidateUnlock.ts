export function isCandidateUnlocked(row: Record<string, unknown>): boolean {
  return row.is_unlocked === true;
}

export function hasCandidateContact(row: Record<string, unknown>): boolean {
  const phone = String(row.phone ?? '').trim();
  const whatsapp = String(row.whatsapp ?? '').trim();
  return Boolean(phone || whatsapp);
}
