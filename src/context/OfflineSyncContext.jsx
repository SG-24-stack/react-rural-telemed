import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

export const OfflineSyncContext = createContext(undefined);

const QUEUE_KEY = 'ruralcare_sync_queue';
const API_BASE = 'https://rural-telemedicine-backend.onrender.com';

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Storage full or unavailable
  }
}

// ── Built-in sync handler ───────────────────────────────────────────────────
// Maps a queued action's `type` to the actual backend request needed to
// persist it. Add a case here whenever a new kind of offline action is
// introduced (e.g. appointment status updates), so the Provider can flush
// ANY queued action automatically — without a specific page needing to be
// mounted when connectivity returns.
async function syncItemToServer(item) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  switch (item.type) {
    case 'prescription': {
      const response = await fetch(`${API_BASE}/api/doctors/prescription`, {
        method: 'POST',
        headers,
        body: JSON.stringify(item.payload),
      });
      if (!response.ok) throw new Error(`Prescription sync failed (${response.status})`);
      return response;
    }
    default:
      throw new Error(`Unknown offline sync action type: ${item.type}`);
  }
}

export function OfflineSyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState(readQueue);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    writeQueue(queue);
  }, [queue]);

  const queueAction = useCallback((action) => {
    setQueue((prev) => [
      ...prev,
      { ...action, id: crypto.randomUUID(), queuedAt: Date.now() },
    ]);
  }, []);

  const flushQueue = useCallback(
    async (syncFn) => {
      if (queue.length === 0) return;
      setIsSyncing(true);
      try {
        const results = await Promise.allSettled(
          queue.map((item) => syncFn(item))
        );
        setQueue((prev) =>
          prev.filter((_, index) => results[index].status === 'rejected')
        );
      } finally {
        setIsSyncing(false);
      }
    },
    [queue]
  );

  const clearQueue = useCallback(() => setQueue([]), []);

  // ── Auto-Sync ──────────────────────────────────────────────────────────
  // The moment connectivity returns, flush whatever's queued using the
  // built-in syncItemToServer handler. This runs at the Provider level (root
  // of the app in main.jsx), so it fires regardless of which page the user
  // is currently on — a doctor can submit a prescription offline, navigate
  // away from VideoRoom entirely, and it still syncs automatically once
  // back online.
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      flushQueue(syncItemToServer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return (
    <OfflineSyncContext.Provider
      value={{
        isOnline,
        isOffline: !isOnline,
        isSyncing,
        pendingCount: queue.length,
        queue,
        queueAction,
        flushQueue,
        clearQueue,
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
}

export function useOfflineSync() {
  const context = useContext(OfflineSyncContext);
  if (context === undefined) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
}
