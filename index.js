function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thusday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col-2">
    <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
    <img
      src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDay.condition.icon
      }.png"
      alt=""
      width="45px"
    />
    <div class="weather-forecast-temperature">
      <span class="weather-forecast-temperature-max"> ${Math.round(
        forecastDay.temperature.maximum
      )}° </span>
      <span class="weather-forecast-temperature-min"> ${Math.round(
        forecastDay.temperature.minimum
      )}° </span>
    </div>
  </div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apyKey = "36b271batd87045do907f8b455c541bf";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apyKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconUrl = document.querySelector("#icon");

  celsiusTemperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconUrl.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconUrl.setAttribute("alt", response.data.condition.description);
  document.getElementById("search-form").reset();

  getForecast(response.data.coordinates);
}

function search(city) {
  let apyKey = "36b271batd87045do907f8b455c541bf";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apyKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apyKey = "36b271batd87045do907f8b455c541bf";
  let apiUrlCurrent = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apyKey}`;
  axios.get(apiUrlCurrent).then(displayTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocation = document.querySelector("#current");
currentLocation.addEventListener("click", getCurrentPosition);

search("San Diego");
