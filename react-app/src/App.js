import './App.css';
import WeatherCard from './WeatherCard';
import Calendar from './Calendar';
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Headline from './components/Headline';
import NewsGrid from './components/NewsGrid';
import useArticles from './hooks/useArticles';
import useReadingList from './hooks/useReadingList';
import WatchGrid from './components/WatchGrid';
import useVideos from './hooks/useVideos';
import useGuardianVideos from './hooks/useGuardianVideos';
import useWatchList from './hooks/useWatchList';

function App() {
  const [topic, setTopic] = useState('technology');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState('home'); // 'home' | 'watch' | 'contact'
  const { items, status, error, loadMore } = useArticles({ topic, query, pageSize: 12 });
  const { list, add, remove } = useReadingList();
  const videoSource = (process.env.REACT_APP_VIDEO_SOURCE || (typeof window !== 'undefined' ? window.VIDEO_SOURCE : '') || 'guardian').toLowerCase();
  const useYT = videoSource === 'youtube';
  const gv = useGuardianVideos({ topic, query, pageSize: 12, enabled: !useYT });
  const yt = useVideos({ topic, query, pageSize: 12, enabled: useYT });
  const videos = useYT ? yt.items : gv.items;
  const vStatus = useYT ? yt.status : gv.status;
  const vError = useYT ? yt.error : gv.error;
  const vLoadMore = useYT ? yt.loadMore : gv.loadMore;
  const { list: watchList, add: addWatch, remove: removeWatch } = useWatchList();
  const headlineItems = items.slice(0,6);
  const rest = items.slice(6);
  return (
    <div className="app">
      <header className="card header">
        <Header
          query={query}
          setQuery={setQuery}
          onSearch={setQuery}
          currentPage={page}
          onNavigate={setPage}
        />
      </header>

      <aside className="card user">
        <div className="user-card">
          <div className="avatar">🦊</div>
          <div>
            <div className="name">kongowild</div>
            <div className="muted">@kongowild • Editor</div>
          </div>
        </div>
        <div className="user-bio">Building delightful UIs and curating tech stories. Coffee-powered ☕</div>
        <div className="user-meta">
          <span>📍 Bengaluru, IN</span>
          <span>•</span>
          <span>Joined 2023</span>
        </div>
        <div className="user-actions">
          <button className="btn small" type="button">Follow</button>
          <button className="btn small" type="button">Message</button>
        </div>
        <div className="user-stats">
          <div className="stat">
            <div className="stat-num">128</div>
            <div className="stat-label">Following</div>
          </div>
          <div className="stat">
            <div className="stat-num">3.2k</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat">
            <div className="stat-num">54</div>
            <div className="stat-label">Lists</div>
          </div>
        </div>
      </aside>
      <aside className="card categories">
        {page === 'home' ? (
          <Sidebar topic={topic} setTopic={setTopic} />
        ) : page === 'watch' ? (
          <div className="section-title">Watch</div>
        ) : (
          <div className="section-title">Contact</div>
        )}
      </aside>

      <main className="card headline">
        {page === 'home' ? (
          <Headline articles={headlineItems} addToList={add} />
        ) : page === 'watch' ? (
          <div className="page-content">
            <h2>Watch</h2>
            <p>Search and discover the latest news videos. Save videos to your Watch Later list.</p>
          </div>
        ) : (
          <div className="page-content">
            <h2>Contact</h2>
            <p>Have feedback or ideas? Connect using the social links in the footer, or open an issue on the repository.</p>
          </div>
        )}
      </main>
      {page === 'home' ? (
        <section className="card blogs">
          <div className="section-title">My Reading List</div>
          <div className="reading-items">
            {list.length === 0 && <div className="muted">No saved articles yet.</div>}
            {list.map(a => (
              <a key={a.id} className="reading-card" href={a.url} target="_blank" rel="noreferrer">
                {a.image && <img className="reading-img" src={a.image} alt="thumb" />}
                <div className="reading-body">
                  <div className="reading-title">{a.title}</div>
                  <div className="reading-meta">{new Date(a.date).toLocaleDateString()}</div>
                </div>
                <button className="icon-btn" type="button" onClick={(e)=>{e.preventDefault(); remove(a.id);}} aria-label="Remove">✕</button>
              </a>
            ))}
          </div>
        </section>
      ) : page === 'watch' ? (
        <section className="card blogs">
          <div className="section-title">Watch Later</div>
          <div className="reading-items">
            {watchList.length === 0 && <div className="muted">No saved videos yet.</div>}
            {watchList.map(v => (
              <a key={v.id} className="reading-card" href={v.url} target="_blank" rel="noreferrer">
                {v.thumbnail && <img className="reading-img" src={v.thumbnail} alt="thumb" />}
                <div className="reading-body">
                  <div className="reading-title">{v.title}</div>
                  <div className="reading-meta">{new Date(v.publishedAt).toLocaleDateString()} • {v.channel}</div>
                </div>
                <button className="icon-btn" type="button" onClick={(e)=>{e.preventDefault(); removeWatch(v.id);}} aria-label="Remove">✕</button>
              </a>
            ))}
          </div>
        </section>
      ) : (
        <section className="card blogs"><div className="muted">Use the navigation to return Home.</div></section>
      )}
      <section className="card weather">
        <WeatherCard />
      </section>
      <section className="card news-grid">
        {page === 'home' ? (
          <>
            <div className="section-title">News Grid</div>
            <NewsGrid items={rest} onSave={add} status={status} error={error} onLoadMore={loadMore} />
          </>
        ) : page === 'watch' ? (
          <>
            <div className="watch-toolbar">
              <button className="chip" type="button" onClick={()=>setQuery('breaking news')}>Breaking</button>
              <button className="chip" type="button" onClick={()=>setQuery('technology news')}>Tech</button>
              <button className="chip" type="button" onClick={()=>setQuery('world news')}>World</button>
              <button className="chip" type="button" onClick={()=>setQuery('sports news')}>Sports</button>
              <span className="source-badge">Source: {useYT ? 'YouTube' : 'Guardian'}</span>
            </div>
            <div className="section-title">Latest Videos</div>
            <WatchGrid items={videos} onSave={addWatch} status={vStatus} error={vError} onLoadMore={vLoadMore} />
          </>
        ) : (
          <div className="muted">Use the navigation to return Home.</div>
        )}
      </section>
      <section className="card calendar"><Calendar /></section>

      <footer className="card footer">
        <div className="footer-links">
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://discord.com/" target="_blank" rel="noreferrer">Discord</a>
          <a href="https://github.com/kongowild/wheather" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div className="muted">© 2025 Kongowild News. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;
