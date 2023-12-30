// script.js

document.addEventListener("DOMContentLoaded", function () {
    // Replace 'YOUR_API_KEY' with your actual API key
    const apiKey = 'YOUR_API_KEY';
    const city = 'YourCity';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const weatherContainer = document.getElementById('weather-container');
  
        for (let i = 0; i < data.list.length; i += 8) {
          const weatherInfo = data.list[i];
          const date = new Date(weatherInfo.dt_txt);
          const iconCode = weatherInfo.weather[0].icon;
          const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  
          const card = document.createElement('div');
          card.classList.add('weather-card');
  
          const dateElement = document.createElement('div');
          dateElement.textContent = date.toDateString();
          card.appendChild(dateElement);
  
          const iconElement = document.createElement('img');
          iconElement.classList.add('weather-icon');
          iconElement.src = iconUrl;
          card.appendChild(iconElement);
  
          const temperatureElement = document.createElement('div');
          temperatureElement.textContent = `Temperature: ${weatherInfo.main.temp} °C`;
          card.appendChild(temperatureElement);
  
          const sunriseSunsetElement = document.createElement('div');
          sunriseSunsetElement.classList.add('sunrise-sunset');
          sunriseSunsetElement.innerHTML = `
            <img src="sunrise.png" alt="Sunrise" width="20" height="20"> ${new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString()} 
            <img src="sunset.png" alt="Sunset" width="20" height="20"> ${new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString()}
          `;
          card.appendChild(sunriseSunsetElement);
  
          weatherContainer.appendChild(card);
        }
      })
      .catch(error => console.error('Error fetching weather data:', error));
  });
  