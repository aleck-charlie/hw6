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

function getCity(e) {
    e.preventDefault(); 
    let city = $("#search-form").val(); 
    getWeather(city);
}

    // getWeather -- all code goes here 
function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`)
    .then(response => response.json())
    .then(data => {
    // console.log(data);

    let lat = data.coord.lat;
    let lon = data.coord.lon;
    console.log(lat);
    console.log(lon);
    getUVI(lat,lon);
    })
};


// get UVI and create color button based on rating
function getUVI(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${key}`)
    .then(response => response.json())
    .then(data => {
    console.log(data.current.uvi);
})};

// get 5 day forecast
function getFiveDay() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`)
    .then(response => response.json())
    .then(data => {
    console.log(data)

})};

// saves cities to local storage
// function submitSave() {

// };

// // renders city buttons for previous searches
// function renderCityBtn() {

// };


//events ////////////////////////////////

//search button click -- call the api

$('#submit').on('click',getCity);
// click on past city button
