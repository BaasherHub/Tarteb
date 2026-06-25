import { useCallback, useState } from 'react';
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  highlight?: string;
};

type ConfirmState = ConfirmOptions & {
  visible: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const idle: ConfirmState = {
  visible: false,
  title: '',
  message: '',
  confirmLabel: '',
  cancelLabel: '',
  loading: false,
  onConfirm: () => {},
  onCancel: () => {},
};

/** Cross-platform confirm dialog (replaces Alert.alert with buttons on web). */
export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmState>(idle);

  const close = useCallback(() => {
    setState((s) => {
      if (s.loading) return s;
      s.onCancel();
      return idle;
    });
  }, []);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> =>
      new Promise((resolve) => {
        setState({
          ...options,
          visible: true,
          loading: false,
          onConfirm: () => {
            resolve(true);
            setState(idle);
          },
          onCancel: () => resolve(false),
        });
      }),
    [],
  );

  const runConfirmAction = useCallback(
    (options: ConfirmOptions, action: () => void | Promise<void>) => {
      setState({
        ...options,
        visible: true,
        loading: false,
        onCancel: () => {},
        onConfirm: () => {
          void (async () => {
            setState((s) => ({ ...s, loading: true }));
            try {
              await action();
            } finally {
              setState(idle);
            }
          })();
        },
      });
    },
    [],
  );

  const dialog = (
    <ConfirmDialog
      visible={state.visible}
      title={state.title}
      message={state.message}
      highlight={state.highlight}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      loading={state.loading}
      onConfirm={state.onConfirm}
      onCancel={close}
    />
  );

  return { confirm, runConfirmAction, dialog, close };
}
