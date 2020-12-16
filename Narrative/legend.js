export function legend() {
    const colorScale = d3.scaleSequential(d3.interpolateRgb("rgb(222,158,54)","rgb(23,126,137)"))
    .domain([0, 1]);
  
  continuous("#legend", colorScale);
  
  function continuous(selector_id, colorscale) {
    const legendheight = 175,
        legendwidth = 70,
        margin = {top: 10, right: 60, bottom: 10, left: 2};
  
    const canvas = d3.select(selector_id)
      .style("height", legendheight + "px")
      .style("width", legendwidth + "px")
      .style("position", "relative")
      .append("canvas")
      .attr("height", legendheight - margin.top - margin.bottom)
      .attr("width", 1)
      .style("height", (legendheight - margin.top - margin.bottom) + "px")
      .style("width", (legendwidth - margin.left - margin.right) + "px")
      .style("border", "1px solid #f5fbef")
      .style("position", "absolute")
      .style("top", (margin.top) + "px")
      .style("left", (margin.left) + "px")
      .node();
  
    const ctx = canvas.getContext("2d");
  
    const legendscale = d3.scaleLinear()
      .range([1, legendheight - margin.top - margin.bottom])
      .domain(colorscale.domain());
  
    var image = ctx.createImageData(1, legendheight);
    d3.range(legendheight).forEach(function(i) {
      var c = d3.rgb(colorscale(legendscale.invert(i)));
      image.data[4*i] = c.r;
      image.data[4*i + 1] = c.g;
      image.data[4*i + 2] = c.b;
      image.data[4*i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);
  
    var legendaxis = d3.axisRight()
      .scale(legendscale)
      .tickSize(6)
      .ticks(8);
  
    var svg = d3.select(selector_id)
      .append("svg")
      .attr("height", (legendheight) + "px")
      .attr("width", (legendwidth) + "px")
      .style("position", "absolute")
      .style("left", "0px")
      .style("top", "0px")
  
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
      .call(legendaxis);
  };
  }