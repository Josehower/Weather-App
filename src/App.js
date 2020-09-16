import React, { useState, useEffect } from 'react';

function LocationWeatherInfoBlock({ getWeather, onload = false }) {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [city, setCity] = useState('');

  function getInfo(cityName) {
    getWeather(cityName)
      .then((response) => response.json())
      .then((res) => {
        setWeatherInfo(res);
      });
  }

  useEffect(() => {
    if (onload) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position, 'frist time');
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.REACT_APP_API_KEY}`,
        )
          .then((response) => response.json())
          .then((res) => setWeatherInfo(res));
      });
    }
  }, [onload]);

  return (
    <div style={{ display: 'inline-block', margin: '10px' }}>
      <img
        src={`http://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`}
        alt=""
      />
      <p>Location &#8594; {weatherInfo?.name}</p>
      <p>Temperature &#8594; {weatherInfo?.main?.temp}</p>
      <p>Weather &#8594; {weatherInfo?.weather?.[0]?.description}</p>
      <label htmlFor="city">your city</label>
      <input
        value={city}
        onChange={(e) => setCity(e.currentTarget.value)}
        type="text"
        name="city"
      />
      <button onClick={() => getInfo(city)}>get your weather</button>
    </div>
  );
}

function App() {
  const [extraLocations, setExtraLocations] = useState([]);

  function addLocation() {
    const actualState = extraLocations;
    const locationTemplate = (
      <LocationWeatherInfoBlock key={new Date()} getWeather={getWeather} />
    );
    setExtraLocations([...actualState, locationTemplate]);
  }

  function getWeather(cityName) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_API_KEY}`,
    );
  }

  return (
    <div>
      <LocationWeatherInfoBlock getWeather={getWeather} onload="true" />
      {extraLocations}
      <button onClick={addLocation}>add Location</button>
    </div>
  );
}

export default App;
