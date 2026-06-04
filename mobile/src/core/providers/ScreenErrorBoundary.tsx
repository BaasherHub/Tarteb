import React, { Component, type ReactNode } from 'react';
import { captureException } from '@/core/services/crashReporting';

type Props = {
  children: ReactNode;
  renderFallback: (reset: () => void) => ReactNode;
};

type State = { hasError: boolean };

export class ScreenErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    captureException(error, { componentStack: info.componentStack ?? '' });
  }

  reset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.renderFallback(this.reset);
    }
    return this.props.children;
  }
}
