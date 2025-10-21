import './App.css';
import WeatherCard from './WeatherCard';
import Calendar from './Calendar';

function App() {
  return (
    <div className="app">
      <header className="card header">News Header</header>

      <aside className="card user">User</aside>
      <aside className="card categories">Categories</aside>

      <main className="card headline">Headline</main>
      <section className="card blogs">My Blogs</section>
      <section className="card weather">
        <WeatherCard />
      </section>
      <section className="card news-grid">News Grid</section>
      <section className="card calendar"><Calendar /></section>

      <footer className="card footer">Footer</footer>
    </div>
  );
}

export default App;
