/* global window, document, fetch, localStorage, sessionStorage, navigator */
/* eslint-env browser */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  GroupingState,
  ExpandedState,
  ColumnPinningState,
  Column
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Layers, Shield } from 'lucide-react';
import { useMarketDataStore } from '../../../stores/useMarketDataStore';
import styles from './HoldingsGrid.module.css';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  assetClass: string;
  shares: number;
  price: number;
  marketValue: number;
  costBasis: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  sector: string;
  geography: string;
  account: string;
  asOfDate: string;
}

interface HoldingsGridProps {
  data: Holding[];
}

export const HoldingsGrid: React.FC<HoldingsGridProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const { changes } = useMarketDataStore();
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => {
    try {
      const saved = localStorage.getItem('grid_column_pinning');
      return saved ? JSON.parse(saved) : { left: ['symbol'], right: [] };
    } catch {
      return { left: ['symbol'], right: [] };
    }
  });

  const [columnSizing, setColumnSizing] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('grid_column_sizing');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Write column config to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('grid_column_pinning', JSON.stringify(columnPinning));
  }, [columnPinning]);

  useEffect(() => {
    localStorage.setItem('grid_column_sizing', JSON.stringify(columnSizing));
  }, [columnSizing]);

  const totalPortfolioValue = useMemo(() => {
    return data.reduce((sum, h) => sum + h.marketValue, 0);
  }, [data]);

  const columns = useMemo<ColumnDef<Holding>[]>(
    () => [
      {
        accessorKey: 'symbol',
        header: 'Symbol',
        size: columnSizing.symbol || 100,
      },
      {
        accessorKey: 'name',
        header: 'Security Name',
        size: columnSizing.name || 200,
      },
      {
        accessorKey: 'account',
        header: 'Account',
        size: columnSizing.account || 120,
      },
      {
        accessorKey: 'shares',
        header: 'Shares',
        size: columnSizing.shares || 100,
        cell: (info) => (info.getValue() as number).toLocaleString(),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: columnSizing.price || 100,
        cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
      },
      {
        accessorKey: 'marketValue',
        header: 'Market Value',
        size: columnSizing.marketValue || 130,
        cell: (info) => `$${(info.getValue() as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        accessorKey: 'costBasis',
        header: 'Cost Basis',
        size: columnSizing.costBasis || 130,
        cell: (info) => `$${(info.getValue() as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        accessorKey: 'unrealizedGainLoss',
        header: 'Unrealized G/L ($)',
        size: columnSizing.unrealizedGainLoss || 130,
        cell: (info) => {
          const val = info.getValue() as number;
          return (
            <span className={val >= 0 ? styles.positive : styles.negative}>
              {val >= 0 ? '+' : ''}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          );
        },
      },
      {
        accessorKey: 'unrealizedGainLossPercent',
        header: 'Unrealized G/L (%)',
        size: columnSizing.unrealizedGainLossPercent || 130,
        cell: (info) => {
          const val = (info.getValue() as number) * 100;
          return (
            <span className={val >= 0 ? styles.positive : styles.negative}>
              {val >= 0 ? '+' : ''}{val.toFixed(2)}%
            </span>
          );
        },
      },
      {
        accessorKey: 'assetClass',
        header: 'Asset Class',
        size: columnSizing.assetClass || 130,
      },
      {
        accessorKey: 'sector',
        header: 'Sector',
        size: columnSizing.sector || 130,
      },
      {
        accessorKey: 'geography',
        header: 'Geography',
        size: columnSizing.geography || 130,
      },
    ],
    [columnSizing]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      grouping,
      expanded,
      columnPinning,
      columnSizing
    },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44, // row height
    overscan: 25,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const exportToCSV = () => {
    const headers = [
      'Symbol', 'Name', 'Account', 'Shares', 'Price', 'Market Value', 'Cost Basis', 'Unrealized G/L ($)', 'Unrealized G/L (%)', 'Asset Class', 'Sector', 'Geography'
    ];
    
    const dataRows = table.getRowModel().flatRows.filter(r => !r.getIsGrouped()).map(r => {
      const h = r.original;
      return [
        h.symbol,
        `"${h.name.replace(/"/g, '""')}"`,
        h.account,
        h.shares,
        h.price,
        h.marketValue,
        h.costBasis,
        h.unrealizedGainLoss,
        h.unrealizedGainLossPercent,
        h.assetClass,
        h.sector,
        h.geography
      ];
    });

    const csvContent = [
      headers.join(','),
      ...dataRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Holdings_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHeaderClick = (column: Column<any>, event: React.MouseEvent) => {
    // Alt + Click for multi-sort, standard click for single sort
    const desc = column.getIsSorted() === 'asc';
    const isMulti = event.altKey;

    if (isMulti) {
      setSorting(prev => {
        const existing = prev.find(s => s.id === column.id);
        if (existing) {
          return prev.map(s => s.id === column.id ? { ...s, desc: !s.desc } : s);
        }
        return [...prev, { id: column.id, desc: false }];
      });
    } else {
      setSorting([{ id: column.id, desc }]);
    }
  };

  const togglePinning = (columnId: string) => {
    setColumnPinning((prev: ColumnPinningState) => {
      const left = prev.left || [];
      if (left.includes(columnId)) {
        return { ...prev, left: left.filter((id: string) => id !== columnId) };
      } else {
        return { ...prev, left: [...left, columnId] };
      }
    });
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            onClick={() => setGrouping(prev => prev.includes('assetClass') ? [] : ['assetClass'])}
            className={`${styles.toolbarBtn} ${grouping.includes('assetClass') ? styles.activeBtn : ''}`}
            type="button"
          >
            <Layers size={16} />
            {grouping.includes('assetClass') ? 'Ungroup positions' : 'Group by Asset Class'}
          </button>
        </div>
        <button onClick={exportToCSV} className={styles.toolbarBtn} type="button">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className={styles.tableWrapper}>
        {/* Table Header */}
        <div className={styles.headerRow}>
          {table.getFlatHeaders().map(header => {
            const isSorted = header.column.getIsSorted();
            const width = header.column.getSize();
            const isPinned = columnPinning.left?.includes(header.column.id);

            return (
              <div
                key={header.id}
                className={`${styles.headerCell} ${isPinned ? styles.pinnedLeft : ''}`}
                style={{ 
                  width: `${width}px`,
                  left: isPinned ? '0px' : undefined
                }}
              >
                <div 
                  className={styles.headerContent}
                  onClick={(e) => handleHeaderClick(header.column, e)}
                  title="Click to sort. Alt+Click for multi-column sort."
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <span className={styles.sortIndicator}>
                    {isSorted === 'asc' && <ArrowUp size={12} />}
                    {isSorted === 'desc' && <ArrowDown size={12} />}
                    {!isSorted && <ArrowUpDown size={12} className={styles.sortIconMuted} />}
                  </span>
                </div>
                
                {/* Pin Column Toggle */}
                <button
                  type="button"
                  onClick={() => togglePinning(header.column.id)}
                  className={`${styles.pinBtn} ${isPinned ? styles.activePin : ''}`}
                  title={isPinned ? 'Unpin Column' : 'Pin Column Left'}
                >
                  <Shield size={10} />
                </button>

                {/* Column Resizer */}
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`${styles.resizer} ${header.column.getIsResizing() ? styles.isResizing : ''}`}
                />
              </div>
            );
          })}
        </div>

        {/* Bounded Scroll Container */}
        <div 
          ref={parentRef} 
          className={styles.scrollContainer}
        >
          <div style={{ height: `${totalSize}px`, position: 'relative', width: '100%' }}>
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index];
              
              if (row.getIsGrouped()) {
                const leafRows = row.getLeafRows();
                const subtotalValue = leafRows.reduce((sum, r) => sum + r.original.marketValue, 0);
                const subtotalCostBasis = leafRows.reduce((sum, r) => sum + r.original.costBasis, 0);
                const subtotalGain = subtotalValue - subtotalCostBasis;
                const subtotalGainPercent = subtotalCostBasis > 0 ? (subtotalGain / subtotalCostBasis) : 0;
                const groupWeight = totalPortfolioValue > 0 ? (subtotalValue / totalPortfolioValue) * 100 : 0;

                return (
                  <div
                    key={row.id}
                    className={styles.groupHeaderRow}
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      height: `${virtualRow.size}px`,
                      width: '100%',
                    }}
                  >
                    <button
                      onClick={row.getToggleExpandedHandler()}
                      className={styles.groupCollapseBtn}
                      type="button"
                    >
                      {row.getIsExpanded() ? '▼' : '▶'}
                    </button>
                    <span className={styles.groupTitle}>
                      {(row.groupingColumnId ? (row.getValue(row.groupingColumnId) as string) : '')} ({leafRows.length} lots)
                    </span>
                    <span className={styles.divider}>|</span>
                    <span className={styles.groupMeta}>
                      Value: <span className={styles.bold}>${subtotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> ({groupWeight.toFixed(2)}% of asset total)
                    </span>
                    <span className={styles.divider}>|</span>
                    <span className={styles.groupMeta}>
                      Unrealized Gain: <span className={`${styles.bold} ${subtotalGain >= 0 ? styles.positive : styles.negative}`}>
                        {subtotalGain >= 0 ? '+' : ''}${subtotalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({(subtotalGainPercent * 100).toFixed(2)}%)
                      </span>
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={row.id}
                  className={styles.row}
                  style={{
                    position: 'absolute',
                    top: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                    width: '100%',
                  }}
                >
                  {row.getVisibleCells().map(cell => {
                    const width = cell.column.getSize();
                    const isPinned = columnPinning.left?.includes(cell.column.id);
                    const symbol = row.original.symbol;
                    const changeMeta = changes[symbol];
                    const now = Date.now();
                    const flashClass = changeMeta && now - changeMeta.timestamp < 800
                      ? (changeMeta.type === 'positive' ? styles.flashPositive : styles.flashNegative)
                      : '';

                    return (
                      <div
                        key={cell.id}
                        className={`${styles.cell} ${isPinned ? styles.pinnedLeft : ''} ${flashClass}`}
                        style={{
                          width: `${width}px`,
                          left: isPinned ? '0px' : undefined
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
