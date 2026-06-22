import { Platform } from 'react-native';

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
