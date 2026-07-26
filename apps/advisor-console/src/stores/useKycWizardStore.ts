import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { setItem, getItem, removeItem } from '../shared/offline/offline';

export interface IdentityData {
  fullName: string;
  dob: string; // ISO date string
  ssn: string; // formatted e.g., 123-45-6789
}

export interface FinancialData {
  income: number;
  netWorth: number;
  experience: string; // e.g., 'Beginner', 'Intermediate', 'Advanced'
}

export interface RiskData {
  score: number;
  answers: Record<string, string>;
  tolerance?: string; // selected tolerance level
}

export interface KycData {
  identity: IdentityData;
  financial: FinancialData;
  risk: RiskData;
  documents: File[];
}

interface KycState {
  step: number; // 0 = Identity, 1 = Financial, 2 = Risk, 3 = Document Upload, 4 = Completed
  data: KycData;
  completedSteps: number[];
  setStep: (step: number) => void;
  updateData: (section: keyof KycData, payload: Partial<KycData[keyof KycData]>) => void;
  addDocument: (file: File) => void;
  reset: () => void;
  persist: () => void;
  restore: () => void;
}

const initialData: KycData = {
  identity: { fullName: '', dob: '', ssn: '' },
  financial: { income: 0, netWorth: 0, experience: '' },
  risk: { score: 0, answers: {}, tolerance: '' },
  documents: [],
};

export const useKycWizardStore = create<KycState>()(
  devtools((set, get) => ({
    step: 0,
    data: initialData,
    completedSteps: [],
    setStep: (step: number) => set({ step }),
    updateData: (section, payload) =>
      set((state) => ({
        data: {
          ...state.data,
          [section]: { ...state.data[section], ...payload },
        },
      })),
    addDocument: (file: File) =>
      set((state) => ({
        data: { ...state.data, documents: [...state.data.documents, file] },
      })),
    reset: () =>
      set({ step: 0, data: initialData, completedSteps: [] }),
    persist: async () => {
      const { step, data, completedSteps } = get();
      const payload = JSON.stringify({ step, data, completedSteps });
      await setItem('kycWizardState', payload);
    },
    restore: async () => {
      const raw = await getItem<string>('kycWizardState');
      if (!raw) return;
      try {
        const { step, data, completedSteps } = JSON.parse(raw) as {
          step: number;
          data: KycData;
          completedSteps: number[];
        };
        set({ step, data, completedSteps });
        await removeItem('kycWizardState');
      } catch {
        // ignore malformed data
      }
    },
  }))
);
