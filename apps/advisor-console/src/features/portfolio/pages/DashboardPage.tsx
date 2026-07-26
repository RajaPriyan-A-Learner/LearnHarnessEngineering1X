import React, { useState, useEffect, useMemo } from 'react';
import { useHouseholdStore } from '../../../stores/useHouseholdStore';
import { HoldingsGrid, Holding } from '../components/HoldingsGrid';
import { ShieldAlert, Info, Calendar } from 'lucide-react';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parameter states
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [asOfDate, setAsOfDate] = useState('2026-07-18'); // current mock date

  // Update selected accounts when active household changes
  useEffect(() => {
    if (activeHousehold) {
      const mockAccounts = activeHousehold.id === 'HH-804-MILLER' 
        ? ['ACCT-8041', 'ACCT-8042'] 
        : activeHousehold.id === 'HH-101-SMITH'
        ? ['ACCT-1011']
        : activeHousehold.id === 'HH-202-VANDERBILT'
        ? ['ACCT-2021', 'ACCT-2022', 'ACCT-2023']
        : activeHousehold.id === 'HH-303-JONES'
        ? ['ACCT-3031', 'ACCT-3032']
        : ['ACCT-4041'];
        
      setSelectedAccounts(mockAccounts);
    } else {
      setSelectedAccounts([]);
    }
  }, [activeHousehold]);

  // Fetch holdings based on selected accounts and date
  useEffect(() => {
    if (!activeHousehold) return;

    const fetchHoldings = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = `/api/households/${activeHousehold.id}/holdings?asOfDate=${asOfDate}`;
        const res = await fetch(query);
        if (!res.ok) {
          throw new Error('Failed to retrieve household positions.');
        }
        const data = await res.json();
        setHoldings(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred fetching holdings.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, [activeHousehold, asOfDate]);

  // Filter positions by selected accounts checklist
  const filteredHoldings = useMemo(() => {
    return holdings.filter(h => selectedAccounts.includes(h.account));
  }, [holdings, selectedAccounts]);

  // Recalculate Aggregates
  const aggregates = useMemo(() => {
    let totalAum = 0;
    let totalCostBasis = 0;
    let totalDayChangeDollar = 0;

    filteredHoldings.forEach(h => {
      totalAum += h.marketValue;
      totalCostBasis += h.costBasis;
      const pct = h.symbol.includes('AAPL') ? 0.0125 : h.symbol.includes('MSFT') ? 0.008 : -0.005;
      totalDayChangeDollar += h.marketValue * pct;
    });

    const totalUnrealizedGains = totalAum - totalCostBasis;
    const unrealizedGainsPercent = totalCostBasis > 0 ? (totalUnrealizedGains / totalCostBasis) : 0;
    const dayChangePercent = totalAum > 0 ? (totalDayChangeDollar / totalAum) : 0;

    return {
      totalAum,
      totalUnrealizedGains,
      unrealizedGainsPercent,
      totalDayChangeDollar,
      dayChangePercent
    };
  }, [filteredHoldings]);

  const allAvailableAccounts = useMemo(() => {
    if (!activeHousehold) return [];
    return activeHousehold.id === 'HH-804-MILLER'
      ? ['ACCT-8041', 'ACCT-8042']
      : activeHousehold.id === 'HH-101-SMITH'
      ? ['ACCT-1011']
      : activeHousehold.id === 'HH-202-VANDERBILT'
      ? ['ACCT-2021', 'ACCT-2022', 'ACCT-2023']
      : activeHousehold.id === 'HH-303-JONES'
      ? ['ACCT-3031', 'ACCT-3032']
      : ['ACCT-4041'];
  }, [activeHousehold]);

  const handleAccountToggle = (acc: string) => {
    setSelectedAccounts(prev =>
      prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
    );
  };

  const isHistorical = asOfDate !== '2026-07-18';

  if (!activeHousehold) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyCard}>
          <ShieldAlert size={48} className={styles.emptyIcon} />
          <h3>No Client Context Loaded</h3>
          <p>Please use the Search Field or the Client Registry to load a household workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Historical Warning Banner */}
      {isHistorical && (
        <div className={styles.historicalBanner}>
          <Info size={18} />
          <span>Viewing historical archive as of {asOfDate}. Dynamic stream ticker disabled.</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className={styles.dashboardGrid}>
        {/* Sidebar Controls */}
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Account Checklist</h4>
            <div className={styles.checklist}>
              {allAvailableAccounts.map(acc => (
                <label key={acc} className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(acc)}
                    onChange={() => handleAccountToggle(acc)}
                    className={styles.checkbox}
                  />
                  {acc}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.cardTitle}>As-Of Date Selection</h4>
            <div className={styles.dateSelector}>
              <Calendar size={16} className={styles.dateIcon} />
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className={styles.dateInput}
                max="2026-07-18"
                aria-label="As-Of Date"
              />
            </div>
          </div>
        </aside>

        {/* Workspace Dashboard */}
        <div className={styles.mainWorkspace}>
          {/* Summary Aggregates */}
          <div className={styles.aggregatesRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Portfolio Value (AUM)</span>
              <span className={styles.statValue}>{`$${aggregates.totalAum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              <span className={styles.statSub}>Across {selectedAccounts.length} selected accounts</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Day's Change</span>
              <span className={`${styles.statValue} ${aggregates.totalDayChangeDollar >= 0 ? styles.positive : styles.negative}`}>{`${aggregates.totalDayChangeDollar >= 0 ? '+' : ''}$${aggregates.totalDayChangeDollar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              <span className={`${styles.statSub} ${aggregates.totalDayChangeDollar >= 0 ? styles.positive : styles.negative}`}>
                ({aggregates.dayChangePercent >= 0 ? '+' : ''}{(aggregates.dayChangePercent * 100).toFixed(2)}%)
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Unrealized Gain/Loss</span>
              <span className={`${styles.statValue} ${aggregates.totalUnrealizedGains >= 0 ? styles.positive : styles.negative}`}>{`${aggregates.totalUnrealizedGains >= 0 ? '+' : ''}$${aggregates.totalUnrealizedGains.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              <span className={`${styles.statSub} ${aggregates.totalUnrealizedGains >= 0 ? styles.positive : styles.negative}`}>
                ({(aggregates.unrealizedGainsPercent * 100).toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Holdings Grid */}
          <div className={styles.gridSection}>
            <h3 className={styles.gridTitle}>Household Holdings & Asset Lots</h3>
            {error && <div className={styles.errorArea}>{error}</div>}
            
            {loading ? (
              <div className={styles.loadingArea}>Loading positions table...</div>
            ) : (
              <HoldingsGrid data={filteredHoldings} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

