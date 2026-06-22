import { supabase } from '@/core/lib/supabase';
import { env } from '@/core/config/env';

const BUCKET = 'candidate-photos';

export async function uploadCandidatePhoto(
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not signed in');

  const ext = fileName.includes('.')
    ? fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
    : 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const path = `${userId}/${userId}_${Date.now()}.${safeExt}`;

  const contentType =
    mimeType || (safeExt === 'png' ? 'image/png' : safeExt === 'webp' ? 'image/webp' : 'image/jpeg');

  // Hermes blocks Blob-from-ArrayBuffer (used internally by the Supabase SDK).
  // Use XMLHttpRequest + FormData instead — RN's native XHR implementation
  // handles { uri, name, type } file objects without any Blob conversion.
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('No active session');

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${env.supabaseUrl}/storage/v1/object/${BUCKET}/${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', env.supabaseAnonKey);
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Photo upload failed (${xhr.status}): ${xhr.responseText}`));
    };
    xhr.onerror = () => reject(new Error('Network error during photo upload'));
    const fd = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fd.append('file', { uri, name: fileName || `photo.${safeExt}`, type: contentType } as any);
    xhr.send(fd);
  });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}


