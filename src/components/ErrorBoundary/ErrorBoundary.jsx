import { Component } from 'react';
import styles from './ErrorBoundary.module.scss';

/**
 * Catches render/lifecycle errors anywhere below it and shows a fallback UI.
 * Pair with `useErrorBoundary()` to surface async errors too.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (this.props.onError) this.props.onError(error, info);
  }

  resetError = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (!error) return children;

    if (typeof fallback === 'function') return fallback(error, this.resetError);

    return (
      <div className={styles['error-boundary']} role="alert">
        <div className={styles['error-boundary__content']}>
          <span className={styles['error-boundary__icon']} aria-hidden="true">⚠</span>
          <h2 className={styles['error-boundary__title']}>Something went wrong</h2>
          <p className={styles['error-boundary__message']}>
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            className={styles['error-boundary__action']}
            onClick={this.resetError}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
