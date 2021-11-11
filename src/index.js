import "./style.css";
import "regenerator-runtime/runtime";
import * as dom from "./dom-func";
import * as api from "./api-func";

let preferredUnit = "imperial";
let lastSearchValue = "topsham,me";
let selectedForecast = "daily";
let hourlyForecastPage = 1;
const celsiusSymbol = "°C";
const farenheitSymbol = "°F";
// element for user input to search for city
const form = document.querySelector("form");
const cityName = document.querySelector(".city-name");
const temperature = document.querySelector(".temp");
const desc = document.querySelector(".weather-desc");
const celsiusBtn = document.querySelector(".c");
const farenheitBtn = document.querySelector(".f");
const forecastContainer = document.querySelector(".forecast-container");
const dailyForecast = document.querySelector(".daily");
const hourlyForecast = document.querySelector(".hourly");

// set farenheit as defualt selected for styles
farenheitBtn.classList.add("selected-temp");

function getTempSymbol() {
  if (preferredUnit === "metric") {
    return celsiusSymbol;
  }
  return farenheitSymbol;
}

function updateDailyForecast(dayData) {
  forecastContainer.replaceChildren();

  const navContainer = document.querySelector(".nav-container");
  const buttonGroup = document.querySelector(".btn-group");
  if (navContainer) {
    buttonGroup.removeChild(navContainer);
  }
  for (let i = 0; i < 7; i += 1) {
    forecastContainer.appendChild(dom.buildDailyForecast());
  }
  const dayNodes = document.getElementsByClassName("forecast");
  for (let i = 0; i < dayNodes.length; i += 1) {
    dom.buildDailyForecast();
    const dateInfo = dayNodes[i].children[0];
    const weatherInfo = dayNodes[i].children[1];
    dateInfo.children[0].innerText = dayData[i].dayString;
    dateInfo.children[1].innerText = `${dayData[i].month} ${dayData[i].dayOfMonth}`;
    const temps = weatherInfo.children[0];
    const weather = weatherInfo.children[1];
    temps.children[0].children[0].children[0].textContent = dayData[i].tempDay;
    temps.children[0].children[0].children[1].textContent = getTempSymbol();
    temps.children[1].children[0].children[0].textContent = dayData[i].tempMin;
    temps.children[1].children[0].children[1].textContent = getTempSymbol();
    weather.children[0].src = dayData[i].weatherIcon;
    weather.children[1].textContent = dayData[i].precipitationChance;
  }
}

function buildHourlyNav() {
  const navContainer = document.createElement("nav");
  const left = document.createElement("button");
  const right = document.createElement("button");
  left.classList.add("left-nav");
  right.classList.add("right-nav");
  navContainer.classList.add("nav-container");
  left.textContent = "<";
  right.textContent = ">";

  navContainer.appendChild(left);
  navContainer.appendChild(right);
  right.addEventListener("click", () => {
    if (hourlyForecastPage < 3) {
      hourlyForecastPage += 1;
      getWeather(lastSearchValue);
    }
  });
  left.addEventListener("click", () => {
    if (hourlyForecastPage > 1) {
      hourlyForecastPage -= 1;
      getWeather(lastSearchValue);
    }
  });
  return navContainer;
}

function updateHourlyForecast(hourlyData, pageNum = 1) {
  forecastContainer.replaceChildren();
  let shiftAmount = 0;
  if (pageNum === 2) {
    shiftAmount = 7;
  }
  if (pageNum === 3) {
    shiftAmount = 14;
  }
  for (let i = 0; i < 7; i += 1) {
    forecastContainer.appendChild(dom.buildHourlyForecast());
  }
  const dayNodes = document.getElementsByClassName("forecast");
  console.log("DAY NODES: ", dayNodes);
  for (let i = 0; i < dayNodes.length; i += 1) {
    const hourInfo = dayNodes[i].children[0];
    const weatherInfo = dayNodes[i].children[1];
    hourInfo.children[0].innerText = api.convertHours(hourlyData[i + shiftAmount].hour);
    if (hourlyData[i + shiftAmount].hour < 13 && hourlyData[i + shiftAmount].hour >= 0) {
      hourInfo.children[1].innerText = "AM";
    } else { hourInfo.children[1].innerText = "PM"; }
    weatherInfo.children[0].children[0].textContent = Math.round(hourlyData[i + shiftAmount].temp);
    weatherInfo.children[0].children[1].textContent = getTempSymbol();
    weatherInfo.children[1].children[0].src = hourlyData[i + shiftAmount].weatherIcon;
    weatherInfo.children[1].children[1].textContent = hourlyData[i + shiftAmount].precipitationChance;
  }
}
async function getWeather(location = "") {
  let query;
  if (!location) {
    query = api.getInputValue();
    if (query) {
      lastSearchValue = query;
    } else {
      query = location;
      lastSearchValue = query;
    }
  } else {
    query = lastSearchValue;
  }
  const coords = await api.getCoords(query);
  const weatherData = await api.getDetailedWeather(coords, preferredUnit);
  console.log("WEATHER DATA: ", weatherData);
  if (coords.state) {
    cityName.textContent = `${coords.name}, ${coords.state}`;
  } else {
    cityName.textContent = `${coords.name}, ${coords.country}`;
  }
  const { temp } = weatherData.current;
  temperature.textContent = `${Math.round(temp)}${getTempSymbol()}`;
  desc.textContent = weatherData.current.weather[0].description;
  const { daily, hourly } = weatherData;

  if (selectedForecast === "hourly") {
    const hourlyForecastData = hourly.map((x) => api.getHourlyForecast(x.dt, x.temp,
      x.weather[0].icon, x.pop));
    updateHourlyForecast(hourlyForecastData, hourlyForecastPage);
  } else {
    const dailyForecastData = daily.map((x) => api.getDailyForecast(x.dt, x.temp,
      x.weather[0].icon, x.pop));
    dailyForecastData.shift();
    updateDailyForecast(dailyForecastData);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather();
});

celsiusBtn.addEventListener("click", () => {
  if (preferredUnit === "imperial") {
    farenheitBtn.classList.remove("selected-temp");
    celsiusBtn.classList.add("selected-temp");
    preferredUnit = "metric";
    getWeather(lastSearchValue);
  }
});

farenheitBtn.addEventListener("click", () => {
  if (preferredUnit === "metric") {
    farenheitBtn.classList.add("selected-temp");
    celsiusBtn.classList.remove("selected-temp");
    preferredUnit = "imperial";
    getWeather(lastSearchValue);
  }
});

dailyForecast.addEventListener("click", () => {
  if (selectedForecast === "hourly") {
    selectedForecast = "daily";
  }
  getWeather(lastSearchValue);
});

hourlyForecast.addEventListener("click", () => {
  if (selectedForecast === "daily") {
    selectedForecast = "hourly";
    const buttonGroup = document.querySelector(".btn-group");

    buttonGroup.appendChild(buildHourlyNav());
  }
  getWeather(lastSearchValue);
});
