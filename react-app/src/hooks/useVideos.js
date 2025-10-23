import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API = 'https://www.googleapis.com/youtube/v3/search';

export default function useVideos({ topic = 'technology', query = '', pageSize = 12, enabled = true } = {}) {
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY || (typeof window !== 'undefined' ? window.YT_API_KEY : undefined);
  const [pageToken, setPageToken] = useState(undefined);
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
      setError(new Error('Missing YouTube API key'));
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      setStatus('loading');
      setError(null);
      const params = new URLSearchParams({
        key: apiKey,
        q,
        type: 'video',
        part: 'snippet',
        maxResults: String(pageSize),
        order: 'date',
        safeSearch: 'strict',
      });
      if (!reset && pageToken) params.set('pageToken', pageToken);
      const url = `${API}?${params.toString()}`;
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`YouTube error (${res.status})`);
      const json = await res.json();
      const nextPageToken = json?.nextPageToken;
      const results = json?.items || [];
      const mapped = results.map((r) => ({
        id: r.id.videoId,
        title: r.snippet?.title || '',
        channel: r.snippet?.channelTitle || '',
        publishedAt: r.snippet?.publishedAt,
        thumbnail: r.snippet?.thumbnails?.medium?.url || r.snippet?.thumbnails?.default?.url || '',
        url: `https://www.youtube.com/watch?v=${r.id.videoId}`,
      })).filter(v => v.id);
      setItems(prev => reset ? mapped : [...prev, ...mapped]);
      setPageToken(nextPageToken);
      setStatus('success');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setStatus('error');
      setError(e);
    }
  }, [apiKey, pageToken, pageSize, q, enabled]);

  useEffect(() => { if (enabled) { setItems([]); setPageToken(undefined); } }, [q, enabled]);
  useEffect(() => { if (enabled) fetchPage(items.length === 0); }, [fetchPage, enabled]);

  const loadMore = useCallback(() => {
    if (!enabled) return;
    // Trigger fetch with existing next pageToken already kept in state
    fetchPage(false);
  }, [fetchPage, enabled]);

  return { items, status, error, loadMore };
}
