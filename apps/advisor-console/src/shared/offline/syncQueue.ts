/* src/shared/offline/syncQueue.ts */
// Simple in-memory queue persisted to IndexedDB via offline.ts.
// Each queued request is stored as a serializable object.

export interface QueuedRequest {
  url: string;
  method: string; // e.g., 'POST', 'PUT', 'DELETE'
  body?: unknown; // JSON-serializable payload
  headers?: Record<string, string>;
}

let inMemoryQueue: QueuedRequest[] = [];

// Load persisted queue from IndexedDB on module init
import { getItem, setItem, removeItem } from './offline';
const QUEUE_KEY = 'offline-sync-queue';

async function loadQueue() {
  const saved = await getItem<QueuedRequest[]>(QUEUE_KEY);
  if (saved) inMemoryQueue = saved;
}
loadQueue(); // fire-and-forget; subsequent calls will await when needed

export async function enqueue(request: QueuedRequest): Promise<void> {
  inMemoryQueue.push(request);
  await setItem(QUEUE_KEY, inMemoryQueue);
}

export async function clearQueue(): Promise<void> {
  inMemoryQueue = [];
  await removeItem(QUEUE_KEY);
}

export async function processQueue(): Promise<void> {
  // Process items sequentially; if any fail, stop and keep remaining items.
  let failIndex = inMemoryQueue.length; // default: all succeeded
  for (let i = 0; i < inMemoryQueue.length; i++) {
    const req = inMemoryQueue[i];
    try {
      await fetch(req.url, {
        method: req.method,
        headers: { 'Content-Type': 'application/json', ...(req.headers ?? {}) },
        body: req.body ? JSON.stringify(req.body) : undefined,
        credentials: 'include',
      });
    } catch (e) {
      // Network still offline or request failed - abort processing.
      console.warn('Sync queue processing halted, will retry later', e);
      failIndex = i;
      break;
    }
  }
  // Keep only items that were not yet processed
  inMemoryQueue = inMemoryQueue.slice(failIndex);
  await setItem(QUEUE_KEY, inMemoryQueue);
}

export function getQueue(): QueuedRequest[] {
  return [...inMemoryQueue];
}
