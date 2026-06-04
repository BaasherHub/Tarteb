import { useWindowDimensions } from 'react-native';

/** iPhone SE / small Android width */
export const COMPACT_WIDTH = 360;

export function useIsCompactScreen(): boolean {
  const { width } = useWindowDimensions();
  return width < COMPACT_WIDTH;
}
