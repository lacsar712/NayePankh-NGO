// Admin logic layer — shared collection loader
// Consolidates the "load once on mount (Firestore + local mirror), keep seed
// data when empty, expose a uniform `loading` flag" pattern used by every
// async domain hook. Naming (`data` / `setData` / `loading`) is intentionally
// uniform so all domain hooks return a consistent shape.
import { useState, useEffect } from 'react';

export function useCollectionLoader(loadFn, { initialData = [], keepInitialWhenEmpty = false } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.resolve(loadFn())
      .then((list) => {
        if (!alive) return;
        const isEmpty = !Array.isArray(list) || list.length === 0;
        if (!keepInitialWhenEmpty || !isEmpty) setData(list);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
    // Mount-only load; loadFn is a stable service call by contract.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, setData, loading };
}
