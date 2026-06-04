import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BrowseFilters } from '@/features/employer/data/services/candidateBrowse';

const PREFIX = '@tarteb/browse/';
const TTL_MS = 10 * 60 * 1000;

type CachePayload = {
  savedAt: number;
  items: Record<string, unknown>[];
};

function cacheKey(filters: BrowseFilters): string {
  return PREFIX + JSON.stringify(filters);
}

export async function readBrowseCache(
  filters: BrowseFilters,
): Promise<Record<string, unknown>[] | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(filters));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (Date.now() - parsed.savedAt > TTL_MS) {
      await AsyncStorage.removeItem(cacheKey(filters));
      return null;
    }
    return parsed.items;
  } catch {
    return null;
  }
}

export async function writeBrowseCache(
  filters: BrowseFilters,
  items: Record<string, unknown>[],
): Promise<void> {
  try {
    const payload: CachePayload = { savedAt: Date.now(), items };
    await AsyncStorage.setItem(cacheKey(filters), JSON.stringify(payload));
  } catch {
    // Non-critical — ignore storage failures
  }
}
