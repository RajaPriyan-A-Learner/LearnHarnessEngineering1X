import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@wma/shared-utils';
import styles from './SearchField.module.css';

export interface SearchItem {
  id: string;
  name: string;
  totalValue: number;
  dayChangePercent: number;
  riskProfile: string;
  accounts: string[];
  taxId: string;
  segment: string;
}

interface SearchFieldProps {
  onSelect: (item: SearchItem) => void;
  debounceTime?: number;
}

export const SearchField: React.FC<SearchFieldProps> = ({ onSelect, debounceTime = 200 }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, debounceTime);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/clients?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(true);
          setActiveIndex(-1);
        }
      } catch (err) {
        console.error('Failed to fetch clients', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (item: SearchItem) => {
    onSelect(item);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by name, ACCT#, SSN..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (query && results.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className={styles.input}
          aria-label="Client search bar"
        />
        {loading && <Loader2 className={styles.spinnerIcon} size={18} />}
      </div>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {results.length > 0 ? (
            results.map((item, index) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`${styles.item} ${index === activeIndex ? styles.activeItem : ''}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <div className={styles.clientName}>{item.name}</div>
                <div className={styles.clientMeta}>
                  <span>ID: {item.id} • Tax ID: {item.taxId}</span>
                  <span>${(item.totalValue / 1000000).toFixed(2)}M AUM • {item.segment}</span>
                </div>
              </li>
            ))
          ) : (
            <li className={styles.noResults}>No matching clients found</li>
          )}
        </ul>
      )}
    </div>
  );
};
