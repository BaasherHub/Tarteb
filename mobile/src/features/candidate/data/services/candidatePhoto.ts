import { supabase } from '@/core/lib/supabase';

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

  const response = await fetch(uri);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  const contentType =
    mimeType || (safeExt === 'png' ? 'image/png' : safeExt === 'webp' ? 'image/webp' : 'image/jpeg');

  const { error } = await supabase.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType,
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}


