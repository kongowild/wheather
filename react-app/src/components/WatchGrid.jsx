import React from 'react';

export default function WatchGrid({ items = [], onSave, status, error, onLoadMore }) {
  if (status === 'loading' && items.length === 0) {
    return (
      <div className="watch-grid-wrap">
        <div className="watch-grid-list">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="watch-card is-skeleton" aria-hidden>
              <div className="watch-thumb-wrap skeleton watch-skel-thumb" />
              <div className="watch-body">
                <div className="skeleton watch-skel-line" />
                <div className="skeleton watch-skel-line short" />
                <div className="skeleton watch-skel-btn" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (status === 'error') {
    return <div className="watch-grid-error">{error?.message || 'Failed to load videos'}</div>;
  }
  if (items.length === 0) {
    return (
      <div className="watch-grid-empty">
        <div className="muted">No videos yet.</div>
        <div>Try searching above.</div>
      </div>
    );
  }
  return (
    <div className="watch-grid-wrap">
      <div className="watch-grid-list">
        {items.map((v) => (
          <a key={v.id} className="watch-card" href={v.url} target="_blank" rel="noreferrer">
            <div className="watch-thumb-wrap">
              {v.thumbnail && <img className="watch-thumb" src={v.thumbnail} alt="thumb" />}
            </div>
            <div className="watch-body">
              <div className="watch-title">{v.title}</div>
              <div className="watch-meta">{v.channel} • {new Date(v.publishedAt).toLocaleDateString()}</div>
              <button className="btn small" type="button" onClick={(e)=>{e.preventDefault(); onSave?.(v);}}>Watch Later</button>
            </div>
          </a>
        ))}
      </div>
      <div className="watch-grid-actions">
        {status === 'loading' && items.length > 0 && <div className="muted">Loading…</div>}
        {onLoadMore && <button className="btn" type="button" onClick={onLoadMore}>Load more</button>}
      </div>
    </div>
  );
}
