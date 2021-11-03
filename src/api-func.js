// sanitizes and returns the user search value for the api call
function getInputValue() {
  const input = document.querySelector("#city");
  const { value } = input;
  input.value = "";
  if (value) {
    return value
      .replace(/(\s+$|^\s+)/g, "") // remove whitespace from begining and end of string
      .replace(/(,\s+)/g, ",") // remove any white space that follows a comma
      .replace(/(\s+,)/g, ",") // remove any white space that preceeds a comma
      .replace(/\s+/g, "+") // replace any remaining white space with +, so it works in api call
      .toLowerCase();
  }
  return "";
}

function convertStateInput(state) {
  // TODO: finish the state code conversion
  switch (state) {
    case "alabama": case "al": return "al, us";
    case "alaska": case "ak": return "ak, us";
    case "arizona": case "az": return "az, us";
    case "arkansas": case "ar": return "ar, us";
    case "california": return "CA";
    case "colorado": return "CO";
    case "connecticut": return "CO";
    case "delaware": return "DE";
    case "district+of+columbia": return "DC";
    case "florida": return "FL";
    case "georgia": return "GA";
    case "hawaii": return "HI";
    case "idaho": return "ID";
    case "illinois": return "IL";
    case "indiana": return "IN";
    case "iowa": return "IA";
    case "kansas": return "KS";
    case "kentucky": return "KY";
    case "lousiana": return "LA";
    case "maine": case "me": return "me,us";
    case "maryland": return "MD";
    case "massachusetts": return "MA";
    case "michigan": return "MI";
    case "minnesota": return "MN";
    case "mississippi": return "MS";
    case "missouri": return "MO";
    case "montana": return "MT";
    case "nebraska": return "NE";
    case "nevada": return "NV";
    case "new+hampshire": return "NH";
    case "new+jersey": return "NJ";
    case "new+mexico": return "NM";
    case "new+york": return "NY";
    case "north+carolina": return "NC";
    case "north+dakota": return "ND";
    case "ohio": return "OH";
    case "oklahoma": return "OK";
    case "oregon": return "or, us";
    case "pennsylvania": return "PA";
    case "puerto+rico": return "PR";
    case "rhode+island": return "RI";
    case "south+carolina": return "SC";
    case "south+dakota": return "SD";
    case "tennessee": return "TN";
    case "texas": return "TX";
    case "utah": return "UT";
    case "vermont": return "VT";
    case "virginia": return "VA";
    case "virgin+islands": return "VI";
    case "washington": return "WA";
    case "west+virginia": return "WV";
    case "winsconsin": return "WI";
    case "wyoming": return "WY";
    default: return state;
  }
}

function convertStateCode(code) {
  switch (code) {
    case "al": return "Alabama";
    case "ak": return "Alaska";
    case "az": return "Arizona";
    case "ar": return "Arkansas";
    case "ca": return "California";
    case "co": return "Colorado";
    case "ct": return "Connecticut";
    case "de": return "Delaware";
    case "dc": return "District of Columbia";
    case "fl": return "Florida";
    case "ga": return "Georgia";
    case "hi": return "Hawaii";
    case "id": return "Idaho";
    case "il": return "Illinois";
    case "in": return "Indiana";
    case "ia": return "Iowa";
    case "ks": return "Kansas";
    case "ky": return "Kentucky";
    case "la": return "Lousiana";
    case "me": return "Maine";
    case "md": return "Maryland";
    case "ma": return "Massachusetts";
    case "mi": return "Michigan";
    case "mn": return "Minnesota";
    case "ms": return "Mississippi";
    case "mo": return "Missouri";
    case "mt": return "Montana";
    case "ne": return "Nebraska";
    case "nv": return "Nevada";
    case "nh": return "New Hampshire";
    case "nj": return "New Jersey";
    case "nm": return "New Mexico";
    case "ny": return "New York";
    case "nc": return "North Carolina";
    case "nd": return "North Dakota";
    case "oh": return "Ohio";
    case "ok": return "Oklahoma";
    case "or": return "Oregon";
    case "pa": return "Pennsylvania";
    case "pr": return "Puerto Rico";
    case "ri": return "Rhode Island";
    case "sc": return "South Carolina";
    case "sd": return "South Dakota";
    case "tn": return "Tennessee";
    case "tx": return "Texas";
    case "ut": return "Utah";
    case "vt": return "Vermont";
    case "va": return "Virginia";
    case "vi": return "Virgin Islands";
    case "wa": return "Washington";
    case "wv": return "West Virginia";
    case "wi": return "Wisconsin";
    case "wy": return "Wyoming";
    default: return "";
  }
}

function getSimpleAPI(cityString) {
  const stateString = cityString.split(",");
  if (stateString.length < 2) {
    return `http://api.openweathermap.org/data/2.5/weather?q=${cityString}&APPID=7b58a8dc115b1a34f3bcde976a724019`;
  }
  const city = stateString[0];
  if (stateString[1].length >= 2) {
    stateString[1] = convertStateInput(stateString[1]);
  }
  return `http://api.openweathermap.org/data/2.5/weather?q=${city},${stateString[1]}&APPID=7b58a8dc115b1a34f3bcde976a724019`;
}

function getForecastAPI(coords) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=${["minutely"]}&APPID=7b58a8dc115b1a34f3bcde976a724019`;
}

async function getCoords(searchValue) {
  const response = await fetch(getSimpleAPI(searchValue), { mode: "cors" });
  const data = await response.json();
  const { coord } = data;
  coord.name = data.name; // city name
  coord.country = data.sys.country;
  coord.state = convertStateCode(searchValue.split(",")[1]);
  console.log(coord);
  return coord;
}

async function getDetailedWeather(coords) {
  const response = await fetch(getForecastAPI(coords), { mode: "cors" });
  const data = response.json();
  return data;
}

export { getCoords, getDetailedWeather, getInputValue };
