import * as d3 from 'd3';
import dataset, { tiles } from './Data';

export default function drawChart(key, tile) {
  let height = 600;
  let width = 1200;

  d3.select('#chart').remove(); //remove any chart already drawn, when switching graphs

  //draw the empty chart area so the render does not jump around while loading
  let chart = d3
    .select('#chart-area')
    .append('svg')
    .attr('id', 'chart')
    .attr('width', width)
    .attr('height', height);

  fetch(dataset[key].url)
    .then((response) => response.json())
    .then((data) => {
      let root = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

      let treeRoot = d3.treemap().size([width, height]).padding(2).tile(tiles[tile])(root);

      let categories = new Set();
      treeRoot.leaves().forEach((d) => categories.add(d.data.category));
      let colorScale = d3
        .scaleOrdinal()
        .domain(categories)
        .range(
          [...categories].map((elem) =>
            d3.interpolateCool([...categories].indexOf(elem) * (1 / [...categories].length)),
          ),
        );

      let nodes = chart
        .selectAll('g')
        .data(treeRoot.leaves())
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);

      nodes
        .append('rect')
        .attr('height', (d) => d.y1 - d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .attr('class', 'tile')
        .style('fill', (d) => colorScale(d.data.category))
        .on('mouseenter', function (e) {
          var name = d3.select(this).attr('data-name');
          var category = d3.select(this).attr('data-category');
          var value = d3.select(this).attr('data-value');

          d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .attr('data-value', d3.select(this).attr('data-value'))
            .style('top', e.pageY + 'px')
            .style('left', e.pageX + 'px')
            .html(`Name: ${name}<br>Category: ${category}<br>Value: ${value}`);
        })
        .on('mousemove', function (e) {
          d3.select('#tooltip')
            .style('top', e.pageY + 'px')
            .style('left', e.pageX + 'px');
        })
        .on('mouseleave', function () {
          d3.select('#tooltip').remove();
        });

      //only render text on tiles with good squares
      if (tile == 'Binary' || tile == 'Squarify' || tile == 'Resquarify') {
        nodes
          .append('text')
          .attr('width', (d) => d.x1 - d.x0)
          .attr('height', (d) => d.y1 - d.y0)
          .attr('y', '1em')
          .attr('dy', '0')
          .attr('x', '5')
          .text((d) => d.data.name)
          .style('font-size', '0.7em')
          .call(wrap);
      }

      d3.select('#legend').remove(); //remove previously rendered legend chart when chaging data

      let columnSize = 200;
      let columnNumber = Math.floor(width / columnSize);
      let rowHeight = 20;

      //width of legend area is same as width of the graph, height changes depending on number of items
      let legendItem = d3
        .select('#legend-area')
        .append('svg')
        .attr('id', 'legend')
        .attr('width', width)
        .attr('height', () => Math.ceil([...categories].length / columnNumber) * rowHeight)
        .selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr(
          'transform',
          (d) =>
            `translate(${([...categories].indexOf(d) % columnNumber) * columnSize},
            ${Math.floor([...categories].indexOf(d) / columnNumber) * rowHeight})`,
        );
      //colored square
      legendItem
        .append('rect')
        .attr('class', 'legend-item')
        .attr('height', '15')
        .attr('width', '15')
        .style('fill', (d) => colorScale(d));
      //legend name
      legendItem
        .append('text')
        .attr('x', '20')
        .style('dominant-baseline', 'hanging')
        .style('font-size', '15px')
        .style('font-family', 'tahoma')
        .text((d) => d);
    });
}

//snippet taken from https://gist.github.com/mbostock/7555321
//code below allows wrapping of text in tiles based on the attribute 'width'
function wrap(text) {
  text.each(function () {
    let width = d3.select(this).attr('width');
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr('y'),
      dy = parseFloat(text.attr('dy')),
      tspan = text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', dy + 'em');
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
}
