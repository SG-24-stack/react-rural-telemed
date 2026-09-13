import { useOfflineSync } from '../context/OfflineSyncContext';

export default function OfflineBanner() {
  const { isOnline } = useOfflineSync();
  const isOffline = !isOnline;

  if (!isOffline) return null;

  return (
    <div className="bg-yellow-100 border-b-2 border-yellow-500 text-yellow-800 text-sm text-center py-2 px-4">
      ⚠️ You are currently offline. Patient vitals and notes will sync once
      you're back online.
    </div>
  );
}