import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route Lazy Load Error:', error, errorInfo);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '36px 24px',
            textAlign: 'center',
            color: '#FFF',
            margin: '20px 0',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <AlertTriangle size={24} color="#F87171" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '6px' }}>
            {this.props.fallbackTitle || 'Unable to Load Route Module'}
          </h3>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', maxWidth: '460px', margin: '0 auto 20px' }}>
            A temporary network issue prevented this module from loading. Click below to retry.
          </p>
          <button
            onClick={this.handleRetry}
            className="btn-cta"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#FFF',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={15} /> Retry Loading Route
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
