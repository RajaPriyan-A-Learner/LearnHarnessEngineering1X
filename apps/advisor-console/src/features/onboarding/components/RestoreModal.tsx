import React from 'react';
import styles from './RestoreModal.module.css';

interface RestoreModalProps {
  onRestore: () => void;
  onDiscard: () => void;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
}

export const RestoreModal: React.FC<RestoreModalProps> = ({ onRestore, onDiscard, title, confirmLabel, cancelLabel }) => {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>We found a saved KYC wizard state. Would you like to restore it?</p>
        <div className={styles.actions}>
          <button className={styles.confirmButton} onClick={onRestore}>{confirmLabel}</button>
          <button className={styles.cancelButton} onClick={onDiscard}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
};
