const forecastContainer = document.querySelector(".forecast-container");
const buttonGroup = document.querySelector(".btn-group");

function buildDailyForecast() {
  // holds all elements inside
  const dailyContainer = document.createElement("div");
  // contains day of the week and date
  const dateInfo = document.createElement("div");
  const day = document.createElement("p");
  const date = document.createElement("p");
  // contains temperatures, icons, and precipitation chance
  const weatherInfo = document.createElement("div");
  const temps = document.createElement("div");
  const avgContainer = document.createElement("div");
  const avg = document.createElement("div");
  const dayTemp = document.createElement("div");
  const avgTempSymbol = document.createElement("span");
  const avgSub = document.createElement("p");
  const minContainer = document.createElement("div");
  const min = document.createElement("div");
  const minTemp = document.createElement("div");
  const minTempSymbol = document.createElement("span");
  const minSub = document.createElement("p");
  const weather = document.createElement("div");
  const img = document.createElement("img");
  const chance = document.createElement("p");

  // add classes for styling
  dailyContainer.classList.add("forecast");
  dateInfo.classList.add("date-info");
  day.classList.add("day");
  date.classList.add("date");
  weatherInfo.classList.add("weather-info");
  temps.classList.add("temps");
  avgContainer.classList.add("avg");
  dayTemp.classList.add("day-temp");
  avgTempSymbol.classList.add("ts");
  minContainer.classList.add("low");
  minTemp.classList.add("day-low");
  minTempSymbol.classList.add("ts");
  weather.classList.add("weather");
  chance.classList.add("precipitation");

  // add elements to containers

  dateInfo.appendChild(day);
  dateInfo.appendChild(date);

  avg.appendChild(dayTemp);
  avg.appendChild(avgTempSymbol);
  avgContainer.appendChild(avg);
  avgContainer.appendChild(avgSub);
  min.appendChild(minTemp);
  min.appendChild(minTempSymbol);
  minContainer.appendChild(min);
  minContainer.appendChild(minSub);
  temps.appendChild(avgContainer);
  temps.appendChild(minContainer);
  weather.appendChild(img);
  weather.appendChild(chance);
  weatherInfo.appendChild(temps);
  weatherInfo.appendChild(weather);
  dailyContainer.append(dateInfo, weatherInfo);
  return dailyContainer;
}

function buildHourlyForecast() {

}

export { buildDailyForecast, buildHourlyForecast };
