import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BookPage } from './BookPage';
import { useHouseholdStore } from '../../../stores/useHouseholdStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BookPage Component', () => {
  const mockClients = [
    {
      id: 'HH-101-SMITH',
      name: 'The Smith Family Trust',
      totalValue: 750000,
      dayChangePercent: -0.0045,
      riskProfile: 'Conservative',
      accounts: ['ACCT-1011'],
      taxId: '***-**-1011',
      segment: 'Mass Affluent',
      reviewDue: false
    },
    {
      id: 'HH-804-MILLER',
      name: 'The Miller Family Trust',
      totalValue: 4850300,
      dayChangePercent: 0.0125,
      riskProfile: 'Moderate Growth',
      accounts: ['ACCT-8041'],
      taxId: '***-**-8041',
      segment: 'HNW',
      reviewDue: true
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useHouseholdStore.getState().setActiveHousehold(null);

    // Mock global fetch
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockClients),
      } as Response)
    );
  });

  it('renders filter panel and client directory table', async () => {
    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Segment Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Compliance Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Risk Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Advisor Client Registry/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('The Miller Family Trust')).toBeInTheDocument();
      expect(screen.getByText('The Smith Family Trust')).toBeInTheDocument();
    });
  });

  it('queries backend API with correct filters when toggling checkboxes', async () => {
    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>
    );

    await screen.findByText('The Miller Family Trust');

    const hnwCheckbox = screen.getByLabelText('HNW');
    const reviewDueCheckbox = screen.getByLabelText('Review Due Only');

    // Toggle segment HNW
    fireEvent.click(hnwCheckbox);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith('/api/clients?segments=HNW&reviewDue=false');
    });

    // Toggle review status
    fireEvent.click(reviewDueCheckbox);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith('/api/clients?segments=HNW&reviewDue=true');
    });
  });

  it('sorts client records by AUM descending by default', async () => {
    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>
    );

    await screen.findByText('The Miller Family Trust');

    // Retrieve row cells to check order. Miller ($4.85M) should appear before Smith ($750K)
    const rows = screen.getAllByRole('row');
    // rows[0] is table header, rows[1] should be Miller, rows[2] should be Smith
    expect(rows[1]).toHaveTextContent('The Miller Family Trust');
    expect(rows[2]).toHaveTextContent('The Smith Family Trust');
  });

  it('loads active context and navigates to dashboard on Load Context click', async () => {
    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>
    );

    await screen.findByText('The Miller Family Trust');

    // Click Load Context for Smith (the second client row action)
    const loadButtons = screen.getAllByRole('button', { name: /Load Context/i });
    fireEvent.click(loadButtons[1]); // select Smith's button

    expect(useHouseholdStore.getState().activeHousehold?.name).toBe('The Smith Family Trust');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    // Check that it gets stored in local storage
    const recentStr = localStorage.getItem('recent_households');
    expect(recentStr).toContain('The Smith Family Trust');
  });

  it('displays Recent Clients in sidebar if present in LocalStorage', async () => {
    localStorage.setItem('recent_households', JSON.stringify([mockClients[1]]));

    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Recent Clients')).toBeInTheDocument();
    // Since there's one recent client, it should appear in the sidebar
    const recentItem = screen.getByRole('button', { name: /The Miller Family Trust \$4.85M/i });
    expect(recentItem).toBeInTheDocument();

    // Click to load context
    fireEvent.click(recentItem);
    expect(useHouseholdStore.getState().activeHousehold?.name).toBe('The Miller Family Trust');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
