import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

let reducedMotionEnabled = false;
let initialized = false;
const listeners = new Set<(enabled: boolean) => void>();

function publish(enabled: boolean) {
  reducedMotionEnabled = enabled;
  listeners.forEach((listener) => listener(enabled));
}

function initialize() {
  if (initialized) return;
  initialized = true;
  void AccessibilityInfo.isReduceMotionEnabled().then(publish);
  AccessibilityInfo.addEventListener('reduceMotionChanged', publish);
}

export function useReducedMotion() {
  const [enabled, setEnabled] = useState(reducedMotionEnabled);

  useEffect(() => {
    initialize();
    listeners.add(setEnabled);
    return () => {
      listeners.delete(setEnabled);
    };
  }, []);

  return enabled;
}
