import React from 'react';

const TOPICS = [
  { key: 'technology', label: 'Technology' },
  { key: 'sports', label: 'Sports' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'science', label: 'Science' },
  { key: 'world', label: 'World News' },
];

export default function Sidebar({ topic, setTopic }){
  return (
    <div className="sidebar">
      <div className="user-card">
        <div className="avatar">🦊</div>
        <div className="name">kongowild</div>
        <div className="muted">@kongowild</div>
      </div>
      <div className="user-bio">Designer of clean dashboards. Weather watcher and news nerd.</div>
      <div className="user-meta"><span>📍 Bengaluru</span> <span>•</span> <span>Editor</span></div>
      <div className="user-actions">
        <button className="btn small" type="button">Follow</button>
        <button className="btn small" type="button">Message</button>
      </div>
      <div className="section-title">Topics</div>
      <nav className="topics">
        {TOPICS.map(t => (
          <button
            key={t.key}
            className={"topic" + (topic === t.key ? " active" : "")}
            onClick={()=>setTopic(t.key)}
            aria-pressed={topic === t.key}
          >{t.label}</button>
        ))}
      </nav>
    </div>
  );
}
