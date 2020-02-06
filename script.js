
//Call queries with text stored on each button for previous cities
let previousCities = [];

//If there is data in the local storage the previousCities is set equal to that storage, if not
//the page will default to search for weather in Turlock, Ca
if (localStorage.getItem('prevCities') !== null) {
    previousCities = JSON.parse(localStorage.getItem('prevCities'));
    getWeather(previousCities[previousCities.length-1]);
} else {
    getWeather('Turlock');
}

//This is the main function that makes the requests for the current weather, forecast, and uv index
//This also calls the update buttons function to set the previous cities buttons.
//After each request the sections are loaded with update functions.
function getWeather(location) {
    let units = 'imperial'
    //makes  three requests
    //One to current Weather
    let currentQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=" + units + "&appid=bf5febefea936c9144ec3f7829565d5f";
    
    
    $.ajax({
        url: currentQuery,
        method: "GET"
    }).then(function(response) {        

        //Updates Previous City List
        updateButtons(previousCities, response);
        //Adds the current preciousCities array to local storage
        localStorage.setItem('prevCities', JSON.stringify(previousCities));
        
        //Displays the current weather
        updateCurrentWeather(response);

        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        
        let uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=166a433c57516f51dfab1f7edaed8413";
        $.ajax({
            url: uvQuery,
            method: "GET"
        }).then(function(response) {
            updateUV(response);
        })

    });

    //One to forecast
    let forecastQuery = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + location + '&mode=json&units=imperial&cnt=6&appid=166a433c57516f51dfab1f7edaed8413';

    $.ajax({
        url: forecastQuery,
        method: "GET"
    }).then(function(response) {
    
          
            updateForecast(response);
        
    });
}


//This handles the calling of previous cities to be searched as well as
//the removing of previous cities
$('#prev-cities-list').on("click", function(event) {
    
    if(event.target.matches('button')) {
        //this accounts for the times symbol as the last character in the button
        let city = event.target.textContent.substr(0, event.target.textContent.length - 1);
        
        getWeather(city);
    } else if(event.target.matches('span')) {
        let city = event.target.parentElement.textContent.substr(0, event.target.parentElement.textContent.length - 1);
        
        previousCities = removeCity(previousCities, city);
       
        
        if (previousCities.length < 1) {
            $('#prev-cities-list').html("");
        } else {
            getWeather(previousCities[0]);
        }
    }
})

//Calls the getWeather function which updates the page with the user inputted location and 
//clears the user input field
$('#search-form').on("submit", function(event) {
    event.preventDefault();

    let location = $('#search-input').val().trim();

    getWeather(location);
    $('#search-input').val("");

})

//Formats and displays the 5 day forecast
function updateForecast(Obj) {
    $('#forecast-list').html("");
    let date;
    let icon;
    let temp;
    let humidity;
    for (let i=1; i < 6; i++) {
        
        date = formatDate(new Date(Obj.list[i].dt*1000));
        date = date.substr(1,date.length-2);
        icon = displayIcon(Obj.list[i].weather[0].main, 'forecast');
        temp = Obj.list[i].temp.max;
        humidity = Obj.list[i].humidity;
        
        let currentDay = $('<div>');
        currentDay.addClass('forecast-day');
        currentDay.append($(`<h3>${date}</h3>`));
        currentDay.append(icon);
        currentDay.append($(`
            <p>Temp: ${temp}&degF</p>
            <p>Humidity: ${humidity}%</p>
        `));
        
        $('#forecast-list').append(currentDay);
        
    }
    
}

//Displays the previous cities buttons based on the contents of the previous Cities array
function updateButtons(Arr, Obj) {
    
    Arr.push(Obj.name);
    $('#prev-cities-list').html("");
    
    Arr = removeDuplicates(Arr);
    previousCities = Arr;
    
    
    if (Arr.length > 8) {
        Arr.shift();
    }
    for (let i = 0; i < Arr.length; i++) {
        let currentButton = $(`<button class="prev-city">${Arr[i]}<span class="exit">&times;</span></button>`);
        $('#prev-cities-list').prepend(currentButton);
    }
}

//Takes in response from current weather query and appends information to the current weather div
function updateCurrentWeather(Obj) {
    $('#current-weather').empty();
    
    let current = $(
        `<h2 id="city-name">${Obj.name}, ${Obj.sys.country} ${formatDate(new Date())}   </h2>
        <p>Temperature: ${Obj.main.temp}&degF</p>
        <p>Humidity: ${Obj.main.humidity}%</p>
        <p>Wind Speed: ${Obj.wind.speed} MPH</p>`
    )

    $('#current-weather').append(current);

    //This adds the icon within the h1 element
    $('#city-name').append(displayIcon(Obj.weather[0].main));

}

//Takes in response from uv query and displays to current weather
function updateUV(Obj) {
    let uvIndex = Obj.value;
    let color = "#00d800";
    if (uvIndex < 3) {
        color = '#00d800';
    } else if (uvIndex < 6) {
        color = '#ffff00';
    } else if (uvIndex < 8) {
        color = '#ffa500';
    } else if (uvIndex < 11) {
        color = '#eb0000';
    } else {
        color = '#800040';
    }

    $('#current-weather').append(
        $(`<p>UV Index: <span id="uv" style="background: ${color}">${uvIndex}</span></p>`)
    );
}

//takes in weather condition and if the icon should be of 
//class icon or forecast and returns a jquery element image.
function displayIcon(condition, type='icon') {
    let icon;
    switch(condition) {
        case 'Clear':
            icon = $('<img src="assets/001-sun.svg">');
            break;
        case 'Rain':
            icon = $('<img src="assets/002-rain.svg">');
            break;
        case 'Clouds':
            icon = $('<img src="assets/005-cloudy-day.svg">');
            break;
        case 'Snow':
            icon =  $('<img src="assets/007-snowing.svg">');
            break
    }
    if(type === 'forecast') {
        icon.addClass('forecast-icon');
    } else {
        icon.addClass('icon');
    }
    return icon;
}

//Takes in the date and formats it as (dd/mm/yyyy)
function formatDate(date) {
    let year;
    let today = "(";
    today += parseInt(date.getMonth()) + 1;
    today += "/";
    today += date.getDate();
    today += "/";
    year = date.getFullYear();
    today += year.toString().substr(2);
    today += ")";
    return today;
}

//removes duplicates from an array
function removeDuplicates(Arr) {
    return [...new Set(Arr)];
}

//removes a specified value from an array
function removeCity(Arr, city) {
    let retArr = [];
    for (let i = 0; i < Arr.length; i++) {
        
        if(!retArr.includes(city) && Arr[i] !== city) {
            
            retArr.push(Arr[i]);
        }
    }
    return retArr;
}