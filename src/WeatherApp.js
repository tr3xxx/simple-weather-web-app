import './WheaterApp.css';
import {useEffect, useState} from "react";

function WeatherApp() {

    // open weather api key
    const APIKey = '60bbd59ec7556e88c0f6b5a2080aebaa';

    // declaring state variables
    const [Error, setError] = useState(null); // error message
    const [data, setData] = useState(null); // current weather data

    const [input_city, setInputCity] = useState(''); // input city != output city (output city is the city in the data),
    const [output_city, setOutputCity] = useState(''); //  when input city is changed, output city is not changed until new data is fetched

    const [localTime, setLocalTime] = useState(null); // local time

    const [celsius_temperature, setCelsiusTemperature] = useState(null); // celsius temperature
    const [fahrenheit_temperature, setFahrenheitTemperature] = useState(null); // fahrenheit temperature

    const [max_celsius_temperature, setMaxCelsiusTemperature] = useState(null); // max celsius temperature
    const [min_celsius_temperature, setMinCelsiusTemperature] = useState(null); // min celsius temperature

    const [max_fahrenheit_temperature, setMaxFahrenheitTemperature] = useState(null); // max fahrenheit temperature
    const [min_fahrenheit_temperature, setMinFahrenheitTemperature] = useState(null); // min fahrenheit temperature

    const [feelsLikeInCelcius, setFeelsLikeInCelsius] = useState(null); // feels like in celsius
    const [feelsLikeInFahrenheit, setFeelsLikeInFahrenheit] = useState(null); // feels like in fahrenheit


    const [humidity, setHumidity] = useState(null); // humidity in %

    const [sunriseTime, setSunriseTime] = useState(null); // sunrise time
    const [sunsetTime, setSunsetTime] = useState(null); // sunset time
    const [dayLength, setDayLength] = useState(null); // day length (sunrise - sunset)

    const [lastUpdate, setLastUpdate] = useState(null); // last update of weather data


    const [weather, setWeather] = useState(null); // weather description
    const [icon, setIcon] = useState(null); // weather icon

    const [userlat, setUserlat] = useState(null); // user latitude
    const [userlon, setUserlon] = useState(null); // user longitude

    const [firstLoad, setFirstLoad] = useState(true); // first load of the page

    const [forecastData, setForecastData] = useState(null); // forecast weather data



    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents the page from reloading


        const url = `https://api.openweathermap.org/data/2.5/weather?q=${input_city}&appid=${APIKey}`; // api request for current weather
        // response fields: https://openweathermap.org/api/one-call-3#parameter
        fetch(url)
            .then(function(response) {
                if(!response.ok) {
                    setError(response.statusText); // error message
                    setData(null); // clear data
                    return null;
                }
                return response.json(); // return json

            })
            .then(function(data) {
                getData(data); // get data
            })
    }
    function getLocation() {
        if(firstLoad){ // only run once
            setFirstLoad(false); // set to false so it doesn't run again
            if (navigator.geolocation) { // check if browser supports geolocation
                navigator.geolocation.getCurrentPosition(function(position) { // get user's location
                    const pos = position; // store user's location
                    setUserlat(pos.coords.latitude); // set user's latitude
                    setUserlon(pos.coords.longitude); // set user's longitude

                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${userlat}&lon=${userlon}&appid=${APIKey}`; // get weather data from user's location
                    fetch(url)
                        .then(function(response) {
                            if (!response.ok) { // if response is not ok
                                setData(null); // set data to null
                                return null;
                            }
                            return response.json(); // return response as json
                        })
                        .then(function(data) {
                            getData(data); // get data from response
                        });
                });
            } else {
                // geolocation is not supported by the browser, so nothing happens
            }
        }

    }

    useEffect(() => {
        getLocation(); // on page load get user location and display weather data from that location
    },);


    function getData(data){
        if(data.cod !== 200){ // if the city is not found
            setError(data.message); // set the error message
            setData(null); // set the data to null
            return;
        }
        setData(data); // set the data
        setError(null); // set the error to null


        const timezoneOffset = data.timezone; // Is needed to convert the time from UTC to local time
        const currentDate = new Date();
        setLastUpdate(currentDate.toLocaleString());
        const localTime = new Date(currentDate.getTime() + timezoneOffset * 1000 + currentDate.getTimezoneOffset() * 60 * 1000); // convert UTC to local time
        setLocalTime(localTime.toLocaleTimeString());

        setOutputCity(data.name+" ["+data.sys.country+"]"); // City name + Country code

        const temperatureInCelsius = data.main.temp - 273.15; // API returns temperature in Kelvin, so we need to convert it to Celsius.
        setCelsiusTemperature(Math.round(temperatureInCelsius * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.

        const temperatureInFahrenheit = temperatureInCelsius * 9 / 5 + 32; // Convert Celsius to Fahrenheit.
        setFahrenheitTemperature(Math.round(temperatureInFahrenheit * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.

        const maxTemperatureInCelsius = data.main.temp_max - 273.15; // API returns temperature in Kelvin, so we need to convert it to Celsius.
        setMaxCelsiusTemperature(Math.round(maxTemperatureInCelsius * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.

        const maxTemperatureInFahrenheit = maxTemperatureInCelsius * 9 / 5 + 32; // Convert Celsius to Fahrenheit.
        setMaxFahrenheitTemperature(Math.round(maxTemperatureInFahrenheit * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.

        const minTemperatureInCelsius = data.main.temp_min - 273.15; // API returns temperature in Kelvin, so we need to convert it to Celsius.
        setMinCelsiusTemperature(Math.round(minTemperatureInCelsius * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.

        const minTemperatureInFahrenheit = minTemperatureInCelsius * 9 / 5 + 32; // Convert Celsius to Fahrenheit.
        setMinFahrenheitTemperature(Math.round(minTemperatureInFahrenheit * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.

        const feelsLikeInCelsius = data.main.feels_like - 273.15; // API returns temperature in Kelvin, so we need to convert it to Celsius.
        setFeelsLikeInCelsius(Math.round(feelsLikeInCelsius * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.

        const feelsLikeInFahrenheit = feelsLikeInCelsius * 9 / 5 + 32; // Convert Celsius to Fahrenheit.
        setFeelsLikeInFahrenheit(Math.round(feelsLikeInFahrenheit * 100) / 100); // To avoid displaying too many decimal places we round it to 2 decimal places.


        setHumidity(data.main.humidity); // API returns humidity in percentage.

        const sunriseTime = new Date(data.sys.sunrise * 1000); // API returns time in Unix time, so we need to convert it to milliseconds.
        const sunriseLocalTime = new Date(sunriseTime.getTime() + timezoneOffset * 1000); // Add timezone offset to get local time
        setSunriseTime(sunriseLocalTime.toLocaleTimeString()); // To display time in a readable format we convert it to a string.

        const sunsetTime = new Date(data.sys.sunset * 1000); // API returns time in Unix time, so we need to convert it to milliseconds.
        const sunsetLocalTime = new Date(sunsetTime.getTime() + timezoneOffset * 1000); // Add timezone offset to get local time
        setSunsetTime(sunsetLocalTime.toLocaleTimeString()); // To display time in a readable format we convert it to a string.

        const dayLength = new Date((data.sys.sunset - data.sys.sunrise) * 1000); // API returns time in Unix time, so we need to convert it to milliseconds.
        setDayLength(dayLength.toLocaleTimeString()); // To display time in a readable format we convert it to a string.

        setWeather(data.weather[0].main); // API returns weather description in English.

        setIcon(data.weather[0].icon); // API returns weather icon code with which we can display the icon via their API.

        const url = `https://api.openweathermap.org/data/2.5/forecast?id=${data.id}&appid=${APIKey}`; // first API request returns city ID, so we can use it to get the forecast for the next 5 days.
        fetch(url)
            .then(function(response) {
                if (!response.ok) { // if response is not ok
                    setData(null); // set data to null
                    return null;
                }
                return response.json(); // return response as json

            })
            .then(function(data) { // get data from response
                console.log(url); // for debugging purposes
                setForecastData(data);
            });
    }


    return (
        <div className="App">
            <main>
                <h1 className="title">Simple Weather App   <a href="https://github.com/tr3xxx/simple-weather-app"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub icon" width="32" height="32" /></a></h1>

                <div className="search-box">
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="search-bar" placeholder="Search for a location..." value={input_city} onChange={(event) => setInputCity(event.target.value)} />
                        <br />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                </div>
                {data ? (
                    <div>
                    <div className="card">
                        <div className="card-container">
                            <h2>Current weather</h2>
                                <div className="card-content">
                                    <div className="top-left">
                                        <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="Weather icon" className="weather-icon" /> {/* Display weather icon */}
                                        <div className="description">
                                            <p className="city">{output_city}</p> {/* Display city name */}
                                            <p className="weather">{weather}</p> {/* Display weather description */}
                                            <p className="local-time">Local Time: {localTime}</p> {/* Display local time */}
                                        </div>
                                    </div>
                                    <div className="top-right">
                                        <p className="temperature">{celsius_temperature}°C/{fahrenheit_temperature}°F</p> {/* Display temperature in Celsius and Fahrenheit */}
                                        <p className="temperature-info">Minimum: {min_celsius_temperature}°C/{min_fahrenheit_temperature}°F</p> {/* Display minimum temperature in Celsius and Fahrenheit */}
                                        <p className="temperature-info">Maximum: {max_celsius_temperature}°C/{max_fahrenheit_temperature}°F</p> {/* Display maximum temperature in Celsius and Fahrenheit */}
                                        <p className="temperature-info">Feels like: {feelsLikeInCelcius}°C/{feelsLikeInFahrenheit}°F</p> {/* Display temperature that it feels like in Celsius and Fahrenheit */}
                                    </div>
                                    <div className="bottom-left">
                                        <div className="sun">
                                            <p>Sunrise: {sunriseTime}</p> {/* Display sunrise time */}
                                            <p>Sunset: {sunsetTime}</p> {/* Display sunset time */}
                                            <p>Day Length: {dayLength}</p> {/* Display day length */}
                                        </div>

                                    </div>
                                    <div className="bottom-right">
                                        <p className="humidity">Humidity: {humidity}%</p> {/* Display humidity */}
                                    </div>
                                </div>
                            <p className="last-updated">Last Updated: {lastUpdate}</p> {/* Display last update time */}
                        </div>

                    </div>

                    </div>
                ) : null}
                {forecastData ? (
                    <div>
                        <h2>5-Day Forecast</h2>
                        <div className="forecast-container">

                            {forecastData.list.map((forecast, index) => { // map through forecast data
                                if (index % 8 === 0) { // only display data for every 8th item in the array (every 3 items is a new day)
                                    let forecastTemp = forecast.main.temp - 273.15; // API returns temperature in Kelvin, so we need to convert it to Celsius.
                                    let forecastTempC = Math.round(forecastTemp * 100) / 100; // To avoid displaying too many decimal places we round it to 2 decimal places.
                                    let forecastTempF = forecastTempC * 9 / 5 + 32; // Convert Celsius to Fahrenheit.
                                    forecastTempF = Math.round(forecastTempF * 100) / 100; // To avoid displaying too many decimal places we round it to 2 decimal places.
                                   return <div className="forecast-card">
                                        <div className="forecast-top">
                                            <p className="forecast-date">{forecast.dt_txt.replace("12:00:00","")}</p> {/* API returns date and time, so we need to remove the time */}
                                            <img src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`} alt="Weather icon" className="forecast-icon" /> {/* API returns weather icon code with which we can display the icon via their API. */}
                                            <p>{output_city}</p> {/* Display city name */}
                                            <p>{forecastTempC}°C/{forecastTempF}°F</p> {/* Display temperature in Celsius and Fahrenheit */}
                                        </div>
                                    </div>
                                }
                            })}
                        </div>
                    </div>
                    ) : null}
                {Error ? (
                   <div className="error">
                        <p>{Error}</p> {/* Display error message */}
                    </div>
                ) : null}
                <p>Copyright © Leon Burghardt, 2020-2022. All Rights reserved</p> {/* Copyright stuff */}

            </main>
        </div>
    );
}

export default WeatherApp;
