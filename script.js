
//Call queries with text stored on each button for previous cities

$('#search-form').on("submit", function(event) {
    event.preventDefault();
    let location = $('#search-input').val().trim();
    let units = 'imperial'

    //make three requests
    //One to current Weather
    let currentQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=" + units + "&appid=bf5febefea936c9144ec3f7829565d5f";
    
    
    $.ajax({
        url: currentQuery,
        method: "GET"
    }).then(function(response) {

        updateCurrentWeather(response);

        let latitude = response.coord.lat;
        let longitude = response.coord.lon;

        console.log(latitude + " " + longitude);

        let uvQuery = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=166a433c57516f51dfab1f7edaed8413";
        $.ajax({
            url: uvQuery,
            method: "GET"
        }).then(function(response) {
            updateUV(response);
        })

        console.log(response);
    });

    //One to forecast
    let forecastQuery = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&mode=json&appid=bf5febefea936c9144ec3f7829565d5f';

    $.ajax({
        url: forecastQuery,
        method: "GET"
      }).then(function(response) {
    
          
        
      });

    //One for UV Index
    let uvQuery = "http://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=166a433c57516f51dfab1f7edaed8413"

})

//"166a433c57516f51dfab1f7edaed8413";


//Takes in response from current weather query and appends information to the current weather div
function updateCurrentWeather(Obj) {
    $('#current-weather').empty();
    console.log("Hello");
    let current = $(
        `<h2 id="city-name">${Obj.name} ${getCurrentDate()}   </h2>
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

function getCurrentDate() {
    let date = new Date();
    let today = "(";
    today += parseInt(date.getMonth()) + 1;
    today += "/";
    today += date.getDate();
    today += "/";
    today += date.getFullYear();
    today += ")";
    return today;
}







































// let city = 'Los+Angeles';
// //bf5febefea936c9144ec3f7829565d5f

// let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&mode=json&appid=bf5febefea936c9144ec3f7829565d5f'

// $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function(response) {
//       city = response;
//       console.log(cityDetails(city, 30));
    
//   });

//   function cityDetails(city, index) {
//       let info = "";
      
//       info += city.city.name;
//       info += " ";
//       info += formatDate(city.list[index].dt_txt);
//       return info;
//   }

//   function formatDate(date) {
//       let formatted = date.substr(0,date.indexOf(" "));
//       formatted = formatted.split('-');

//       for (let i = 0; i < formatted.length; i++) {
//         if (formatted[i][0] === '0') {
//             formatted[i] = formatted[i][1];
//         }
//       }

//       formatted = `(${formatted[2]}/${formatted[1]}/${formatted[0]})` 
//       return formatted;
//   }




