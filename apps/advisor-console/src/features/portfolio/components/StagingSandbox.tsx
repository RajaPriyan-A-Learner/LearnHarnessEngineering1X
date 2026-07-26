// apps/advisor-console/src/features/portfolio/components/StagingSandbox.tsx
import React, { useState, useEffect } from 'react';
import { useDriftStore } from '../../../stores/useDriftStore';
import styles from './StagingSandbox.module.css';
import { useProposalStore } from '../../../stores/useProposalStore';
import ProposalPreview from './ProposalPreview';

const StagingSandbox: React.FC = () => {
  const {
    sandboxTrades,
    updateTrade,
    clearSandbox,
    removeTrade,
    getComplianceResults,
    overrideAmber,
  } = useDriftStore();

  const [compliance, setCompliance] = useState([] as any[]);
  const [overrideId, setOverrideId] = useState<string | null>(null);
  const [justification, setJustification] = useState('');
  const { current, createProposal } = useProposalStore();

  // Load compliance results whenever sandbox trades change
  useEffect(() => {
    setCompliance(getComplianceResults());
  }, [sandboxTrades, getComplianceResults]);

  const handleAmountChange = (id: string, value: string) => {
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      updateTrade(id, amount / 100);
    }
  };

  const handleOverride = (id: string) => {
    if (justification.trim().length >= 50) {
      overrideAmber(id, justification.trim());
      setOverrideId(null);
      setJustification('');
    } else {
      alert('Justification must be at least 50 characters.');
    }
  };

  const hasRedBlock = sandboxTrades.some((t) => {
    const result = compliance.find((r) => r.tradeId === t.id);
    return result?.status === 'red';
  });

  if (sandboxTrades.length === 0) {
    return null;
  }

  return (
    <div className={styles.sandboxContainer}>
      <h3 className={styles.title}>What‑If Staging Sandbox</h3>
      <table className={styles.tradeTable}>
        <thead>
          <tr>
            <th>Asset Class</th>
            <th>Action</th>
            <th>Amount&nbsp;(%)</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {sandboxTrades.map((trade) => {
            const result = compliance.find((r) => r.tradeId === trade.id) || { status: 'clear' };
            return (
              <tr key={trade.id} className={styles.tradeRow}>
                <td>{trade.symbol}</td>
                <td className={trade.action === 'buy' ? styles.buy : styles.sell}>{trade.action}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={(trade.amount * 100).toFixed(2)}
                    onChange={(e) => handleAmountChange(trade.id, e.target.value)}
                    className={styles.amountInput}
                  />
                  %
                </td>
                <td>{trade.reason}</td>
                <td>
                  {result.status === 'red' && <span title="Restricted security" className={styles.red}>⛔</span>}
                  {result.status === 'amber' && (
                    <div className={styles.amberContainer}>
                      <span title={result.reason} className={styles.amber}>⚠️</span>
                      <button
                        type="button"
                        className={styles.overrideBtn}
                        onClick={() => setOverrideId(trade.id)}
                      >
                        Override
                      </button>
                    </div>
                  )}
                  {result.status === 'clear' && <span className={styles.clear}>✅</span>}
                </td>
                <td>
                  <button type="button" onClick={() => removeTrade(trade.id)} className={styles.removeBtn}>
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Override modal */}
      {overrideId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Reg BI Justification (min 50 chars)</h4>
            <textarea
              rows={4}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className={styles.justificationText}
            />
            <div className={styles.modalActions}>
              <button type="button" onClick={() => handleOverride(overrideId)} className={styles.confirmBtn}>
                Confirm
              </button>
              <button type="button" onClick={() => setOverrideId(null)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={clearSandbox}
          className={styles.applyBtn}
          disabled={hasRedBlock}
          title={hasRedBlock ? 'Cannot apply while red blocks exist' : undefined}
        >
          Apply Sandbox (Commit)
        </button>
      </div>
      <button
        type="button"
        className={styles.proposalBtn}
        onClick={() => {
          if (!hasRedBlock) {
            createProposal(sandboxTrades);
          }
        }}
        disabled={hasRedBlock}
        title={hasRedBlock ? 'Cannot finalize while red blocks exist' : undefined}
      >
        Finalize Proposal
      </button>
{current && <ProposalPreview />}
    </div>
  );
};

export default StagingSandbox;
