import * as FileSystem from 'expo-file-system/legacy';
import { env } from '@/core/config/env';
import { getAccessToken } from '@/core/services/tokenStorage';
import { api } from '@/core/lib/api';

const BASE = env.apiUrl.replace(/\/$/, '');

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
  const safeName = fileName.trim() || 'cv.pdf';
  if (!isAllowedCvFile(safeName, size)) throw new Error('Invalid CV file');

  const ext = extFromName(safeName);
  const contentType = mimeType?.trim() || MIME_BY_EXT[ext] || 'application/octet-stream';

  const token = await getAccessToken();
  const result = await FileSystem.uploadAsync(
    `${BASE}/api/v1/storage/cv`,
    uri,
    {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: contentType,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (result.status < 200 || result.status >= 300) {
    let message = result.body;
    try {
      const j = JSON.parse(result.body) as { error?: string };
      message = j.error ?? result.body;
    } catch { /* keep raw body */ }
    throw new Error(message);
  }

  const { cv_url, cv_file_name } = JSON.parse(result.body) as { cv_url: string; cv_file_name: string };
  return { path: cv_url, fileName: cv_file_name ?? safeName };
}

export async function getCandidateCvSignedUrl(
  _storagePath: string,
  _expiresIn = 3600,
  candidateId?: string,
): Promise<string> {
  if (!candidateId) throw new Error('candidateId required for CV download');
  const { url } = await api.storage.downloadCv(candidateId);
  return url;
}

export async function removeCandidateCvFile(_storagePath: string): Promise<void> {
  await api.storage.deleteCv();
}
