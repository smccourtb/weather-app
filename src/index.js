import "./style.css";
import "regenerator-runtime/runtime";

import * as api from "./api-func";

let preferredUnit = "imperial";
// element for user input to search for city
const form = document.querySelector("form");
const cityName = document.querySelector(".city-name");
const temperature = document.querySelector(".temp");
const desc = document.querySelector(".weather-desc");
const celsiusBtn = document.querySelector(".c");
const farenheitBtn = document.querySelector(".f");

// set farenheit as defualt selected for styles
farenheitBtn.classList.add("selected-temp");

async function getWeather() {
  const coords = await api.getCoords(api.getInputValue());
  const weatherData = await api.getDetailedWeather(coords, preferredUnit);
  console.log("WEATHER DATA: ", weatherData);
  if (coords.state) {
    cityName.textContent = `${coords.name}, ${coords.state}`;
  } else {
    cityName.textContent = `${coords.name}, ${coords.country}`;
  }
  const { temp } = weatherData.current;
  temperature.textContent = `${Math.round(temp)}℉`;
  desc.textContent = weatherData.current.weather[0].description;
  const { daily } = weatherData;
  const forecastData = daily.map((x) => api.getDailyForecast(x.dt, x.temp));
  console.log(forecastData);
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
  }
});

farenheitBtn.addEventListener("click", () => {
  if (preferredUnit === "metric") {
    farenheitBtn.classList.add("selected-temp");
    celsiusBtn.classList.remove("selected-temp");
    preferredUnit = "imperial";
  }
});
