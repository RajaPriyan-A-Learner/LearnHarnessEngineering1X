// apps/advisor-console/src/stores/useComplianceStore.ts
import { create } from 'zustand';
import restrictedListData from '../mocks/restrictedList.json';

export interface AuditEntry {
  tradeId: string;
  timestamp: string; // ISO string
  justification: string;
}

export interface ComplianceState {
  restrictedList: string[];
  auditLog: AuditEntry[];
  decisions: Record<string, 'approved' | 'rejected'>;
  loadRestrictedList: () => void;
  recordAudit: (entry: AuditEntry) => void;
  recordDecision: (tradeId: string, decision: 'approved' | 'rejected') => void;
}

export const useComplianceStore = create<ComplianceState>((set) => ({
  restrictedList: [],
  auditLog: [],
  decisions: {},
  loadRestrictedList: () => {
    set({ restrictedList: restrictedListData });
  },
  recordAudit: (entry) =>
    set((state) => ({
      auditLog: [...state.auditLog, entry],
    })),
  recordDecision: (tradeId, decision) =>
    set((state) => ({
      decisions: { ...state.decisions, [tradeId]: decision },
    })),
}));
