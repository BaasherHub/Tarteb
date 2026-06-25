import { describe, expect, it, vi } from 'vitest';
import { openExternalUrl } from './openExternalUrl';

describe('openExternalUrl', () => {
  it('opens http links in a new web tab without navigating the current app tab', async () => {
    const openWindow = vi.fn(() => ({}));
    const openURL = vi.fn();

    await openExternalUrl('https://example.com/cv.pdf', {
      platform: 'web',
      openWindow,
      openURL,
    });

    expect(openWindow).toHaveBeenCalledWith(
      'https://example.com/cv.pdf',
      '_blank',
      'noopener,noreferrer',
    );
    expect(openURL).not.toHaveBeenCalled();
  });

  it('does not navigate the current web tab when a popup is blocked', async () => {
    const openURL = vi.fn();

    await expect(
      openExternalUrl('https://example.com/cv.pdf', {
        platform: 'web',
        openWindow: vi.fn(() => null),
        openURL,
      }),
    ).rejects.toThrow('Cannot open URL');

    expect(openURL).not.toHaveBeenCalled();
  });

  it('checks non-http schemes before opening them', async () => {
    const canOpenURL = vi.fn(async () => true);
    const openURL = vi.fn();

    await openExternalUrl('mailto:hello@example.com', {
      platform: 'ios',
      canOpenURL,
      openURL,
    });

    expect(canOpenURL).toHaveBeenCalledWith('mailto:hello@example.com');
    expect(openURL).toHaveBeenCalledWith('mailto:hello@example.com');
  });
});
