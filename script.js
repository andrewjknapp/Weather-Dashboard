let city = 'Los+Angeles';
//bf5febefea936c9144ec3f7829565d5f

let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&mode=json&appid=bf5febefea936c9144ec3f7829565d5f'

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
      city = response;
      console.log(cityDetails(city, 30));
    
  });

  function cityDetails(city, index) {
      let info = "";
      
      info += city.city.name;
      info += " ";
      info += formatDate(city.list[index].dt_txt);
      return info;
  }

  function formatDate(date) {
      let formatted = date.substr(0,date.indexOf(" "));
      formatted = formatted.split('-');

      for (let i = 0; i < formatted.length; i++) {
        if (formatted[i][0] === '0') {
            formatted[i] = formatted[i][1];
        }
      }

      formatted = `(${formatted[2]}/${formatted[1]}/${formatted[0]})` 
      return formatted;
  }




//    url: "https://api.openweathermap.org/data/2.5/weather?q=Los+Angeles&appid=bf5febefea936c9144ec3f7829565d5f",
