import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API = 'https://content.guardianapis.com/search';

export default function useArticles({ topic = 'technology', query = '', pageSize = 12 } = {}) {
  const apiKey = process.env.REACT_APP_GUARDIAN_API_KEY || (typeof window !== 'undefined' ? window.GUARDIAN_API_KEY : undefined);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const abortRef = useRef();

  const section = useMemo(() => {
    // map topic to guardian section
    const map = {
      technology: 'technology',
      sports: 'sport',
      lifestyle: 'lifeandstyle',
      science: 'science',
      world: 'world',
    };
    return map[String(topic).toLowerCase()] || undefined;
  }, [topic]);

  const fetchPage = useCallback(async (reset = false) => {
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
        'q': query || '',
      });
      if (section) params.set('section', section);
      const url = `${API}?${params.toString()}`;
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`Guardian error (${res.status})`);
      const json = await res.json();
      const results = json?.response?.results || [];
      const mapped = results.map(r => ({
        id: r.id,
        title: r.fields?.headline || r.webTitle,
        excerpt: r.fields?.trailText || '',
        byline: r.fields?.byline || '',
        image: r.fields?.thumbnail || '',
        sectionName: r.sectionName,
        date: r.webPublicationDate,
        url: r.webUrl,
      }));
      setItems(prev => reset ? mapped : [...prev, ...mapped]);
      setStatus('success');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setStatus('error');
      setError(e);
    }
  }, [apiKey, page, pageSize, query, section]);

  // Fetch on topic/query/page changes
  useEffect(() => { setPage(1); setItems([]); }, [topic, query]);
  useEffect(() => { fetchPage(page === 1); }, [fetchPage, page]);

  const loadMore = useCallback(() => setPage(p => p + 1), []);

  return { items, status, error, loadMore, page, setPage };
}
