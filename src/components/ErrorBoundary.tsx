import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  onReset?: () => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[Core-4 ErrorBoundary] ${this.props.componentName ?? 'Component'} crashed:`, error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fc flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[200px]">
          <ShieldAlert className="text-red-400" size={32} />
          <h3 className="font-cormorant text-xl text-text-main">
            {this.props.componentName ?? 'Module'} encountered an error
          </h3>
          <p className="font-mono text-xs text-text3 max-w-xs">
            {this.state.error?.message ?? 'Unknown error'}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-border2 text-gold text-sm hover:bg-gold/20 transition-colors"
          >
            <RefreshCw size={14} />
            Rehydrate Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
