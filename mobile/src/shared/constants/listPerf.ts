import { Platform } from 'react-native';

/** CandidateBrowseCard minHeight + hairline separator */
export const BROWSE_ROW_HEIGHT = 85;

/** MyUnlocks row minHeight + separator */
export const UNLOCK_ROW_HEIGHT = 73;

/** Tuned for mid-range Android; conservative on iOS */
export const FLAT_LIST_PERF = Platform.select({
  android: {
    removeClippedSubviews: true,
    maxToRenderPerBatch: 8,
    windowSize: 7,
    initialNumToRender: 10,
    updateCellsBatchingPeriod: 50,
  },
  default: {
    maxToRenderPerBatch: 10,
    windowSize: 9,
    initialNumToRender: 12,
    updateCellsBatchingPeriod: 50,
  },
}) as {
  removeClippedSubviews?: boolean;
  maxToRenderPerBatch: number;
  windowSize: number;
  initialNumToRender: number;
  updateCellsBatchingPeriod: number;
};

export function browseItemLayout(_: unknown, index: number) {
  return {
    length: BROWSE_ROW_HEIGHT,
    offset: BROWSE_ROW_HEIGHT * index,
    index,
  };
}

export function unlockItemLayout(_: unknown, index: number) {
  return {
    length: UNLOCK_ROW_HEIGHT,
    offset: UNLOCK_ROW_HEIGHT * index,
    index,
  };
}
