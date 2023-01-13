let history = [];
let lastCity = "";
// api key for weather data
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api key = 5e7c5fd0e653a35e32f8b138e0447fbe
let getWeather = function(city) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5e7c5fd0e653a35e32f8b138e0447fbe&units=imperial";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            } else {
                alert("ERROR: " + response.statusText);
            }

        console.log(apiUrl);
        console.log("test test test");
    })
     // console.log(apiUrl);

     .catch(function(error) {
        alert("Unable to connect to OpenWeatherMap API");
    })
};

// cityName will be the value typed in by the user in the 'Search for a City' form
let submitHandler = function(event) {
    event.preventDefault();
    let cityName = $('#cityname').val();
    if (cityName) {
        getWeather(cityName);
        // clears search input
        $('#cityname').val("");
    } else {
        alert("Error. Please enter a city name.")
    }
};


// Uses JQuery to grab HTML ID's and then append the weatherData retrieved from the API into the HTML
let displayWeather = function(weatherData) {

    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);

    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + " f");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=5e7c5fd0e653a35e32f8b138e0447fbe")
        .then(function(response) {
            response.json().then(function(data) {
                $("#uv-box").text(data.value);
            })
        });

        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=5e7c5fd0e653a35e32f8b138e0447fbe&units=imperial")
        .then(function(response) {
            response.json().then(function(data) {
                // clears previous entires in five-day forecast
                $('#five-day').empty();
                // every 8th value is a new day
                for (i = 7; i <= data.list.length; i += 8) {
                    let fDayCard =`
                    <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + data.list[i].main.temp.toFixed(1) + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                    $('#five-day').append(fDayCard);
                }
            })
    });
    lastCity = weatherData.name;
    saveSearchHistory(weatherData.name);
};