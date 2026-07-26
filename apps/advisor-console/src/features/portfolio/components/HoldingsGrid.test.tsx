import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HoldingsGrid, Holding } from './HoldingsGrid';

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

describe('HoldingsGrid Component', () => {
  const mockHoldings: Holding[] = [
    {
      id: 'LOT-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      assetClass: 'Equities',
      shares: 10,
      price: 150.00,
      marketValue: 1500.00,
      costBasis: 1200.00,
      unrealizedGainLoss: 300.00,
      unrealizedGainLossPercent: 0.25,
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
      shares: 5,
      price: 300.00,
      marketValue: 1500.00,
      costBasis: 1400.00,
      unrealizedGainLoss: 100.00,
      unrealizedGainLossPercent: 0.0714,
      sector: 'Technology',
      geography: 'North America',
      account: 'ACCT-8042',
      asOfDate: '2026-07-18'
    },
    {
      id: 'LOT-3',
      symbol: 'GLD',
      name: 'SPDR Gold Shares',
      assetClass: 'Alternatives',
      shares: 10,
      price: 200.00,
      marketValue: 2000.00,
      costBasis: 1800.00,
      unrealizedGainLoss: 200.00,
      unrealizedGainLossPercent: 0.1111,
      sector: 'Commodities',
      geography: 'Global',
      account: 'ACCT-8041',
      asOfDate: '2026-07-18'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders positions in standard list layout by default', () => {
    render(<HoldingsGrid data={mockHoldings} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('GLD')).toBeInTheDocument();
  });

  it('toggles grouping by Asset Class and calculates subtotal rollups', () => {
    render(<HoldingsGrid data={mockHoldings} />);
    
    // Toggle Grouping
    const groupBtn = screen.getByRole('button', { name: /Group by Asset Class/i });
    fireEvent.click(groupBtn);

    // Group headers should appear
    expect(screen.getByText(/Equities/i)).toBeInTheDocument();
    expect(screen.getByText(/Alternatives/i)).toBeInTheDocument();

    // Check roll-up calculations:
    // Equities: AAPL ($1500) + MSFT ($1500) = $3000
    // Gain/Loss: AAPL ($300) + MSFT ($100) = $400
    expect(screen.getAllByText((_, element) => element?.textContent?.includes('Value: $3,000.00') ?? false)[0]).toBeInTheDocument();
    expect(screen.getAllByText((_, element) => element?.textContent?.includes('+$400.00') ?? false)[0]).toBeInTheDocument();
  });

  it('triggers CSV file download on Export click', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('mock-url');
    const revokeObjectURLMock = vi.fn();
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    const clickMock = vi.fn();
    const createElementMock = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = createElementMock(tagName);
      if (tagName === 'a') {
        el.click = clickMock;
      }
      return el;
    });

    render(<HoldingsGrid data={mockHoldings} />);
    const exportBtn = screen.getByRole('button', { name: /Export CSV/i });
    fireEvent.click(exportBtn);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
  });
});
