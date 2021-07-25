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
d3.json(url).then(function(data) {
    console.log(data);

    let parseTime = d3.timeParse("%Y%m%d");

    const keys = Object.keys(data)
    console.log(keys)

    const entries = Object.entries(data)
    console.log(entries)

    new_date = parseTime(entries.date)

    console.log(new_date)

    
  });

/*     for (i in data.state) {

      var dateRecorded = data.state["date"];

      console.log(dateRecorded) */
    

/* 
    for (var i = 0; i < data.state.length; i++)
    {
      var state = data.state[i];
      var dateRecorded = state.date;
      var dsci = state.dsci;
      console.log(dateRecorded)
      console.log(dsci)
    } */




