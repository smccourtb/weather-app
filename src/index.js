import "./style.css";
import "regenerator-runtime/runtime";

import * as api from "./api-func";

let preferredUnit = "imperial";
let lastSearchValue = "";
const celsiusSymbol = "°C";
const farenheitSymbol = "°F";
// element for user input to search for city
const form = document.querySelector("form");
const cityName = document.querySelector(".city-name");
const temperature = document.querySelector(".temp");
const desc = document.querySelector(".weather-desc");
const celsiusBtn = document.querySelector(".c");
const farenheitBtn = document.querySelector(".f");
const dayNodes = document.getElementsByClassName("forecast");

// set farenheit as defualt selected for styles
farenheitBtn.classList.add("selected-temp");

function getTempSymbol() {
  if (preferredUnit === "metric") {
    return celsiusSymbol;
  }
  return farenheitSymbol;
}

function updateDailyForecast(dayData) {
  console.log(dayNodes[0].children[1].children[0]);
  for (let i = 0; i < dayNodes.length; i += 1) {
    dayNodes[i].children[0].innerText = dayData[i].dayString;
    dayNodes[i].children[1].innerText = dayData[i].tempDay;

    dayNodes[i].children[2].textContent = dayData[i].tempMin;
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
  const { daily } = weatherData;
  const forecastData = daily.map((x) => api.getDailyForecast(x.dt, x.temp));

  forecastData.shift();
  updateDailyForecast(forecastData);
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
