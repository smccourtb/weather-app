import "./style.css";
import "regenerator-runtime/runtime";

const weatherData = "http://api.openweathermap.org/data/2.5/weather?q=";
const api = "&APPID=7b58a8dc115b1a34f3bcde976a724019";

async function getWeather(searchValue) {
  const response = await fetch(weatherData + searchValue + api, { mode: "cors" });
  response.json().then((res) => {
    console.log(res);
  })
    .catch((err) => {
      console.log("ERR: ", err);
    });
}

const input = document.querySelector("#city");
const form = document.querySelector("form");
const btn = document.querySelector("button");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather(input.value);
  input.value = "";
});
