// URL to earthquake json data
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    -23.3384,-58.3645
  ],
  zoom: 5,

});

// Adding tile layer //Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 10,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

streetmap.addTo(myMap);

// Store API link
var queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

function markerSize(mag) {
  return mag * 30000;
}

function chooseColor(mag) {
  if (mag <= 1) {
      return "green";
  } else if (mag <= 2) {
      return "yellow";
  } else if (mag <= 3) {
      return "orange";
  } else if (mag <= 4) {
      return "red";
  } else if (mag <= 5) {
      return "purple";
  } else {
      return "blue";
  };
}

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
    
// Grab the data with d3
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


// Grab the data with d3
d3.json(queryURL).then(function(response) {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {

    // Set the data location property to a variable
    var location = response[i].location;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup(response[i].descriptor));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}