import { useCallback, useMemo, useState } from 'react';
import {
  e164FromFormattedInput,
  formatUaePhoneInput,
  isValidUaeMobileE164,
  UAE_DIAL_CODE,
} from '@/shared/utils/phone';

export function useFormattedPhoneInput(initial = UAE_DIAL_CODE) {
  const [value, setValue] = useState(() => formatUaePhoneInput(initial));

  const onChangeText = useCallback((text: string) => {
    setValue(formatUaePhoneInput(text));
  }, []);

  const e164 = useMemo(() => e164FromFormattedInput(value), [value]);
  const isValid = useMemo(() => isValidUaeMobileE164(e164), [e164]);

  const reset = useCallback(() => {
    setValue(UAE_DIAL_CODE);
  }, []);

  return { value, onChangeText, setValue, e164, isValid, reset };
}
