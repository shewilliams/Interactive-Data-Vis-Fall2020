export function travelIndicator() {
d3.csv("./data/indicators.csv", d3.autoType).then(data => {
    console.log(data);

    const width = window.innerWidth * 0.9,
      height = window.innerHeight / 3,
      paddingInner = 0.2,
      margin = { top: 20, bottom: 100, left: 20, right: 40 };

    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.indicators))
      .range([margin.left, width - margin.right])
      .paddingInner(paddingInner);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.percentage)])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).ticks(data.indicators);

    const svg = d3
      .select("#d3-container-3")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

      var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);  

    const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", d => yScale(d.percentage))
      .attr("x", d => xScale(d.indicators))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.percentage))
      .attr("fill", "rgb(23,126,137)")

      .on("mouseover", function(d) {
        tooltip.transition()
             .duration(200)   
             .style("opacity", .8); 
        tooltip.html("Number of Countries Where a Woman<br/><b>Can do this: </b>" + d.total + "<br/><b>Cannot do this: </b>" + d.none)
             .style("left", (d3.event.pageX + 10) + "px") 
             .style("top", (d3.event.pageY - 28) + "px"); 
    })
    .on("mouseout", function(d) {
        tooltip.transition()
             .duration(500)
             .style("opacity", 0); 
    });
 
    const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.indicators) + (xScale.bandwidth() / 2))
      .attr("y", d => yScale(d.percentage))
      .text(d => d.percentage+"%")
      .attr("dy", "1.25em");
  
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "center")
        .style("font", "14px")
        .call(wrap, 100)
        .attr("dx", "-.50em")
        .attr("dy", ".15em")
  });
  
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, 
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
  
  function type(d) {
    d.value = +d.value;
    return d;
  }

  
}