import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchField } from '@wma/shared-ui';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('SearchField Component', () => {
  const mockOnSelect = vi.fn();
  const mockClients = [
    {
      id: 'HH-804-MILLER',
      name: 'The Miller Family Trust',
      totalValue: 4850300,
      dayChangePercent: 0.0125,
      riskProfile: 'Moderate Growth',
      accounts: ['ACCT-8041'],
      taxId: '***-**-8041',
      segment: 'HNW'
    },
    {
      id: 'HH-101-SMITH',
      name: 'The Smith Family Trust',
      totalValue: 750000,
      dayChangePercent: -0.0045,
      riskProfile: 'Conservative',
      accounts: ['ACCT-1011'],
      taxId: '***-**-1011',
      segment: 'Mass Affluent'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock global fetch
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockClients),
      } as Response)
    );
  });

  it('renders search input field by default', () => {
    render(<SearchField onSelect={mockOnSelect} />);
    expect(screen.getByPlaceholderText(/Search by name, ACCT#/i)).toBeInTheDocument();
  });

  it('debounces user input and fetches results after 50ms', async () => {
    render(<SearchField onSelect={mockOnSelect} debounceTime={50} />);
    const input = screen.getByPlaceholderText(/Search by name, ACCT#/i);

    fireEvent.change(input, { target: { value: 'Miller' } });
    
    // fetch should not be called immediately
    expect(global.fetch).not.toHaveBeenCalled();

    // Sleep for 100ms to let debounce fire
    await sleep(100);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/clients?q=Miller');
    });

    // Check if dropdown results are rendered
    expect(await screen.findByText('The Miller Family Trust')).toBeInTheDocument();
    expect(screen.getByText('The Smith Family Trust')).toBeInTheDocument();
  });

  it('navigates results with keyboard ArrowDown/ArrowUp and selects with Enter', async () => {
    render(<SearchField onSelect={mockOnSelect} debounceTime={50} />);
    const input = screen.getByPlaceholderText(/Search by name, ACCT#/i);

    fireEvent.change(input, { target: { value: 'Miller' } });
    
    await sleep(100);

    // Wait for dropdown to show
    await screen.findByText('The Miller Family Trust');

    // Press ArrowDown to highlight first item (Miller)
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    // Press ArrowDown to highlight second item (Smith)
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Press Enter to select the highlighted item (Smith)
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSelect).toHaveBeenCalledWith(mockClients[1]);
    expect(screen.queryByText('The Miller Family Trust')).toBeNull();
  });

  it('closes dropdown when Escape key is pressed', async () => {
    render(<SearchField onSelect={mockOnSelect} debounceTime={50} />);
    const input = screen.getByPlaceholderText(/Search by name, ACCT#/i);

    fireEvent.change(input, { target: { value: 'Miller' } });
    
    await sleep(100);

    await screen.findByText('The Miller Family Trust');

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByText('The Miller Family Trust')).toBeNull();
  });
});
