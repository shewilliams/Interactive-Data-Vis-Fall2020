export function choropleth() {

const format = d3.format(',');

const tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .text(d => '<b>Country:</b> ' + d.properties.name +
  '<br/><b>GDP per Capita:</b> $' + d.ppp +
    '<br/><b>Travel Score:</b> ' + d.travel +
    '<br/><br/><b>Apply for a Passport:</b> ' + d.passport +
    '<br/><b>Choose Where to Live:</b> ' + d.wheretolive +
    '<br/><b>Open a Bank Account:</b> ' + d.bankaccount +
    '<br/><b>Sign a Contract:</b> ' + d.contract +
    '<br/><b>Travel Outside of Home:</b> ' + d.outsidehome +
    '<br/><b>Travel Outside of Country:</b> ' + d.outsidecountry);

const margin = {top: 0, right: 50, bottom: 0, left: -360};
const width = 360 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const color = d3.scaleThreshold()
  .domain([
    0, .33, .5, .83, 1])
  .range([
    'rgb(245,251,239)',
    'rgb(222,158,54)',
    'rgb(185,152,71)', 
    'rgb(102,139,104)',
    'rgb(60,132,121)',
    'rgb(23,126,137)'
  ]);

const svg = d3.select("#d3-container-2")
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('class', 'map');

const projection = d3.geoRobinson()
  .scale(125)
  .rotate([335, 0, 0])
  .translate( [width / 2, height / 3]);

const path = d3.geoPath().projection(projection);

svg.call(tip);
Promise.all([
	d3.json('./data/countries.json'),
  d3.csv('./data/travel-and-ppp.csv')
]).then(
  d => ready(null, d[0], d[1])
);

function ready(error, data, travel) {
  const travelById = {};
  const pppById = {};
  const passportById = {};
  const wheretoliveById = {};
  const bankaccountById = {};
  const contractById = {};
  const outsidehomeById = {};
  const outsidecountryById = {};

  travel.forEach(d => { 
    travelById[d.id] = +d.travel; 
    pppById[d.id] = +d.ppp;
    passportById[d.id] = +d.passport;
    wheretoliveById[d.id] = +d.wheretolive;
    bankaccountById[d.id] = +d.bankaccount;
    contractById[d.id] = +d.contract;
    outsidehomeById[d.id] = +d.outsidehome;
    outsidecountryById[d.id] = +d.outsidecountry;
  });
  data.features.forEach(d => { 
    d.travel = travelById[d.id];
    d.ppp = pppById[d.id];
    d.passport = passportById[d.id]
    d.wheretolive = wheretoliveById[d.id];
    d.bankaccount = bankaccountById[d.id];
    d.contract = contractById[d.id];
    d.outsidehome = outsidehomeById[d.id];
    d.outsidecountry = outsidecountryById[d.id];
  });

  svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(data.features)
    .enter().append('path')
      .attr('d', path)
      .style('fill', d => color(travelById[d.id]))
      .style('stroke', '#f5fbef')
      .style('opacity', 0.8)
      .style('stroke-width', 0.5)
      // tooltips
      .on('mouseover',function(d){
        tip.show(d);
        d3.select(this)
          .style('opacity', 1)
          .style('stroke-width', 1.5);
      })
      .on('mouseout', function(d){
        tip.hide(d);
        d3.select(this)
          .style('opacity', 0.8)
          .style('stroke-width',0.5);
      });

  svg.append('path')
    .datum(topojson.mesh(data.features, (a, b) => a.id !== b.id))
    .attr('class', 'names')
    .attr('d', path);
}

}