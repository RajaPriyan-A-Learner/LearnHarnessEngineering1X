// apps/advisor-console/src/features/portfolio/components/ProposalPreview.tsx
import React, { useState } from 'react';
import { useProposalStore } from '../../../stores/useProposalStore';
import styles from './ProposalPreview.module.css';

const ProposalPreview: React.FC = () => {
  const { current, updateRationale, exportPdf } = useProposalStore();
  const [rationale, setRationale] = useState(current?.rationale || '');

  if (!current) return null;

  const handleRationaleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRationale(text);
    updateRationale(text);
  };

  return (
    <div className={styles.previewContainer}>
      <h3 className={styles.title}>Proposal Preview – v{current.version}</h3>
      <p className={styles.date}>Generated on: {current.createdAt.toLocaleString()}</p>
      <textarea
        className={styles.rationale}
        placeholder="Enter Reg BI justification (min 50 chars)"
        value={rationale}
        onChange={handleRationaleChange}
        rows={4}
      />
      <div className={styles.trades}>
        <h4>Trades</h4>
        <ul className={styles.tradeList}>
          {current.trades.map((t, idx) => (
            <li key={t.id} className={styles.tradeItem}>
              {idx + 1}. {t.symbol} – {t.action} – {(t.amount * 100).toFixed(2)}% – {t.reason}
            </li>
          ))}
        </ul>
      </div>
      <button className={styles.exportBtn} onClick={exportPdf}>
        Export PDF
      </button>
    </div>
  );
};

export default ProposalPreview;
