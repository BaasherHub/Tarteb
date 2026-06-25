import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { env } from '@/core/config/env';
import { getAccessToken } from '@/core/services/tokenStorage';
import { normalizeCandidatePhotoUpload } from '@/features/candidate/data/services/candidatePhotoMetadata';

const BASE = env.apiUrl.replace(/\/$/, '');

function parseUploadError(body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: string; message?: string };
    return parsed.error ?? parsed.message ?? body;
  } catch {
    return body;
  }
}

async function uploadPhotoOnWeb(
  uri: string,
  fileName: string,
  contentType: string,
): Promise<string> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Could not read selected photo');
  }

  const blob = await response.blob();
  const file =
    typeof File !== 'undefined'
      ? new File([blob], fileName, { type: contentType })
      : blob;
  const formData = new FormData();
  formData.append('file', file, fileName);

  const token = await getAccessToken();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE}/api/v1/storage/photo`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onload = () => {
      const body = xhr.responseText || '';
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(parseUploadError(body)));
        return;
      }

      try {
        const parsed = JSON.parse(body) as { photo_url?: string };
        if (!parsed.photo_url) {
          reject(new Error('Could not upload selected photo'));
          return;
        }
        resolve(parsed.photo_url);
      } catch {
        reject(new Error('Could not upload selected photo'));
      }
    };
    xhr.onerror = () => reject(new Error('Could not upload selected photo'));
    xhr.ontimeout = () => reject(new Error('Request timed out — please check your connection and try again.'));
    xhr.timeout = 15_000;
    xhr.send(formData);
  });
}

export async function uploadCandidatePhoto(
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const { fileName: safeFileName, contentType } =
    normalizeCandidatePhotoUpload(fileName, mimeType);

  if (Platform.OS === 'web') {
    return uploadPhotoOnWeb(uri, safeFileName, contentType);
  }

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
    throw new Error(parseUploadError(result.body));
  }

  const { photo_url } = JSON.parse(result.body) as { photo_url: string };
  return photo_url;
}
