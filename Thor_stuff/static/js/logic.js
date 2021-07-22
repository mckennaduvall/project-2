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


var linkDrought = "../data/dm_export_20150101_20210721.json"
d3.json(linkDrought).then(function(droughtData) {
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

  function getData(name) {
    var latest = 0
    var dsci = 0
    for (var i=0; i < droughtData.length; i++){
      droughtData[i].DSCI = +droughtData[i].DSCI
      droughtData[i].MapDate = +droughtData[i].MapDate
      if (name == droughtData[i].Name) {
        if (droughtData[i].MapDate > latest) {
          latest = droughtData[i].MapDate
          dsci = droughtData[i].DSCI
        }
      }
    }
    return(dsci)
  }

  var linkState = "../data/US_States.json"

  d3.json(linkState).then(function(dataState) {
    // Creating a geoJSON layer with the retrieved data
    var geoState = L.geoJson(dataState, {
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

    var linkCounty = "../data/US_Counties.json"

    d3.json(linkCounty).then(function(dataCounty) {
      // Creating a geoJSON layer with the retrieved data
      var geoCounties = L.geoJson(dataCounty, {
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
          layer.bindPopup("<h1>" + feature.properties.NAME + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");
        }
      });

      // Create Map overlay dictionary
      var overlayMaps = {
        States: geoState,
        Counties: geoCounties
      }
      L.control.layers(overlayMaps).addTo(myMap);
    });
  });
});


