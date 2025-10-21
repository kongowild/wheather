// Simple weather widget using OpenWeatherMap Current Weather API
// Set your API key here or via the browser devtools before running: window.OPENWEATHER_API_KEY = "...";

(function(){
  const API_KEY = "c75d9d0886c49977af27ee38d4842e97";
  const DEFAULT_CITY = localStorage.getItem("preferredCity") || "New York";

  const form = document.getElementById("weatherForm");
  const input = document.getElementById("weatherSearch");
  const result = document.getElementById("weatherResult");

  function renderLoading(city){
    result.innerHTML = `<div class="weather-loading">Loading weather for <strong>${escapeHtml(city)}</strong>…</div>`;
  }

  function renderError(msg){
    result.innerHTML = `<div class="weather-error">${escapeHtml(msg)}</div>`;
  }

  function renderWeather(city, data){
    const celsius = (data.main.temp - 273.15).toFixed(1);
    const feels = (data.main.feels_like - 273.15).toFixed(1);
    const icon = data.weather?.[0]?.icon;
    const desc = data.weather?.[0]?.description || "";

    result.innerHTML = `
      <div class="weather-header">
        <div class="city">${escapeHtml(city)}</div>
        <div class="desc">${escapeHtml(capitalize(desc))}</div>
      </div>
      <div class="weather-main">
        <img class="icon" alt="${escapeHtml(desc)}" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
        <div class="temp">${celsius}°C</div>
      </div>
      <div class="weather-meta">
        <div>Feels like: <strong>${feels}°C</strong></div>
        <div>Humidity: <strong>${data.main.humidity}%</strong></div>
        <div>Wind: <strong>${Math.round(data.wind.speed)} m/s</strong></div>
      </div>
    `;
  }

  async function getWeatherByCity(city){
    if(!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY"){
      renderError("Missing API key. Set window.OPENWEATHER_API_KEY or edit app.js.");
      return;
    }

    renderLoading(city);
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
      const res = await fetch(url);
      if(!res.ok){
        const t = await res.text();
        throw new Error(`Request failed (${res.status}): ${t}`);
      }
      const data = await res.json();
      renderWeather(city, data);
    }catch(err){
      renderError(`Could not load weather for "${city}": ${err.message}`);
    }
  }

  form?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const city = (input?.value || "").trim();
    if(!city) return;
    localStorage.setItem("preferredCity", city);
    getWeatherByCity(city);
  });

  // Initial load
  if(result){
    input && (input.value = DEFAULT_CITY);
    getWeatherByCity(DEFAULT_CITY);
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"]+/g, (c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  }
  function capitalize(s){
    return s ? s[0].toUpperCase() + s.slice(1) : s;
  }
})();
