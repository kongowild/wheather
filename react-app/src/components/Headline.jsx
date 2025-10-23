import React from 'react';

export default function Headline({ articles = [], addToList }){
  if (!articles || articles.length === 0) return <div className="headline-empty">No headline</div>;
  return (
    <div className="headline-scroll">
      {articles.map((a) => (
        <a key={a.id} className="headline-card headline-single" href={a.url} target="_blank" rel="noreferrer">
          {a.image && <img className="headline-img" src={a.image} alt="headline" />}
          <div className="headline-overlay">
            <div className="headline-title clamp-2">{a.title}</div>
            <div className="headline-meta">{new Date(a.date).toLocaleDateString()}</div>
            <button className="btn" type="button" onClick={(e)=>{e.preventDefault(); addToList?.(a);}}>Read Later</button>
          </div>
        </a>
      ))}
    </div>
  );
}
