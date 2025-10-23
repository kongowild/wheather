import React from 'react';

export default function ReadingList({ items = [], onRemove }){
  return (
    <div className="reading-list">
      <div className="section-title">My Reading List</div>
      <div className="reading-items">
        {items.length === 0 && <div className="muted">No saved articles yet.</div>}
        {items.map(a => (
          <a key={a.id} className="reading-card" href={a.url} target="_blank" rel="noreferrer">
            {a.image && <img className="reading-img" src={a.image} alt="thumb" />}
            <div className="reading-body">
              <div className="reading-title">{a.title}</div>
              <div className="reading-meta">{new Date(a.date).toLocaleDateString()}</div>
            </div>
            <button className="icon-btn" type="button" onClick={(e)=>{e.preventDefault(); onRemove?.(a.id);}} aria-label="Remove">✕</button>
          </a>
        ))}
      </div>
    </div>
  );
}
