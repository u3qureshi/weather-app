const apiKey = "9ee87f434ac49eb6d0469172d235ae8e";
const conversionSwitch = document.querySelector('.conversion-switch');
const conversionSwitchLabel = document.querySelector('.conversion-switch-label');
const locationButton = document.querySelector('.location-search-icon');
const searchButton = document.querySelector('.search-button');
let currentCityName = '';
//SetInterval for clock function every 1000ms
window.setInterval(displayCurrentTime, 1000);

let weather = {
    fetchWeatherWithCity: (cityName, unit) => {
        fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${apiKey}`
            ).then((response) => response.json())
            .then((data) => {
                if (unit == 'metric') {
                    weather.displayWeatherC(data);
                } else {
                    weather.displayWeatherF(data);
                }
            });
    },

    fetchWeatherWithPosition: (lat, lon, unit) => {
        fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
            ).then((response) => response.json())
            .then((data) => {
                if (unit == 'metric') {
                    weather.displayWeatherC(data);
                } else {
                    weather.displayWeatherF(data);
                }
            });
    },

    /** Displays weather in Celsius */
    displayWeatherC: (weatherObj) => {
        //Destructuring assignment to gather necessary variables from the data from the weather object
        const { name } = weatherObj;
        currentCityName = name;
        const { icon, main, description } = weatherObj.weather[0];
        const { temp, feels_like, humidity } = weatherObj.main;
        const { speed } = weatherObj.wind;
        const { country } = weatherObj.sys;

        const cityText = document.querySelector('.city');
        const weatherIcon = document.querySelector('.weather-icon');
        const temperatureText = document.querySelector('.temperature');
        const descriptionText = document.querySelector('.weather-description');
        const humidityText = document.querySelector('.weather-humidity');
        const feelsLikeText = document.querySelector('.weather-feels-like');
        const windText = document.querySelector('.weather-wind-speed');

        selectBackground(main);
        weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        cityText.innerText = ` Weather in ${name}, ${country}`;
        temperatureText.innerText = `${Math.round(temp)}°C`;
        descriptionText.innerText = capitalizeFirstLetter(description);
        humidityText.innerText = `Humidity: ${humidity}%`;
        feelsLikeText.innerText = `Feels like: ${Math.round(feels_like)}°C`;
        windText.innerText = `Wind Speed: ${Math.round(speed)} m/s`;
    },

    /** Displays weather in Fahrenheit */
    displayWeatherF: (weatherObj) => {
        //Destructuring assignment to gather necessary variables from the data from the weather object
        const { name } = weatherObj;
        currentCityName = name;
        const { icon, main, description } = weatherObj.weather[0];
        const { temp, feels_like, humidity } = weatherObj.main;
        const { speed } = weatherObj.wind;
        const { country } = weatherObj.sys;

        const cityText = document.querySelector('.city');
        const weatherIcon = document.querySelector('.weather-icon');
        const temperatureText = document.querySelector('.temperature');
        const descriptionText = document.querySelector('.weather-description');
        const humidityText = document.querySelector('.weather-humidity');
        const feelsLikeText = document.querySelector('.weather-feels-like');
        const windText = document.querySelector('.weather-wind-speed');

        selectBackground(main);
        weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        cityText.innerText = ` Weather in ${name}, ${country}`;
        temperatureText.innerText = `${Math.round(temp)}°F`;
        descriptionText.innerText = capitalizeFirstLetter(description);
        humidityText.innerText = `Humidity: ${humidity}%`;
        feelsLikeText.innerText = `Feels like: ${Math.round(feels_like)}°F`;
        windText.innerText = `Wind Speed: ${Math.round(speed)} MPH`;
    },
}

/** Celsiuis to fahrenheit switch */

function switchIsChecked() {

    if (conversionSwitch.checked == true) return true;
    else return false;
}
conversionSwitch.addEventListener('click', e => {
    if (switchIsChecked()) {
        conversionSwitchLabel.innerText = '°F';
        weather.fetchWeatherWithCity(currentCityName, 'imperial');
    } else {
        conversionSwitchLabel.innerText = '°C';
        weather.fetchWeatherWithCity(currentCityName, 'metric');
    }
});

//Conversion functions
function convertToImperial(temp, feels, speed) {
    let fahrenheitTemp = (temp * 9 / 5) + 32;
    let fahrenheitFeels = (feels * 9 / 5) + 32;
    let newSpeed = (speed * 2.23694);

    return { fahrenheitTemp, fahrenheitFeels, newSpeed };
}

function convertToMetric(temp, feels, speed) {
    let celsiusTemp = (temp - 32) * 5 / 9;
    let celsiusFeels = (feels - 32) * 5 / 9;
    let newSpeed = (speed / 2.23694);

    return { celsiusTemp, celsiusFeels, newSpeed };
}

/** Location button */
locationButton.addEventListener('click', e => {
    if (window.navigator.geolocation) { //if browser supports geolocation
        window.navigator.geolocation.getCurrentPosition(successCallback, failureCallback);
    }
})

function successCallback(position) {
    const { latitude, longitude } = position.coords;
    if (switchIsChecked()) {
        weather.fetchWeatherWithPosition(latitude, longitude, 'imperial');
    } else {
        weather.fetchWeatherWithPosition(latitude, longitude, 'metric');
    }
}

function failureCallback() {
    alert('Please allow for geolocation to access this feature.');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/** Search Button */
searchButton.addEventListener('click', searchCity);

function searchCity() {
    const searchInput = document.querySelector('.search-bar-input');
    const cityName = searchInput.value;
    searchInput.value = '';
    if (switchIsChecked()) {
        weather.fetchWeatherWithCity(cityName, 'imperial');
    } else {
        weather.fetchWeatherWithCity(cityName, 'metric');
    }
}

function selectBackground(weatherDescription) {
    const html = document.querySelector('html');
    if (weatherDescription == 'Clouds') {
        html.style.backgroundImage = 'url(../src/images/cloudy-bi.jpg)';
    } else if (weatherDescription == 'Clear') {
        html.style.backgroundImage = 'url(../src/images/sunny-bi.jpg)';
    } else if (weatherDescription == 'Rain') {
        html.style.backgroundImage = 'url(../src/images/morning-rainy-bi.png)';
    } else if (weatherDescription == 'Snow') {
        html.style.backgroundImage = 'url(../src/images/morning-snowy-bi.jpg)';
    } else if (weatherDescription == 'Drizzle') {
        html.style.backgroundImage = 'url(../src/images/morning-drizzle-bi.jpg)';
    } else if (weatherDescription == 'Thunderstorm') {
        html.style.backgroundImage = 'url(../src/images/morning-thunderstormy-bi.jpg)';
    } else {
        html.style.backgroundImage = 'url(../src/images/mist-bi.jpg)';
    }
}

function displayCurrentTime() {
    let date = new Date();
    let today = date.toLocaleTimeString();
    const clockText = document.querySelector('.clock');
    clockText.innerText = today;
}