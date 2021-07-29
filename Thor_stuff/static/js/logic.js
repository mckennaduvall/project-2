// Creating map object for the United States
var myMap = L.map("map", {
  center: [40.00, -93.00],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap);

function getColor(category) {
  switch(category){
    case "Little to no Drought anywhere":
      return "green"
    case "Abnormal Dryness":
      return "greenyellow"
    case "Moderate Drought":
      return "yellow"
    case "Severe Drought":
      return "orange"
    case "Extreme Drought":
      return "red"
    }
}

var linkServer = "http://127.0.0.1:5000/getdata"
d3.json(linkServer).then(function(data){
  //Function to choose state color using dsci value
  function chooseColor(dsci) {
  if (dsci <= 500 && dsci > 400) {
    return "red"
  }
  else if (dsci <= 400 && dsci > 300) {
    return "orange"
  }
  else if (dsci <= 300 && dsci > 200) {
    return "yellow"
  }
  else if (dsci <= 200 && dsci > 100) {
    return "greenyellow"
  }
  else {
    return "green"
  }
}

//Function to grab data for specified state
function getData(name) {
  var latest = 0
  var dsci = 0
  if (data.hasOwnProperty(name)) {
    for (var i=0; i < data[name].date.length; i++){
      var dateFix = parseInt(data[name].date[i].replace("-",""))
      if ( dateFix > latest){
        latest = dateFix
        dsci = data[name].dsci[i]
      }
    }
  }
  return(dsci)
}

var linkState = "../data/US_States.json"

d3.json(linkState).then(function(dataState) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(dataState, {
    // Style each feature
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color
        fillColor: chooseColor(getData(feature.properties.NAME)),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup(`<h2>${feature.properties.NAME}</h2><hr>DSCI: ${getData(feature.properties.NAME)}`);
    }
  }).addTo(myMap);

  var legend = L.control({position: 'topleft'});
    legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    labels = [`<strong>Drought Severity ${data["California"].date[data["California"].date.length - 1]}</strong>`],
    categories = ["Little to no Drought anywhere","Abnormal Dryness","Moderate Drought","Severe Drought","Extreme Drought"];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push('<li style="background-color: ' + getColor(categories[i]) + '; list-style-type:none">'+categories[i]+'</li>');
        }
        div.innerHTML = labels.join('');
    return div;
    };
    legend.addTo(myMap);
  });
});

