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

  // Hermes does not support creating Blobs from ArrayBuffer, which the Supabase
  // storage SDK does internally. Call the REST API directly with FormData instead —
  // React Native's native fetch handles { uri, name, type } file objects natively.
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('No active session');

  const formData = new FormData();
  formData.append('file', { uri, name: fileName || `photo.${safeExt}`, type: contentType } as unknown as Blob);

  const res = await fetch(
    `${env.supabaseUrl}/storage/v1/object/${BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: env.supabaseAnonKey,
        'x-upsert': 'true',
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => res.status.toString());
    throw new Error(`Photo upload failed: ${body}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}


