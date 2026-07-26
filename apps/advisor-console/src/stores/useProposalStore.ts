// apps/advisor-console/src/stores/useProposalStore.ts
import { create } from 'zustand';
import { jsPDF } from 'jspdf';
import { Trade } from './useDriftStore';

export interface Proposal {
  version: number;
  createdAt: Date;
  trades: Trade[]; // snapshot of sandbox trades at proposal creation
  rationale: string; // Reg BI justification, min 50 chars
  // Additional fields can be added such as feeSchedule, disclosures, etc.
}

interface ProposalState {
  current: Proposal | null;
  createProposal: (trades: Trade[]) => void;
  updateRationale: (text: string) => void;
  incrementVersion: () => void;
  exportPdf: () => void;
}

export const useProposalStore = create<ProposalState>((set, get) => ({
  current: null,
  createProposal: (trades) => {
    const existing = get().current;
    const version = existing ? existing.version + 1 : 1;
    const newProposal: Proposal = {
      version,
      createdAt: new Date(),
      trades,
      rationale: '',
    };
    set({ current: newProposal });
  },
  updateRationale: (text) => {
    set((state) => {
      if (!state.current) return state;
      return { current: { ...state.current, rationale: text } };
    });
  },
  incrementVersion: () => {
    set((state) => {
      if (!state.current) return state;
      const nextVersion = state.current.version + 1;
      return { current: { ...state.current, version: nextVersion, createdAt: new Date() } };
    });
  },
  exportPdf: () => {
    const { current } = get();
    if (!current) return;
    const doc = new jsPDF();
    doc.setFont('Helvetica');
    doc.setFontSize(12);
    doc.text(`Client Proposal – Version ${current.version}`, 20, 20);
    doc.text(`Generated on: ${current.createdAt.toLocaleString()}`, 20, 30);
    doc.text('Rationale:', 20, 40);
    doc.text(current.rationale || '(none)', 20, 50);
    // Simple table of trades
    let y = 60;
    doc.text('Trades:', 20, y);
    y += 10;
    current.trades.forEach((t, idx) => {
      const line = `${idx + 1}. ${t.symbol} – ${t.action} – ${(t.amount * 100).toFixed(2)}% – ${t.reason}`;
      doc.text(line, 20, y);
      y += 7;
    });
    doc.save(`Proposal_v${current.version}.pdf`);
  },
}));
