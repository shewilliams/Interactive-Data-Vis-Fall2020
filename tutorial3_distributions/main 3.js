/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

var div = d3.select("body").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;

/**
 * APPLICATION STATE
 * */
let state = {
  data: [],
  selectedRegion: "All",
};

/**
 * LOAD DATA
 * */
d3.csv("./2015.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.economy))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.freedom))
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected region is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedRegion = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", 
        "Australia and New Zealand", 
        "Central and Eastern Europe", 
        "Eastern Asia", 
        "Latin America and Caribbean", 
        "Middle East and Northern Africa", 
        "North America", 
        "Southeastern Asia", 
        "Southern Asia", 
        "Sub-Saharan Africa", 
        "Western Europe"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("GDP per Capita");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Freedom");


  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // filter the data for the selectedRegion
  let filteredData = state.data;
  // if there is a selectedRegion, filter the data before mapping it to our elements
  if (state.selectedRegion !== "All") {
    filteredData = state.data.filter(d => d.region === state.selectedRegion);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.region) // use `d.region` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("stroke", "lightgrey")
          .attr("opacity", 0.5)
          .attr("fill", d => {
            if (d.region === "Australia and New Zealand") return "#708D81";
            else if (d.region === "Central and Eastern Europe") return "#423B0B";
            else if (d.region === "Eastern Asia") return "#F4D58D";
            else if (d.region === "Latin America and Caribbean") return "#1EFFBC";
            else if (d.region === "Middle East and Northern Africa") return "#001427";
            else if (d.region === "North America") return "#9BBDF9";
            else if (d.region === "Southeastern Asia") return "#9067C6";
            else if (d.region === "Southern Asia") return "#2191FB";
            else if (d.region === "Sub-Saharan Africa") return "#F87666";
            else return "#8D0801";
          })
          .attr("r", function(d) {return Math.sqrt(d.reverse)})
          .attr("cy", d => yScale(d.freedom))
          .attr("cx", height) // initial value - to be transitioned
          .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div.html(d.country)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        })
          .call(enter =>
            enter
              .transition() // initialize transition
              .delay(d => 500 * d.economy) // delay on each element
              .duration(500) // duration 500ms
              .attr("cx", d => xScale(d.economy))
          ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition()
            .duration(250)
            .attr("stroke", "black")
            .transition()
            .duration(250)
            .attr("stroke", "lightgrey")
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
            .delay(d => 50 * d.economy)
            .duration(500)
            .attr("cy", width)
            .remove()
        )
    );
}