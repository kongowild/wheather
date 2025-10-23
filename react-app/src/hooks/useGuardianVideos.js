import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API = 'https://content.guardianapis.com/search';

export default function useGuardianVideos({ topic = 'technology', query = '', pageSize = 12, enabled = true } = {}) {
  const apiKey = process.env.REACT_APP_GUARDIAN_API_KEY || (typeof window !== 'undefined' ? window.GUARDIAN_API_KEY : undefined);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const abortRef = useRef();

  const q = useMemo(() => {
    const base = query?.trim() ? query.trim() : `${topic} news`;
    return base;
  }, [topic, query]);

  const fetchPage = useCallback(async (reset = false) => {
    if (!enabled) return;
    if (!apiKey) {
      setStatus('error');
      setError(new Error('Missing Guardian API key'));
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      setStatus('loading');
      setError(null);
      const params = new URLSearchParams({
        'api-key': apiKey,
        'order-by': 'newest',
        'page-size': String(pageSize),
        'page': String(reset ? 1 : page),
        'show-fields': 'thumbnail,trailText,byline,headline',
        'q': q || '',
        'type': 'video',
      });
      const url = `${API}?${params.toString()}`;
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`Guardian error (${res.status})`);
      const json = await res.json();
      const results = json?.response?.results || [];
      const mapped = results.map(r => ({
        id: r.id,
        title: r.fields?.headline || r.webTitle,
        channel: r.fields?.byline || r.sectionName || 'The Guardian',
        publishedAt: r.webPublicationDate,
        thumbnail: r.fields?.thumbnail || '',
        url: r.webUrl,
      }));
      setItems(prev => reset ? mapped : [...prev, ...mapped]);
      setStatus('success');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setStatus('error');
      setError(e);
    }
  }, [apiKey, page, pageSize, q, enabled]);

  // Reset when query/topic changes or when enabling
  useEffect(() => { if (enabled) { setPage(1); setItems([]); } }, [q, enabled]);
  useEffect(() => { if (enabled) fetchPage(page === 1); }, [fetchPage, page, enabled]);

  const loadMore = useCallback(() => { if (enabled) setPage(p => p + 1); }, [enabled]);

  return { items, status, error, loadMore, page, setPage };
}
