import "./style.css";
import "regenerator-runtime/runtime";
import * as api from "./api-func";
import background from "./background.jpg";

// element for user input to search for city
const form = document.querySelector("form");
const cityName = document.querySelector(".city-name");
const temperature = document.querySelector(".temp");
const desc = document.querySelector(".weather-desc");

async function getWeather() {
  const coords = await api.getCoords(api.getInputValue());
  const weatherData = await api.getDetailedWeather(coords);
  console.log(weatherData);
  if (coords.state) {
    cityName.textContent = `${coords.name}, ${coords.state}`;
  } else {
    cityName.textContent = `${coords.name}, ${coords.country}`;
  }
  const { temp } = weatherData.current;
  const formula = (parseInt(temp, 10) - 273.15) * (9 / 5) + 32;
  temperature.textContent = `${Math.round(formula)}℉`;
  desc.textContent = weatherData.current.weather[0].description;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather();
});
