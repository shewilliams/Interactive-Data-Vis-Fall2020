export function genderRatio() {
d3.csv("./data/gender-ratio.csv", d3.autoType).then(data => {
  console.log(data);

  const width = window.innerWidth * 0.3,
    height = window.innerHeight / 3,
    paddingInner = 0.2,
    margin = { top: 20, bottom: 40, left: 40, right: 40 };

  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.gender))
    .range([margin.left, width - margin.right])
    .paddingInner(paddingInner);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.percentage)])
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3.axisBottom(xScale).ticks(data.length);

  const svg = d3
    .select("#d3-container-1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const rect = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("y", d => yScale(d.percentage))
    .attr("x", d => xScale(d.gender))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.percentage))
    .attr("fill", function(d) {
      if (d.percentage > 50.0) {
        return "rgb(222,158,54)";
      }
      return "rgb(23,126,137)";
    })

  const text = svg
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("class", "label")
    .attr("x", d => xScale(d.gender) + (xScale.bandwidth() / 2))
    .attr("y", d => yScale(d.percentage))
    .text(d => d.percentage+"%")
    .attr("dy", "1.25em");

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);
});

}