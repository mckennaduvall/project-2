// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var parseTime = d3.timeParse("%Y%m%d")

  const url = "http://127.0.0.1:5000/getdata"

// Fetch the JSON data and console log it
// d3.json is exactly like requests.get
d3.json(url).then(function(droughtData) {
    console.log(droughtData);

    //console.log(droughtData.Alabama.date)
    //console.log(droughtData.Alabama.dsci)

    // let parseTime = d3.timeParse("%Y%m%d");

    // const keys = Object.keys(data)
    // console.log(keys)

    // const entries = Object.entries(data)

    // for (i in keys) {
    //   states = entries[i]
    //   console.log(states)
    // }

function init () {

  data = {
    x: droughtData['Alabama'].date,
    y: droughtData['Alabama'].dsci,
  type: 'line'
 };
all_data = [data]
  console.log(data)
  Plotly.newPlot("myChart", all_data);
}


// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");

  // Initialize x and y arrays
  var x = [];
  var y = [];

  
    x = droughtData[dataset].date;
    y = droughtData[dataset].dsci ;


  // Note the extra brackets around 'x' and 'y'
  Plotly.restyle("myChart", "x", [x]);
  Plotly.restyle("myChart", "y", [y]);
}

init();

});