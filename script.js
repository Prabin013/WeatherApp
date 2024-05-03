function getWeather() {
  const apiKey = '5a6162e7dab13d3b5cf1b53941dd82ac';
  const city = document.getElementById('city').value;

  if (!city) {
    alert('Please enter a city name');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid response from server');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error fetching current weather data: ', error);
      alert('An error occurred while fetching weather data, Please try again');
    });

  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid response from server');
      }
      return response.json();
    })
    .then(data => {
      displayHourlyForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching hourly forecast data: ', error);
      alert('An error occurred while fetching hourly forecast data, Please try again');
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById('temp-div');
  const weatherInfoDiv = document.getElementById('weather-info');
  const weatherIcon = document.getElementById('weather-icon');

  // Clear previous data
  weatherInfoDiv.innerHTML = '';
  tempDivInfo.innerHTML = '';

  if (data.cod === '404') {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHTML = `
      <p>${cityName}</p>
      <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast');
  hourlyForecastDiv.innerHTML = '';

  const next24Hours = hourlyData.slice(0, 8);
  next24Hours.forEach(item => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

    const hourlyItemHTML = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="${item.weather[0].description}">
        <span>${temperature}°C</span>
      </div>
    `;
    hourlyForecastDiv.innerHTML += hourlyItemHTML;
  });
}
