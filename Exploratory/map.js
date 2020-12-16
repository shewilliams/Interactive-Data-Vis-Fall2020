export function map() {

  const format = d3.format(',');
  
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .text(d => '<b>Country:</b> ' + d.properties.name +
    '<br/><b>GDP per Capita:</b> $' + d.ppp +
      '<br/><b># of departures:</b> ' + d.departures);
  
  const margin = {top: 0, right: 50, bottom: 0, left: -50};
  const width = 560; //- margin.left - margin.right;
  const height = 500;// - margin.top - margin.bottom;
  
  const color = d3.scaleThreshold()
    .domain([
      10000,
      100000,
      500000,
      1000000,
      5000000,
      10000000,
      50000000,
      100000000,
      500000000,
      1500000000
    ])
    .range([
      'rgb(255,255,255)',
      'rgb(241,241,248)', 
      'rgb(225,225, 240)', 
      'rgb(209,212,232)',
      'rgb(194,197,224)',
      'rgb(178,183,216)',
      'rgb(162,169,208)',
      'rgb(148,156,201)',
      'rgb(134,144,194)',
      'rgb(121,133,187)'
    ]);
  
  const svg = d3.select("#map")
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'map');
  
  const projection = d3.geoRobinson()
    .scale(75)
    .rotate([330, 0, 0])
    .translate( [width / 2, height / 3]);
  
  const path = d3.geoPath().projection(projection);
  
  svg.call(tip);
  Promise.all([
    d3.json('./countries.json'),
    d3.csv('./tourists_average.csv')
  ]).then(
    d => ready(null, d[0], d[1])
  );
  
  function ready(error, data, departures) {
    const departuresById = {};
    const pppById = {};
  
    departures.forEach(d => { 
      departuresById[d.id] = +d.departures; 
      pppById[d.id] = +d.ppp;
    });
    data.features.forEach(d => { 
      d.departures = departuresById[d.id];
      d.ppp = pppById[d.id];

    });
  
    svg.append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(data.features)
      .enter().append('path')
        .attr('d', path)
        .style('fill', d => color(departuresById[d.id]))
        .style('stroke', '#f5fbef')
        //.style('opacity', 0.8)
        .style('stroke-width', 0.5)

        .on('mouseover',function(d){
          tip.show(d);
          d3.select(this)
            //.style('opacity', 1)
            .style('stroke-width', 1.5);
        })
        .on('mouseout', function(d){
          tip.hide(d);
          d3.select(this)
            //.style('opacity', 0.8)
            .style('stroke-width',0.5);
        });
  
    svg.append('path')
      .datum(topojson.mesh(data.features, (a, b) => a.id !== b.id))
      .attr('class', 'names')
      .attr('d', path);
  }
  
  }