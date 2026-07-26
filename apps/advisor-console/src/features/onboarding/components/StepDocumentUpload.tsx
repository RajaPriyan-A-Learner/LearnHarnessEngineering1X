import React, { useRef, useState } from 'react';
import { useKycWizardStore } from '../../../stores/useKycWizardStore';
import styles from './StepDocumentUpload.module.css';

// Allowed file extensions and size limit (10 MB)
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

interface Props {
  onSubmit: () => void;
  onBack: () => void;
}

export const StepDocumentUpload: React.FC<Props> = ({ onSubmit, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addDocument = useKycWizardStore(state => state.addDocument);
  const documents = useKycWizardStore(state => state.data.documents);
  const [error, setError] = useState<string>('');

  const handleFiles = (files: FileList) => {
    setError('');
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`File type not allowed: ${file.name}`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File too large (max 10 MB): ${file.name}`);
        continue;
      }
      newFiles.push(file);
    }
    newFiles.forEach(addDocument);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={styles.uploadZone} onDrop={onDrop} onDragOver={e => e.preventDefault()}>
      <p>Drag &amp; drop documents here, or click to select files</p>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={ALLOWED_TYPES.join(',')}
        onChange={onFileSelect}
      />
      <button className={styles.button} type="button" onClick={() => fileInputRef.current?.click()}>
        Choose Files
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {documents.length > 0 && (
        <div className={styles.fileList}>
          {documents.map((file, idx) => (
            <div key={idx} className={styles.fileItem}>
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          ))}
        </div>
      )}
      <div className={styles.buttons}>
        <button className={styles.button} type="button" onClick={onBack}>
          Back
        </button>
        <button className={styles.button} type="button" onClick={onSubmit} disabled={documents.length === 0}>
          Submit
        </button>
      </div>
    </div>
  );
};
