import { create } from 'zustand';

export interface Household {
  id: string;
  name: string;
  totalValue: number;
  dayChangePercent: number;
  riskProfile: string;
}

interface HouseholdState {
  activeHousehold: Household | null;
  setActiveHousehold: (household: Household | null) => void;
}

export const useHouseholdStore = create<HouseholdState>((set) => ({
  activeHousehold: {
    name: 'The Miller Family Trust',
    id: 'HH-804-MILLER',
    totalValue: 4850300.75,
    dayChangePercent: 0.0125,
    riskProfile: 'Moderate Growth'
  },
  setActiveHousehold: (household) => {
    if (household) {
      try {
        const recentStr = localStorage.getItem('recent_households');
        let recent: Household[] = recentStr ? JSON.parse(recentStr) : [];
        // Filter out duplicate
        recent = recent.filter((h) => h.id !== household.id);
        // Prepend new household
        recent.unshift(household);
        // Keep top 5
        recent = recent.slice(0, 5);
        localStorage.setItem('recent_households', JSON.stringify(recent));
      } catch (e) {
        console.error('Failed to update recent households in LocalStorage', e);
      }
    }
    set({ activeHousehold: household });
  },
}));
