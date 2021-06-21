// global variables ///////////////
let key = 'ed3e4f7fb5693ae16fe198f6f1667519';


// functions ////////////////////////////
function init() {
    // check local storage for the key (cities) 
    // if present, dynamically create buttons
    let citiesStorage = localStorage.getItem('cities');
    if (citiesStorage) {
        // loop thru local storage and render buttons with the button label as the city
        cities = JSON.parse(cities)
        console.log(cities);
        renderBtn();
    };

};
// Search City
function getCity(e) {
    e.preventDefault();
    let city = $("#search-form").val();
    getWeather(city);

}
// Fetch API
function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            console.log(lat);
            console.log(lon);
            getUVI(lat, lon);
            getFiveDay(lat,lon);
        })
};

// UVI rating 
function getUVI(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,daily,alerts&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.current.uvi);
            let uviScore = data['current']['uvi'];
            let uvEl = $('#uvi');
            if (uviScore < 2) {
                uvEl.attr('class', 'low');
            }
            else if (uviScore < 5) {
                uvEl.attr('class', 'moderate');
            }
            else if (uviScore < 7) {
                uvEl.attr('class', 'high');
            }
            else if (uviScore < 10) {
                uvEl.attr('class', 'very-high');
            }
            else {
                uvEl.attr('class', 'extreme');
            }
            uvEl.innerHTML = `UV Index: ${uviScore}`;
        });
};

// Current Weather


// 5 Day Forecast
function getFiveDay(lat, lon) {
    let cardContainer = $('#city-container');
    cardContainer.html("");
    let currentDay = $('#day-card');
    currentDay.html("");
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${key}`)
    .then(response => response.json())
    .then(data => {
      console.log("get forecast",data);
      for(let i = 0; i < 6; i++) {
        const day = data.daily[i];
        let date = new Date (day.dt * 1000)        
        const weatherCard = `
          <div class="card">
            <p>${date}</p>
            <p>Temp: ${day.temp.day} °F</p>
            <p>Wind: ${day.wind_speed} mph</p>
            <p>Humidity: ${day.humidity} %</p>
            <p>UV Index:</p>
          </div>`
        if(i === 0) {
            currentDay.append(weatherCard);
        } else {
            cardContainer.append(weatherCard)
        }
      }
    })
  };

// Save City Search
function savedCity(searchCity) {
    if (!cities.includes(searchCity)) {
        cities.push(searchCity);
    }
    localStorage.setItem('city', JSON.stringify(city));
    cityBtn();
    console.log(city);
}

function renderBtn() {
    cityBtns.textContent = '';
    city = city.slice(Math.max(city.length - 5, 0));
    city.forEach(city => {
        let btn = document.createElement('button');
        cityBtn.prepend(btn);
        btn.setAttribute('class', 'btn btn-outline-secondary btn-block');
        btn.setAttribute('data-city', city);

        btn.innerHTML = city;
    })
}

//Events ////////////////////////////////

// Search Button
$('#submit').on('click', getCity);
// click on past city button
