let city;

$.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=bf5febefea936c9144ec3f7829565d5f",
    method: "GET"
  }).then(function(response) {
    city = response;
    console.log(response);
  });