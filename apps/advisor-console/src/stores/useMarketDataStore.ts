import { create } from 'zustand';

export interface TickMeta {
  type: 'positive' | 'negative';
  timestamp: number;
}

interface MarketDataState {
  connectionStatus: 'live' | 'delayed' | 'offline';
  prices: Record<string, number>;
  changes: Record<string, TickMeta>;
  setConnectionStatus: (status: 'live' | 'delayed' | 'offline') => void;
  setPrices: (prices: Record<string, number>) => void;
  updatePrices: (updates: Record<string, { price: number; changePercent: number }>) => void;
}

export const useMarketDataStore = create<MarketDataState>((set) => ({
  connectionStatus: 'offline',
  prices: {},
  changes: {},
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setPrices: (prices) => set({ prices }),
  updatePrices: (updates) =>
    set((state) => {
      const nextPrices = { ...state.prices };
      const nextChanges = { ...state.changes };

      Object.entries(updates).forEach(([symbol, update]) => {
        const oldPrice = nextPrices[symbol];
        nextPrices[symbol] = update.price;

        if (oldPrice !== undefined && update.price !== oldPrice) {
          nextChanges[symbol] = {
            type: update.price > oldPrice ? 'positive' : 'negative',
            timestamp: Date.now(),
          };
        }
      });

      return {
        prices: nextPrices,
        changes: nextChanges,
      };
    }),
}));
