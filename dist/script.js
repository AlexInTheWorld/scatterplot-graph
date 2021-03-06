// Scatter plot chart based on the FCC assignment: Visualize Data with a Scatterplot Graph

var width = 1000,
graphHeight = 300,
headingHeight = 100,
padding = 50,
title = "Doping in Professional Bicycle Racing",
fsize = 30;
var totalHeight = headingHeight + graphHeight + padding * 2;

var tooltip = d3.select("body").append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);

const svgGraph = d3.select("body").append("div").
style("height", totalHeight + "px").
attr("class", "frame").
style("width", width + "px").
style("background-color", "steelblue");

svgGraph.append("div").
attr("class", "inner").
style("text-align", "center").
style("margin", 0).
style("height", headingHeight + "px").
style("background-color", "#96ed8c").
append("div").
attr("id", "title").
style("height", "50%").
append("text").
text(title).
style("font-size", fsize + "px").
style("color", "#000");
svgGraph.select(".inner").
append("div").
style("height", "50%").
append("text").
text("35 Fastest times up Alpe d'Huez").
style("font-size", fsize / 1.5 + "px").
style("color", "black");

svgGraph.append("svg").
style("width", width + "px").
style("height", graphHeight + padding * 2 + "px").
append("text").
text("time (min)").
attr("id", "y-label").
attr("transform", "translate(" + padding / 1.25 + "," + padding * 3 + ")rotate(-90)");
// Append a self-made legend for doping and non-doping cases using div elements         
svgGraph.append("div").
style("position", "absolute").
attr("id", "legend").
style("height", "100px").
style("width", "250px").
style("left", width - padding * 5 + "px").
style("top", headingHeight + graphHeight / 4 + "px").
style("background-color", "navyblue").
style("border-style", "solid").
style("border-color", "blue").
style("border-width", "1px 1px 1px 10px").
style("border-radius", "5%").
append("div").
style("margin-left", "5px").
attr("id", "first-line").
style("height", "50%").
style("position", "relative").
style("display", "flex").
style("align-items", "center").
append("div").
style("height", "70%").
style("width", "8%").
style("float", "left").
style("background-color", "red");

svgGraph.select("#legend").
append("div").
attr("id", "second-line").
style("height", "50%").
style("position", "relative").
style("display", "flex").
style("align-items", "center").
append("div").
style("margin-left", "5px").
style("height", "70%").
style("width", "8%").
style("float", "left").
style("background-color", "green");

svgGraph.select("#first-line").
append("p").
style("position", "relative").
text("Riders with doping allegations").
style("left", "5%");
svgGraph.select("#second-line").
append("p").
style("position", "relative").
text("No doping allegations").
style("left", "5%");

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function (error, data) {
  if (error) throw error;
  var dataset = [];
  var years = [];
  var time = [];
  var parseTime = d3.timeParse("%M:%S");
  data.forEach(function (obj) {
    dataset.push(obj.Time);
    years.push(obj.Year);
    let parsedTime = obj.Time.split(":");
    time.push(new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });

  var yScale = d3.scaleTime().
  domain(d3.extent(time)).
  range([padding, graphHeight + padding]);

  var xScale = d3.scaleLinear().
  domain([d3.min(years) - 1, d3.max(years) + 1]).
  range([padding * 2, width - padding * 2]);

  var xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format("d")).
  tickSize(12);

  d3.select("svg").append("g").
  attr("transform", `translate(0, ${graphHeight + padding})`).
  attr("id", "x-axis").
  call(xAxis);
  var timeFormat = d3.timeFormat("%M:%S");
  var yAxis = d3.axisLeft(yScale).
  tickFormat(timeFormat).
  ticks(d3.timeSecond.filter(function (d) {
    return d.getSeconds() % 30 === 0;
  }));

  d3.select("svg").append("g").
  attr("transform", `translate(${padding * 2}, 0)`).
  attr("id", "y-axis").
  call(yAxis);

  d3.select("svg").selectAll("circle").
  data(time).
  enter().
  append("circle").
  attr("cx", function (d, i) {
    return xScale(years[i]);
  }).
  attr("cy", function (d) {
    return yScale(d);
  }).
  attr("r", 5).
  style("fill", function (d, i) {
    return data[i].Doping !== "" ? "red" : "green";
  }).
  attr("stroke", "black").
  attr("class", "dot").
  attr("data-xvalue", function (d, i) {
    return years[i];
  }).
  attr("data-yvalue", function (d, i) {
    return d;
  }).
  on("mouseover", function (d, i) {
    tooltip.style("opacity", 0.8);
    tooltip.attr("data-year", data[i].Year);
    tooltip.html(data[i].Name + ": " + data[i].Nationality + "<br/>" +
    "Year: " + years[i] + ", Time: " + dataset[i] + (
    data[i].Doping ? "<br/><br/>" + data[i].Doping : "")).
    style("left", d3.event.pageX + 10 + "px").
    style("top", d3.event.pageY - 28 + "px");
  }).
  on("mouseout", function (d, i) {
    tooltip.style("opacity", 0);
  });
});