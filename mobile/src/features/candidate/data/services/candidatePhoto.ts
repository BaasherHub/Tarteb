import * as FileSystem from 'expo-file-system/legacy';
import { env } from '@/core/config/env';
import { getAccessToken } from '@/core/services/tokenStorage';

const BASE = env.apiUrl.replace(/\/$/, '');

export async function uploadCandidatePhoto(
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const ext = fileName.includes('.')
    ? fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
    : 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const contentType =
    mimeType || (safeExt === 'png' ? 'image/png' : safeExt === 'webp' ? 'image/webp' : 'image/jpeg');

  const token = await getAccessToken();
  const result = await FileSystem.uploadAsync(
    `${BASE}/api/v1/storage/photo`,
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

  const { photo_url } = JSON.parse(result.body) as { photo_url: string };
  return photo_url;
}
