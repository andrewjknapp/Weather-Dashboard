# Weather-Dashboard

## Purpose
This Weather Dashboard was created to provide the user a convenient way to access the weather forecast at a glance for any city that they wish. The previous cities side bar stores the user's last eight searches to allow them to easily keep track of the weather in multiple locations.

## Documentation
OpenWeatherMap Api was used to gather data on the current weather, the UV index, and the weather forecast for each search. Once these responses were gathered the desired information was extracted and displayed through jquery dynamic updates. Each time the page is updated through a search the previous cities are stored into local storage and are called upon to populate the page on load. 