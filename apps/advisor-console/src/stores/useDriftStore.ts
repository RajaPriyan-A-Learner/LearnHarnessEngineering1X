// apps/advisor-console/src/stores/useDriftStore.ts
import { create } from 'zustand';
import { calculateAllocation, calculateDrift, DriftResult, Position, TargetAllocation } from '@wma/shared-utils';
import { useComplianceStore } from './useComplianceStore';

export interface Trade {
  id: string;
  symbol: string; // asset class identifier
  action: 'buy' | 'sell';
  amount: number; // proportion of portfolio (0-1)
  reason: string;
  overridden?: boolean; // flag when amber warning overridden
}

export interface ComplianceResult {
  tradeId: string;
  status: 'clear' | 'amber' | 'red';
  reason?: string;
}

interface DriftState {
  targetAllocation: TargetAllocation | null;
  currentAllocation: Record<string, number>;
  driftResults: DriftResult[];
  sandboxTrades: Trade[];
  setTargetAllocation: (target: TargetAllocation) => void;
  computeDrift: (positions: Position[]) => void;
  generateTrades: (tolerance?: number) => void;
  updateTrade: (id: string, amount: number) => void;
  clearSandbox: () => void;
  removeTrade: (id: string) => void;
  getComplianceResults: () => ComplianceResult[];
  overrideAmber: (tradeId: string, justification: string) => void;
}

export const useDriftStore = create<DriftState>((set, get) => ({
  targetAllocation: null,
  currentAllocation: {},
  driftResults: [],
  sandboxTrades: [],
  setTargetAllocation: (target) => set({ targetAllocation: target }),
  computeDrift: (positions) => {
    const current = calculateAllocation(positions);
    const target = get().targetAllocation;
    const drift = target ? calculateDrift(positions, target) : [];
    set({ currentAllocation: current, driftResults: drift });
  },
  generateTrades: (tolerance = 0.05) => {
    const { driftResults } = get();
    const trades: Trade[] = [];
    driftResults.forEach((d) => {
      const diff = d.targetWeight - d.currentWeight;
      if (Math.abs(diff) >= tolerance) {
        const action = diff > 0 ? 'buy' : 'sell';
        trades.push({
          id: crypto.randomUUID(),
          symbol: d.assetClass,
          action,
          amount: Math.abs(diff),
          reason: `Drift ${(diff * 100).toFixed(2)}%`,
        });
      }
    });
    set({ sandboxTrades: trades });
  },
  updateTrade: (id, amount) =>
    set((state) => ({
      sandboxTrades: state.sandboxTrades.map((t) => (t.id === id ? { ...t, amount } : t)),
    })),
  clearSandbox: () => set({ sandboxTrades: [] }),
  removeTrade: (id) =>
    set((state) => ({
      sandboxTrades: state.sandboxTrades.filter((t) => t.id !== id),
    })),
  getComplianceResults: (): ComplianceResult[] => {
    const { sandboxTrades } = get();
    const { restrictedList } = useComplianceStore.getState();
    return sandboxTrades.map((trade) => {
      if (restrictedList.includes(trade.symbol)) {
        return { tradeId: trade.id, status: 'red', reason: 'Restricted security' };
      }
      if (trade.amount > 0.2 && !trade.overridden) {
        return { tradeId: trade.id, status: 'amber', reason: 'Large position - review required' };
      }
      return { tradeId: trade.id, status: 'clear' };
    });
  },
  overrideAmber: (tradeId, justification) => {
    useComplianceStore.getState().recordAudit({
      tradeId,
      timestamp: new Date().toISOString(),
      justification,
    });
    set((state) => ({
      sandboxTrades: state.sandboxTrades.map((t) =>
        t.id === tradeId ? { ...t, overridden: true } : t
      ),
    }));
  },
}));
