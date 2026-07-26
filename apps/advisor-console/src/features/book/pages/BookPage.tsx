import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHouseholdStore, Household } from '../../../stores/useHouseholdStore';
import styles from './BookPage.module.css';

interface ClientResponse extends Household {
  accounts: string[];
  taxId: string;
  segment: 'Mass Affluent' | 'HNW' | 'UHNW';
  reviewDue: boolean;
}

export const BookPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeHousehold, setActiveHousehold } = useHouseholdStore();

  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [reviewDueOnly, setReviewDueOnly] = useState(false);
  const [riskProfileFilter, setRiskProfileFilter] = useState('All');
  
  // Recent Clients State
  const [recentClients, setRecentClients] = useState<Household[]>([]);

  // Reload recent clients from LocalStorage
  useEffect(() => {
    try {
      const recentStr = localStorage.getItem('recent_households');
      if (recentStr) {
        setRecentClients(JSON.parse(recentStr));
      }
    } catch (e) {
      console.error('Failed to load recent clients', e);
    }
  }, [activeHousehold]);

  // Fetch filtered clients from backend API
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const segmentParams = selectedSegments.join(',');
        const query = `/api/clients?segments=${segmentParams}&reviewDue=${reviewDueOnly}`;
        const res = await fetch(query);
        if (!res.ok) {
          throw new Error('Failed to retrieve client registry database.');
        }
        const data = await res.json();
        setClients(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred during fetch.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [selectedSegments, reviewDueOnly]);

  const handleSegmentToggle = (segment: string) => {
    setSelectedSegments(prev =>
      prev.includes(segment)
        ? prev.filter(s => s !== segment)
        : [...prev, segment]
    );
  };

  const handleLoadContext = (client: Household) => {
    setActiveHousehold(client);
    navigate('/dashboard');
  };

  // Client-side filtering by Risk Profile
  const filteredClients = clients.filter(client => {
    if (riskProfileFilter === 'All') return true;
    return client.riskProfile.toLowerCase().includes(riskProfileFilter.toLowerCase());
  });

  // Default Sort: AUM Descending
  const sortedClients = [...filteredClients].sort((a, b) => b.totalValue - a.totalValue);

  return (
    <div className={styles.container}>
      {/* Sidebar Panel */}
      <aside className={styles.sidebar}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Segment Filters</h3>
          <div className={styles.filterGroup}>
            {['Mass Affluent', 'HNW', 'UHNW'].map(seg => (
              <label key={seg} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedSegments.includes(seg)}
                  onChange={() => handleSegmentToggle(seg)}
                  className={styles.checkbox}
                />
                {seg}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Compliance Status</h3>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={reviewDueOnly}
              onChange={(e) => setReviewDueOnly(e.target.checked)}
              className={styles.checkbox}
            />
            Review Due Only
          </label>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Risk Profile</h3>
          <select
            value={riskProfileFilter}
            onChange={(e) => setRiskProfileFilter(e.target.value)}
            className={styles.select}
          >
            <option value="All">All Profiles</option>
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate Growth</option>
            <option value="Growth">Growth</option>
            <option value="Aggressive">Aggressive Growth</option>
          </select>
        </div>

        {recentClients.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Recent Clients</h3>
            <ul className={styles.recentList}>
              {recentClients.map(client => (
                <li key={client.id} className={styles.recentItem}>
                  <button
                    onClick={() => handleLoadContext(client)}
                    className={styles.recentLink}
                    type="button"
                  >
                    <span className={styles.recentName}>{client.name}</span>
                    <span className={styles.recentAum}>
                      ${(client.totalValue / 1000000).toFixed(2)}M
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main Panel */}
      <main className={styles.main}>
        <div className={styles.headerArea}>
          <h2 className={styles.title}>Advisor Client Registry (Book of Business)</h2>
          <p className={styles.subtitle}>
            Search, filter, and load dynamic contexts for client households.
          </p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {loading ? (
          <div className={styles.loadingArea}>Loading client directory...</div>
        ) : (
          <div className={styles.gridArea}>
            <div className={styles.metaRow}>
              <span>{sortedClients.length} Households found. Sorted by AUM Descending.</span>
            </div>
            
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Household Name</th>
                    <th>ID</th>
                    <th className={styles.alignRight}>AUM (Total Value)</th>
                    <th className={styles.alignRight}>Day Change</th>
                    <th>Segment</th>
                    <th>Status</th>
                    <th className={styles.alignCenter}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClients.length > 0 ? (
                    sortedClients.map(client => (
                      <tr key={client.id} className={styles.row}>
                        <td className={styles.bold}>{client.name}</td>
                        <td>{client.id}</td>
                        <td className={`${styles.alignRight} ${styles.bold}`}>
                          ${client.totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className={`${styles.alignRight} ${client.dayChangePercent >= 0 ? styles.positive : styles.negative}`}>
                          {client.dayChangePercent >= 0 ? '+' : ''}
                          {(client.dayChangePercent * 100).toFixed(2)}%
                        </td>
                        <td>
                          <span className={`${styles.tag} ${styles[client.segment.replace(' ', '')] || ''}`}>
                            {client.segment}
                          </span>
                        </td>
                        <td>
                          {client.reviewDue ? (
                            <span className={styles.statusDue}>⚠️ Review Due</span>
                          ) : (
                            <span className={styles.statusOk}>✓ Current</span>
                          )}
                        </td>
                        <td className={styles.alignCenter}>
                          <button
                            onClick={() => handleLoadContext(client)}
                            className={styles.actionBtn}
                            type="button"
                          >
                            Load Context
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className={styles.emptyCell}>
                        No client records match the specified filter parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
