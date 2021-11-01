import './style.css';

const weatherData = 'http://api.openweathermap.org/data/2.5/weather?q=';
const city = 'Topsham';
const api = '&APPID=7b58a8dc115b1a34f3bcde976a724019';
async function getWeather() {
  const response = await fetch(weatherData + city + api, { mode: 'cors' });
  response.json().then((res) => {
    console.log(res.weather[0]);
  })
    .catch((err) => {
      console.log('ERR: ', err);
    });
}

getWeather();
