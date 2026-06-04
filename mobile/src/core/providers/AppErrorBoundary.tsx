import React, { type ReactNode } from 'react';
import { useLocale } from '@/core/i18n/LocaleContext';
import { ScreenErrorBoundary } from '@/core/providers/ScreenErrorBoundary';
import { ErrorState } from '@/shared/widgets/ErrorState';

type Props = { children: ReactNode };

export function AppErrorBoundary({ children }: Props) {
  const { t } = useLocale();

  return (
    <ScreenErrorBoundary
      renderFallback={(reset) => (
        <ErrorState
          title={t.errorBoundaryTitle}
          message={t.errorBoundaryMessage}
          actionLabel={t.retry}
          onAction={reset}
        />
      )}
    >
      {children}
    </ScreenErrorBoundary>
  );
}
