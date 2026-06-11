'use client';
import { useEffect, useState } from 'react';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    // Initialize Supabase data
    import('@/lib/store').then(({ useAuthStore, useProductStore }) => {
      useAuthStore.getState().initialize();
      useProductStore.getState().fetchProducts();
    });
  }, []);

  if (!hydrated) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
