export function scatterPlot() {
const svg = d3.select("#d3-container-4"), 
    margin = {top: 20, right: 50, bottom: 50, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
  d3.csv("./data/travel-and-ppp.csv").then(function(data) {
     
const xValue = function(d) { return +d.travel;},
    xScale = d3.scaleLinear().range([0, width]), 
    xMap = function(d) { return xScale(xValue(d));}; 
  
const yValue = function(d) { return +d.ppp;}, 
    yScale = d3.scaleLinear().range([height, 0]), 
    yMap = function(d) { return yScale(yValue(d));};

  xScale.domain([d3.min(data, xValue)-0.2, d3.max(data, xValue)+.2]);
  yScale.domain([0, d3.max(data, yValue)+10000]);

const cValue = function(d) { return d.region;},
    colors = d3.scaleOrdinal([`#1b79d1`, `#177e89`, `#e0ba3d`, `#942509`, `#5716ab`, `#094074`, `#9c1762`, `#ee6c4d`, `#832232`, `#1d8253`]);
      
const sValue = function(d) { return parseInt(d.region); },
    sizes  = d3.scaleLinear()
            .domain([1.5, d3.max(data, sValue)+4.86])
            .range([1.5, 6.5]);

  g.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")") 
    .call(d3.axisBottom(xScale));

  g.append("text")
    .attr("class", "label")
    .attr("x", width/2)
    .attr("y", height+(margin.bottom*0.8))
    .style("text-anchor", "middle")
    .text("Travel Indicator Score");

  g.append("g")
    .attr("class", "axis y-axis")
    .call(d3.axisLeft(yScale));

  g.append("text") 
    .attr("class", "label")
    .attr("x", 0-(height/2))
    .attr("y", 0-(margin.left*0.8))
    .attr("transform", "rotate(-90)") 
    .style("text-anchor", "middle")
    .text("GDP per Capita");

  g.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {return Math.sqrt(d.ppp/900)})
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return colors(cValue(d)); })

      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)     
               .style("opacity", .8);
          tooltip.html("<b>Country: </b>" + d.entity + "<br/><b>Region: </b>" + d.region + "<br/><br/> " + "<b>Travel Indicator Score: </b>" + d.travel + "<br/><b>GDP per Capita :</b> $" + d.ppp)
               .style("left", (d3.event.pageX + 10) + "px")  
               .style("top", (d3.event.pageY - 28) + "px"); 
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0); 
      });

  const legend = svg.selectAll(".legend")
      .data(colors.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });

  legend.append("rect")
      .attr("x", width - 35)
      .attr("width", 9)
      .attr("height", 9)
      .style("fill", colors)

  legend.append("text")
      .attr("x", width - 20)
      .attr("y", 9)
      .attr("dy", ".15em")
      .style("text-anchor", "start")
      .style("fill", "#f5fbef")
      .text(function(d,i) { return d;})
});
}