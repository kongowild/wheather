import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'watchList';

export default function useWatchList() {
  const [list, setList] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
    catch {}
  }, [list]);

  const add = useCallback((item) => {
    setList(prev => prev.find(x => x.id === item.id) ? prev : [...prev, item]);
  }, []);
  const remove = useCallback((id) => setList(prev => prev.filter(x => x.id !== id)), []);
  const toggle = useCallback((item) => setList(prev => prev.find(x => x.id === item.id) ? prev.filter(x => x.id !== item.id) : [...prev, item]), []);

  return useMemo(() => ({ list, add, remove, toggle }), [list, add, remove, toggle]);
}
