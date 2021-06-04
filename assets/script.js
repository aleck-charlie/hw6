// global variables ///////////////
let key = 'ed3e4f7fb5693ae16fe198f6f1667519';


// functions ////////////////////////////
function init() {
// check local storage for the key (cities) 
// if present, dynamically create buttons
    let citiesStorage = localStorage.getItem('cities');
    if(citiesStorage) {
        // loop thru local storage and render buttons with the button label as the city
        cities = JSON.parse(cities)
        console.log(cities);
        renderCityBtn
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
    getUVI(lat,lon);
    getFiveDay(city);
    })
};

// UVI rating 
function getUVI(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${key}`)
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
})
};

// 5 Day Forecast
function getFiveDay(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
for (let i = 0; i < data.list.length; i+=8) {
    const day = data.list[i];
    let forecastDate = new Date(day.dt * 1000);
    let date = $('#todayDate')
    let options = { date };
    let forecastIcon = 'https://openweathermap.org/img/w/' + day.weather[0].icon + '.png';
    let forecastIconDesc = day.weather[0].description || weather[0].main;
    let fcTemp = day.main.temp;
    let fcWind = day.wind.speed;
    let fcHum = day.humidity;
    let forecastCard = $('#city-container');
    let cardDate = $('<h3>');
    let cardIcon = $('<img>');
    let cardTemp = $('<p>');
    let cardWind = $('<p>');
    let cardHum = $('<p>');

    cardDate.text(forecastDate);
    cardTemp.text(fcTemp);
    cardWind.text(fcWind);
    cardHum.text(fcHum);
    forecastCard.append(cardDate);
    forecastCard.append(cardIcon);
    forecastCard.append(cardTemp);
    forecastCard.append(cardWind);
    forecastCard.append(cardHum);
    cardDate.text(new Intl.DateTimeFormat('en-US', options).format(forecastDate));
    };
})};

// saves cities to local storage
// function submitSave() {

// };

// // renders city buttons for previous searches
// function renderCityBtn() {

// };

//events ////////////////////////////////

//Search Button
$('#submit').on('click',getCity);

// click on past city button
