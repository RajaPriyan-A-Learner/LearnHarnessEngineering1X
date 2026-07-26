import { useEffect, useRef } from 'react';
import { useMarketDataStore } from '../stores/useMarketDataStore';

export const useWebSocket = () => {
  const { setConnectionStatus, setPrices, updatePrices } = useMarketDataStore();

  const socketRef = useRef<WebSocket | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Ring buffer map accumulating symbols and price updates
  const tickBuffer = useRef(new Map<string, { price: number; changePercent: number }>());
  const lastFlushTime = useRef(Date.now());

  // requestAnimationFrame coalescing loop
  const coalescingLoop = () => {
    const now = Date.now();
    if (now - lastFlushTime.current >= 500) {
      if (tickBuffer.current.size > 0) {
        const updates = Object.fromEntries(tickBuffer.current.entries());
        updatePrices(updates);
        tickBuffer.current.clear();
      }
      lastFlushTime.current = now;
    }
    rafIdRef.current = requestAnimationFrame(coalescingLoop);
  };

  const startPollingFallback = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    setConnectionStatus('delayed');

    const poll = async () => {
      try {
        const res = await fetch('/api/prices');
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
          setConnectionStatus('delayed');
        } else {
          setConnectionStatus('offline');
        }
      } catch (e) {
        setConnectionStatus('offline');
      }
    };

    // Run once immediately
    poll();
    pollIntervalRef.current = setInterval(poll, 3000);
  };

  const connectWebSocket = () => {
    // Clear reconnect timeout if active
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    const wsUrl = `${protocol}//${host}:3001/ws`;

    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setConnectionStatus('live');
        // Clear REST polling if websocket is open
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const tick = JSON.parse(event.data);
          if (tick.type === 'TICK' && tick.symbol) {
            tickBuffer.current.set(tick.symbol, {
              price: tick.price,
              changePercent: tick.changePercent,
            });
          }
        } catch (e) {
          console.error('Failed to parse ticker stream data', e);
        }
      };

      socket.onclose = () => {
        socketRef.current = null;
        startPollingFallback();
        // Schedule reconnection attempt in 10s
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 10000);
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch (err) {
      startPollingFallback();
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 10000);
    }
  };

  useEffect(() => {
    // Start coalescing loop
    rafIdRef.current = requestAnimationFrame(coalescingLoop);

    // Initial WebSocket connection
    connectWebSocket();

    return () => {
      // Cleanups
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return null;
};
