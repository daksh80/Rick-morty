import styles from './ErrorMessage.module.scss';

const ErrorMessage = ({ message, onRetry }) => (
  <div className={styles['error-message']} role="alert">
    <span className={styles['error-message__icon']} aria-hidden="true">⚠</span>
    <p className={styles['error-message__text']}>{message}</p>
    {onRetry && (
      <button type="button" className={styles['error-message__retry']} onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
