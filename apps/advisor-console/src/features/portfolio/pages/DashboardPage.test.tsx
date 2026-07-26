import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';
import { useHouseholdStore } from '../../../stores/useHouseholdStore';

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn().mockImplementation(({ count }) => ({
    getVirtualItems: () => Array.from({ length: count }, (_, i) => ({
      index: i,
      start: i * 44,
      size: 44,
      key: i
    })),
    getTotalSize: () => count * 44,
  })),
}));

describe('DashboardPage Component', () => {
  const mockHousehold = {
    id: 'HH-804-MILLER',
    name: 'The Miller Family Trust',
    totalValue: 4850300.75,
    dayChangePercent: 0.0125,
    riskProfile: 'Moderate Growth'
  };

  const mockHoldings = [
    {
      id: 'LOT-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      assetClass: 'Equities',
      shares: 100,
      price: 180.50,
      marketValue: 18050.00,
      costBasis: 16000.00,
      unrealizedGainLoss: 2050.00,
      unrealizedGainLossPercent: 0.1281,
      sector: 'Technology',
      geography: 'North America',
      account: 'ACCT-8041',
      asOfDate: '2026-07-18'
    },
    {
      id: 'LOT-2',
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      assetClass: 'Equities',
      shares: 50,
      price: 420.20,
      marketValue: 21010.00,
      costBasis: 19000.00,
      unrealizedGainLoss: 2010.00,
      unrealizedGainLossPercent: 0.1058,
      sector: 'Technology',
      geography: 'North America',
      account: 'ACCT-8042',
      asOfDate: '2026-07-18'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useHouseholdStore.getState().setActiveHousehold(null);

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockHoldings),
      } as Response)
    );
  });

  it('renders placeholders when no active client context is loaded', () => {
    render(<DashboardPage />);
    expect(screen.getByText('No Client Context Loaded')).toBeInTheDocument();
  });

  it('renders aggregates and holdings list when active household context loaded', async () => {
    useHouseholdStore.getState().setActiveHousehold(mockHousehold);

    render(<DashboardPage />);

    // Wait for positions rows to load in virtualized table
    expect(await screen.findByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();

    expect(screen.getByText('Portfolio Value (AUM)')).toBeInTheDocument();
    
    // Check totals are calculated correctly:
    // Total value: 18,050 + 21,010 = 39,060
    expect(screen.getAllByText('$39,060.00')[0]).toBeInTheDocument();
  });

  it('recalculates aggregate totals when accounts checklist toggled', async () => {
    useHouseholdStore.getState().setActiveHousehold(mockHousehold);

    render(<DashboardPage />);

    // Wait for data load
    await screen.findByText('AAPL');
    expect(screen.getAllByText('$39,060.00')[0]).toBeInTheDocument();

    // Uncheck ACCT-8042
    const acc2Checkbox = screen.getByLabelText('ACCT-8042');
    fireEvent.click(acc2Checkbox);

    // Value should adjust to show only ACCT-8041 (AAPL: $18,050.00)
    await waitFor(() => {
      expect(screen.getAllByText('$18,050.00')[0]).toBeInTheDocument();
    });
  });

  it('renders historical warning banner when as-of-date changes', async () => {
    useHouseholdStore.getState().setActiveHousehold(mockHousehold);

    render(<DashboardPage />);

    await screen.findByText('AAPL');
    expect(screen.getAllByText('$39,060.00')[0]).toBeInTheDocument();

    // Change date to past date
    const dateInput = screen.getByLabelText(/As-Of Date/i);
    fireEvent.change(dateInput, { target: { value: '2026-07-10' } });

    // Historical warning banner should appear
    expect(await screen.findByText(/Viewing historical archive as of 2026-07-10/i)).toBeInTheDocument();
  });
});
