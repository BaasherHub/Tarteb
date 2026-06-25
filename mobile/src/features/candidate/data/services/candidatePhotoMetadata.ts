const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp']);
const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};
const ALLOWED_MIME = new Set(Object.values(MIME_BY_EXT));

type PhotoUploadMetadata = {
  fileName: string;
  contentType: string;
};

export function normalizeCandidatePhotoUpload(
  fileName: string,
  mimeType?: string | null,
): PhotoUploadMetadata {
  const trimmedName = fileName.trim();
  const nameParts = trimmedName.split('.');
  const rawExt =
    nameParts.length > 1 ? (nameParts.pop()?.toLowerCase() ?? '') : '';
  const safeExt = ALLOWED_EXT.has(rawExt) ? rawExt : 'jpg';
  const baseName = nameParts.join('.').trim() || 'photo';
  const normalizedExt = safeExt === 'jpeg' ? 'jpg' : safeExt;
  const trimmedMime = mimeType?.trim();
  const contentType =
    trimmedMime && ALLOWED_MIME.has(trimmedMime)
      ? trimmedMime
      : MIME_BY_EXT[safeExt] || 'image/jpeg';

  return {
    fileName: `${baseName}.${normalizedExt}`,
    contentType,
  };
}
