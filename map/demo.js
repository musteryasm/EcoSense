/**
 * An event listener is added to listen to tap events on the map.
 * Clicking on the map displays an alert box containing the latitude and longitude
 * of the location pressed.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and store in variables
  map.addEventListener("tap", function (evt) {
    var coord = map.screenToGeo(
      evt.currentPointer.viewportX,
      evt.currentPointer.viewportY
    );
    var a = Math.abs(coord.lat.toFixed(4)) + (coord.lat > 0);
    var b = Math.abs(coord.lng.toFixed(4)) + (coord.lng > 0);
    var coordinatesString = "Clicked at " + a + " " + b;
    // displayPopup(coordinatesString);
    console.log("Latitude:", a, "Longitude:", b);

    // Send coordinates to API
    sendCoordinatesToAPI(a, b);
  });
}

function updateAqiContainer(apiResponse, latitude, longitude) {
  const city = null;
  const state = null;
  const country = null;
  const reverseApiUrl = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=658cd74d51799334852690soz37327b`;
  // Set up the request options
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(reverseApiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((result) => {
      // Extract relevant location data
      console.log(result.address);
      const { city, state, country } = result.address;
      console.log(city, state, country);

      // Update location information
      updateLocationInfo(city, state, country);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Get the AQI container element
  const aqiContainer = document.getElementById("aqi-container");

  // Update weather information
  const cityElement = aqiContainer.querySelector(".aqi-info .city");
  const locationElement = aqiContainer.querySelector(".aqi-info .location");
  const temperatureElement = aqiContainer.querySelector(
    ".aqi-info .temperature"
  );

  cityElement.textContent = "City: Chicago, Illinois, United States"; // Replace with actual city name if available in the API
  locationElement.textContent = `Coordinates: ${latitude}° N, ${longitude}° E`; // Update with actual coordinates
  temperatureElement.textContent = `Temperature: ${apiResponse.temperature}°C`; // Replace with actual temperature value from the API

  // Update AQI information
  const aqiValueElement = aqiContainer.querySelector(".aqi-circle .aqi-value");
  const aqiRatingElement = aqiContainer.querySelector(
    ".aqi-circle .aqi-rating"
  );
  const aqiDetailsElement = aqiContainer.querySelector(".rectangle");

  aqiValueElement.textContent = apiResponse.index.value.toFixed(0); // Update with actual AQI value
  aqiRatingElement.textContent = apiResponse.index.qualification; // Update with actual AQI rating

  // Update AQI Details
  const aqiUSDetails = `AQI US: ${apiResponse.index.value.toFixed(0)} (${
    apiResponse.index.index_type
  })`;
  const aqiCNDetails = `AQI CN: ${apiResponse.index.value.toFixed(0)} (${
    apiResponse.index.index_type
  })`;

  aqiDetailsElement.innerHTML = `<p class="aqi-details">AQI Details:</p>
                                 <p>${aqiUSDetails}</p>
                                 <p>${aqiCNDetails}</p>`;

  let pollutantsContainer = document.querySelector(".pollutants");
  if (!pollutantsContainer) {
    pollutantsContainer = document.createElement("div");
    pollutantsContainer.classList.add("pollutants");
    const aqiContainer = document.getElementById("aqi-container");
    aqiContainer.appendChild(pollutantsContainer);
  } else {
    pollutantsContainer.innerHTML = ""; // Clear previous pollutants
  }
  updatePollutants(apiResponse.pollutants, pollutantsContainer);
}

function updateLocationInfo(city, state, country) {
  const cityElement = document.querySelector(".aqi-info .city");
  const location = `${city}, ${state}, ${country}`;
  cityElement.textContent = `City: ${location}`;
}

function updatePollutants(pollutants, container) {
  for (const pollutant in pollutants) {
    const { name, value } = pollutants[pollutant];
    const pollutantElement = document.createElement('p');
    pollutantElement.textContent = `${name}: ${value} µg/m³`;
    container.appendChild(pollutantElement);
  }
}

function sendCoordinatesToAPI(latitude, longitude) {
  // Construct the API URL with the provided latitude and longitude
  const apiUrl = `https://environment-api.onrender.com/get_current_air_data?lat=${latitude}&lng=${longitude}`;

  // Set up the request options
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  // Send the API request
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json(); // Assuming the response is in JSON format
    })
    .then((result) => {
      // Handle the API response data here
      updateAqiContainer(result, latitude, longitude);
      console.log("Response:", result);
      // You can perform further actions with the response data as needed
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors that may occur during the fetch request
    });
  console.log("OUT");
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: "eLrKTK9d6Tm8OtM-0ee2-Gd1TQjuA0fm-yc7HM2GNpoY",
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map
var map = new H.Map(
  document.getElementById("map"),
  defaultLayers.vector.normal.map,
  {
    center: { lat: 30.94625288456589, lng: -54.10861860580418 },
    zoom: 1,
    pixelRatio: window.devicePixelRatio || 1,
  }
);
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create custom logging facilities
var logContainer = document.createElement("ul");
logContainer.className = "log";
logContainer.innerHTML = '<li class="log-entry">Try clicking on the map</li>';
map.getElement().appendChild(logContainer);

// Helper for logging events
function logEvent(str) {
  var entry = document.createElement("li");
  entry.className = "log-entry";
  entry.textContent = str;
  logContainer.insertBefore(entry, logContainer.firstChild);
}

setUpClickListener(map);
