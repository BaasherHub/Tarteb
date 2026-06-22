import { supabase } from '@/core/lib/supabase';

const BUCKET = 'candidate-cvs';
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXT = new Set(['pdf', 'doc', 'docx']);

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function extFromName(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? '') : '';
}

export function isAllowedCvFile(fileName: string, size?: number | null): boolean {
  const ext = extFromName(fileName);
  if (!ALLOWED_EXT.has(ext)) return false;
  if (size != null && size > MAX_BYTES) return false;
  return true;
}

export async function uploadCandidateCv(
  uri: string,
  fileName: string,
  mimeType?: string | null,
  size?: number | null,
): Promise<{ path: string; fileName: string }> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not signed in');

  const safeName = fileName.trim() || 'cv.pdf';
  if (!isAllowedCvFile(safeName, size)) {
    throw new Error('Invalid CV file');
  }

  const ext = extFromName(safeName);
  const path = `${userId}/${userId}_${Date.now()}.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();
  if (blob.size > MAX_BYTES) throw new Error('CV too large');
  const arrayBuffer = await blob.arrayBuffer();

  const contentType = mimeType?.trim() || MIME_BY_EXT[ext] || 'application/octet-stream';

  const { error } = await supabase.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType,
    upsert: true,
  });
  if (error) throw error;

  return { path, fileName: safeName };
}

export async function getCandidateCvSignedUrl(
  storagePath: string,
  expiresIn = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) throw error ?? new Error('Could not open CV');
  return data.signedUrl;
}

export async function removeCandidateCvFile(storagePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw error;
}
