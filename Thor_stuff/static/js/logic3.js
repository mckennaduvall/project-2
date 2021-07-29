// Creating map object
var myMap = L.map("map", {
    center: [36.778259, -119.417931],
    zoom: 6
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


 var cLink = "http://127.0.0.1:5000/getCountyData";

  function chooseColor(consecutiveWeeks) {
    if (consecutiveWeeks < 50 && consecutiveWeeks > 40) {
        return "blue"
    } else if (consecutiveWeeks > 50 && consecutiveWeeks < 75) {
        return "purple"
    } else if (consecutiveWeeks > 75) {
            return "#a52a2a"
    } else if (consecutiveWeeks < 38) {
        return "green"
    } else {
        return "red"
    }
  }

console.log(cLink)

function mapCounty(county) {
    L.geoJson(county, {
        // Style each feature (in this case a neighborhood)
        style: function(feature) {
            return {
            color: "white",
            // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
            fillColor: chooseColor(feature.properties.consecutiveWeeks),
            fillOpacity: 0.5,
            weight: 1.5
            };
        },
        // Called on each feature
        onEachFeature: function(feature, layer) {
            // Set mouse events to change map styling
            console.log(feature)
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
            layer.bindPopup("<h1>" + feature.properties.county + "</h1> <hr> <h2>Weeks: " + feature.properties.consecutiveWeeks + "</h2>");

        }
    }).addTo(myMap);

};

d3.json(cLink).then(function(data) {
    // console.log("raw data", data)
    const cleanedData = data.filter(dataPoint => dataPoint.geometry.coordinates[0].length > 50)
    // console.log("cleaned data", cleanedData)
    cleanedData.forEach(county => mapCounty(county))
});