import { useCallback, useMemo, useState } from 'react';
import {
  ARAB_PHONE_COUNTRIES,
  DEFAULT_ARAB_PHONE_COUNTRY,
  parseAuthPhoneE164,
  type ArabPhoneCountry,
} from '@/shared/constants/arabPhoneCountries';
import { isValidAuthPhoneE164 } from '@/shared/utils/phone';

function formatLocalDigits(raw: string, maxLength: number): string {
  return raw.replace(/\D/g, '').slice(0, maxLength);
}

type AuthPhoneInputOptions = {
  initialCountryId?: string;
  initialE164?: string | null;
};

export function useAuthPhoneInput(options: AuthPhoneInputOptions = {}) {
  const { initialCountryId = DEFAULT_ARAB_PHONE_COUNTRY.id, initialE164 } = options;
  const parsed = initialE164 ? parseAuthPhoneE164(initialE164) : null;

  const [country, setCountry] = useState<ArabPhoneCountry>(
    () =>
      parsed?.country ??
      ARAB_PHONE_COUNTRIES.find((c) => c.id === initialCountryId) ??
      DEFAULT_ARAB_PHONE_COUNTRY,
  );
  const [localNumber, setLocalNumber] = useState(() => parsed?.localNumber ?? '');

  const onChangeLocalNumber = useCallback(
    (text: string) => {
      setLocalNumber(formatLocalDigits(text, country.localMaxLength));
    },
    [country.localMaxLength],
  );

  const selectCountry = useCallback((next: ArabPhoneCountry) => {
    setCountry(next);
    setLocalNumber((prev) => formatLocalDigits(prev, next.localMaxLength));
  }, []);

  const e164 = useMemo(() => {
    if (!localNumber) return country.dial;
    return `${country.dial}${localNumber}`;
  }, [country.dial, localNumber]);

  const isValid = useMemo(() => isValidAuthPhoneE164(e164), [e164]);

  const reset = useCallback(() => {
    setCountry(DEFAULT_ARAB_PHONE_COUNTRY);
    setLocalNumber('');
  }, []);

  return {
    country,
    setCountry: selectCountry,
    localNumber,
    onChangeLocalNumber,
    e164,
    isValid,
    reset,
  };
}
