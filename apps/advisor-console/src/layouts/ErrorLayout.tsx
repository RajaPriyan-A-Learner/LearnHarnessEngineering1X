import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './ErrorLayout.module.css';

interface ErrorLayoutProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  title = 'System Error Encountered',
  message = 'An unexpected issue has occurred within this feature slice.',
  onRetry
}) => {
  return (
    <div className={styles.container} role="alert">
      <AlertCircle size={40} className={styles.icon} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.btn} onClick={onRetry} type="button">
          Attempt Recovery
        </button>
      )}
    </div>
  );
};
