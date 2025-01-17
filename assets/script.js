// global variables ///////////////
let key = 'ed3e4f7fb5693ae16fe198f6f1667519';
let cities = [];


// functions ////////////////////////////

// Search City
function getCity(e) {
    e.preventDefault();
    let city = $("#search-form").val();
    getWeather(city);
    savedCity(city);
}
// Fetch API
function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            getUVI(lat, lon);
            getFiveDay(lat, lon);
        })
};

// UVI rating 
function getUVI(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,daily,alerts&appid=${key}`)
        .then(response => response.json())
        .then(data => {
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

// 5 Day Forecast
function getFiveDay(lat, lon) {
    getUVI(lat, lon);
    let cardContainer = $('#city-container');
    cardContainer.html("");
    let currentDay = $('#day-card');
    currentDay.html("");
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 6; i++) {
                const day = data.daily[i];
                // let date = new Date(day.dt * 1000)
                var currentdate = new Date()
                var datetime = currentdate.toLocaleDateString();
                // + (currentdate.getMonth()+1)  + "/" 
                // + currentdate.getFullYear() + " @ "  
                // + currentdate.getHours() + ":"  
                // + currentdate.getMinutes() + ":" 
                // + currentdate.getSeconds();
                const weatherCard = `
          <div class="card">
            <p>${datetime}</p>
            <p>Temp: ${day.temp.day} °F</p>
            <p>Wind: ${day.wind_speed} mph</p>
            <p>Humidity: ${day.humidity} %</p>
            <p id="uvi">UV Index: ${day.uvi}</p>
          </div>`
                if (i === 0) {
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
    localStorage.setItem('cities', JSON.stringify(cities));;
    historyDiv();
}

function historyDiv(){
    $('.history').empty(); 
    const historyArr = JSON.parse(localStorage.getItem('cities'))
    historyArr.map( pastCity => {
    let container = $('<div>'); 
    let btn = $('<button>')
    btn.text(pastCity)
    btn.on('click', getCity);
    container.append(btn); 
    $('.history').prepend(container);    
    })
      
}

function clearSearch() {
    $("#city-container").empty();
    $("#day-card").empty();
    localStorage.clear(); 
};

//Events ////////////////////////////////

// Search Button
$('#submit').on('click', getCity);
$('#clearSearch').on('click', clearSearch);
