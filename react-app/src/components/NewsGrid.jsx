import React from 'react';

export default function NewsGrid({ items = [], onSave, status, error, onLoadMore }) {
  if (status === 'loading' && items.length === 0) {
    return <div className="news-grid-loading">Loading news…</div>;
  }
  if (status === 'error') {
    return <div className="news-grid-error">{error?.message || 'Failed to load news'}</div>;
  }
  if (items.length === 0) {
    return (
      <div className="news-grid-empty">
        <div className="muted">No articles to show yet.</div>
        <div>Try a different topic on the left or use the search above.</div>
      </div>
    );
  }
  return (
    <div className="news-grid-wrap">
      <div className="news-grid-list">
        {items.map((a) => (
          <a key={a.id} className="news-card" href={a.url} target="_blank" rel="noreferrer">
            {a.image && <img className="news-img" src={a.image} alt="thumb" />}
            <div className="news-body">
              <div className="news-badge">{a.sectionName}</div>
              <div className="news-title">{a.title}</div>
              <div className="news-meta">{new Date(a.date).toLocaleDateString()}</div>
              <button className="btn small" type="button" onClick={(e)=>{e.preventDefault(); onSave?.(a);}}>Read Later</button>
            </div>
          </a>
        ))}
      </div>
      <div className="news-grid-actions">
        {status === 'loading' && items.length > 0 && <div className="muted">Loading…</div>}
        {onLoadMore && <button className="btn" type="button" onClick={onLoadMore}>Load more</button>}
      </div>
    </div>
  );
}
