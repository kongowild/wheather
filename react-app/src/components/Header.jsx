import React from 'react';

export default function Header({ query, setQuery, onSearch, currentPage = 'home', onNavigate }) {
  return (
    <div className="header-bar">
      <div className="brand">Kongowild News</div>
      <div className="nav">
        <button className={"link-btn" + (currentPage==='home' ? ' active' : '')} onClick={()=>onNavigate?.('home')}>Home</button>
        <button className={"link-btn" + (currentPage==='watch' ? ' active' : '')} onClick={()=>onNavigate?.('watch')}>Watch</button>
        <button className={"link-btn" + (currentPage==='contact' ? ' active' : '')} onClick={()=>onNavigate?.('contact')}>Contact</button>
      </div>
      {(currentPage === 'home' || currentPage === 'watch') ? (
        <form className="search" onSubmit={(e)=>{e.preventDefault(); onSearch?.(query);}}>
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder={currentPage==='watch' ? 'Search videos' : 'Search news'}
            aria-label={currentPage==='watch' ? 'Search videos' : 'Search news'}
          />
          <button type="submit" aria-label="Search">🔍</button>
        </form>
      ) : <div />}
    </div>
  );
}
