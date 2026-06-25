import { describe, expect, it } from 'vitest';
import { normalizeCandidatePhotoUpload } from './candidatePhotoMetadata';

describe('normalizeCandidatePhotoUpload', () => {
  it('keeps allowed image extensions and MIME types', () => {
    expect(normalizeCandidatePhotoUpload('profile.png', 'image/png')).toEqual({
      fileName: 'profile.png',
      contentType: 'image/png',
    });
  });

  it('normalizes jpeg extension to jpg while keeping jpeg content type', () => {
    expect(normalizeCandidatePhotoUpload('face.jpeg', 'image/jpeg')).toEqual({
      fileName: 'face.jpg',
      contentType: 'image/jpeg',
    });
  });

  it('adds a safe jpg extension when the selected asset has no extension', () => {
    expect(normalizeCandidatePhotoUpload('photo', null)).toEqual({
      fileName: 'photo.jpg',
      contentType: 'image/jpeg',
    });
  });

  it('replaces unsupported extensions and MIME types with jpg/jpeg for backend validation', () => {
    expect(normalizeCandidatePhotoUpload('avatar.heic', 'image/heic')).toEqual({
      fileName: 'avatar.jpg',
      contentType: 'image/jpeg',
    });
  });
});
