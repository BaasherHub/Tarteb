export type OpenExternalUrlDeps = {
  platform: string;
  openWindow?: (url: string, target?: string, features?: string) => unknown;
  canOpenURL?: (url: string) => Promise<boolean>;
  openURL?: (url: string) => Promise<unknown>;
};

function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function webOpen(url: string): unknown {
  const globalWithOpen = globalThis as typeof globalThis & {
    open?: (url: string, target?: string, features?: string) => unknown;
  };
  return globalWithOpen.open?.(url, '_blank', 'noopener,noreferrer');
}

export async function openExternalUrl(url: string, deps: OpenExternalUrlDeps): Promise<void> {
  if (deps.platform === 'web' && isHttpUrl(url)) {
    const opened = (deps.openWindow ?? webOpen)(url, '_blank', 'noopener,noreferrer');
    if (opened) return;
    throw new Error('Cannot open URL');
  }

  if (!deps.openURL) {
    throw new Error('Cannot open URL');
  }

  if (!isHttpUrl(url) && !(await deps.canOpenURL?.(url))) {
    throw new Error('Cannot open URL');
  }

  await deps.openURL(url);
}
