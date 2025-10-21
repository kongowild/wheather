const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ----- Hook: useWeather -----
const STORAGE_KEY = "preferredCity";
const API_ROOT = "https://api.openweathermap.org/data/2.5/weather";

function useWeather({ apiKey, initialCity = "Bengaluru" }) {
  const [city, setCity] = useState(() => localStorage.getItem(STORAGE_KEY) || initialCity);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const abortRef = useRef();

  const fetchCity = useCallback(async (targetCity) => {
    if (!apiKey) {
      setStatus("error");
      setError(new Error("Missing OpenWeather API key"));
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      setStatus("loading");
      setError(null);
      const url = `${API_ROOT}?q=${encodeURIComponent(targetCity)}&appid=${apiKey}&units=metric`;
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      setData(json);
      setStatus("success");
      localStorage.setItem(STORAGE_KEY, targetCity);
      setCity(targetCity);
    } catch (e) {
      if (e.name === "AbortError") return;
      setStatus("error");
      setError(e);
    }
  }, [apiKey]);

  const search = useCallback((nextCity) => {
    if (!nextCity || !nextCity.trim()) return;
    fetchCity(nextCity.trim());
  }, [fetchCity]);

  useEffect(() => { fetchCity(city); }, []); // first load

  return useMemo(() => ({ city, data, status, error, search, setCity }), [city, data, status, error, search]);
}

// ----- Icons (SVG) -----
const Pin = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 22s7-6.24 7-12a7 7 0 1 0-14 0c0 5.76 7 12 7 12z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const SearchIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const CloudRain = (props) => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M7 17h9a4 4 0 0 0 0-8 6 6 0 0 0-11.6 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 20l1-2M12 20l1-2M16 20l1-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

function cap(s){ return s ? s[0].toUpperCase()+s.slice(1) : s; }

// ----- Component -----
function WeatherCard({ apiKey }) {
  const { city, data, status, error, search } = useWeather({ apiKey, initialCity: "Bengaluru" });
  const [query, setQuery] = useState(city);
  const temp = data?.main?.temp != null ? Math.round(data.main.temp) : null;
  const desc = data?.weather?.[0]?.description ?? "";
  // compute local date from OWM fields: dt (UTC seconds) + timezone (offset seconds)
  const localDateStr = React.useMemo(() => {
    const dt = data?.dt;
    const tz = data?.timezone; // seconds offset from UTC
    if (dt == null || tz == null) return null;
    const ms = (dt + tz) * 1000;
    // Use a fixed locale-friendly format
    return new Date(ms).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }, [data]);

  return (
    <div className="react-weather">
      <div className="rw-header">
        <Pin className="rw-pin" />
        <div className="rw-city">{city}</div>
        {localDateStr && <div className="rw-date">{localDateStr}</div>}
      </div>

      <form className="rw-form" onSubmit={(e)=>{e.preventDefault(); search(query);}}>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Enter Location" aria-label="Enter Location" />
        <button type="submit" aria-label="Search"><SearchIcon /></button>
      </form>

      <div className="rw-sep" />

      <div className="rw-center">
        {status === "loading" && <div className="rw-muted">Loading…</div>}
        {status === "error" && <div className="rw-error">{error?.message || "Error"}</div>}
        {status === "success" && (<>
          <CloudRain className="rw-big" />
          <div className="rw-desc">{cap(desc)}</div>
          {temp != null && <div className="rw-temp">{temp} °C</div>}
        </>)}
      </div>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("weather-react"));
const apiKey = window.OPENWEATHER_API_KEY || "c75d9d0886c49977af27ee38d4842e97";
root.render(<WeatherCard apiKey={apiKey} />);
