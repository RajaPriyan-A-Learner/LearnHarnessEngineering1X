import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@wma/shared-utils';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('should return updated value only after specified delay', () => {
    let value = 'hello';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    expect(result.current).toBe('hello');

    // Update value
    value = 'world';
    rerender();

    // Value should still be 'hello' before delay is complete
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('hello');

    // Value should update to 'world' after delay completes
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('world');
  });
});
