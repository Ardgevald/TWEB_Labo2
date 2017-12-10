
const svg = d3.select('#d3Container');
const margin = {
  top: 20, right: 20, bottom: 30, left: 40,
};

const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;
const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

const x0 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

const x1 = d3.scaleBand()
  .padding(0.1);

const y = d3.scaleLinear()
  .rangeRound([height, 0]);

const z = d3.scaleOrdinal()
  .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c']);

const tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-8, 0])
  .html(d => `<strong>Avg. ${d.key}:</strong> <span class='value'>${d.value}</span>`);

const duration = 500;

svg.call(tip);

d3.csv('csv/stats_per_type.csv', (d, j, columns) => {
  const newD = d;
  for (let i = 1, n = columns.length; i < n; i += 1) {
    newD[columns[i]] = +d[columns[i]];
  }
  return newD;
}, (error, data) => {
  if (error) throw error;

  let active = '';

  const metadata = data.columns.slice(1);

  x0.domain(data.map(d => d.type));
  x1.domain(metadata).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, d => d3.max(metadata, key => d[key]))]).nice();

  g.append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${x0(d.type)},0)`)
    .selectAll('rect')
    .data(d => metadata.map(key => ({ key, value: d[key] })))
    .enter()
    .append('rect')
    .attr('x', d => x1(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => z(d.key))
    .attr('title', d => y(d.value))
    .attr('class', d => `bar ${d.key}`)
    .on('mouseout', (d) => {
      if (active === '' || active === d.key) {
        tip.hide(d);

        d3.selectAll('.bar,.legend')
          .filter(e => d.key !== e.key && d.key !== e)
          .transition()
          .duration(duration)
          .attr('opacity', 1);
      }
    })
    .on('mouseover', (d) => {
      if (active === '' || active === d.key) {
        tip.show(d);

        d3.selectAll('.bar,.legend')
          .filter(e => d.key !== e.key && d.key !== e)
          .transition()
          .duration(duration)
          .attr('opacity', 0.15);
      }
    });

  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0));

  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(null, 's'))
    .append('text')
    .attr('x', 2)
    .attr('y', y(y.ticks().pop()) + 0.5)
    .attr('dy', '0.32em')
    .attr('fill', '#000')
    .attr('font-weight', 'bold')
    .attr('font-size', '2em')
    .attr('text-anchor', 'start')
    .text('Stat average per type');

  const legend = g.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 15)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(metadata.slice())
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(20,${i * 20})`)
    .attr('class', d => `legend ${d}`)
    .attr('cursor', 'pointer')
    .on('click', (d) => {
      if (active === d) {
        active = '';

        d3.selectAll('.bar')
          .transition()
          .duration(duration)
          .attr('fill-opacity', 1);
      } else {

        active = d;

        d3.selectAll('.bar')
          .filter(e => d === e.key)
          .transition()
          .duration(duration)
          .attr('fill-opacity', 1);

        d3.selectAll('.bar')
          .filter(e => d !== e.key)
          .transition()
          .duration(duration)
          .attr('fill-opacity', 0);
      }
    });

  legend.append('rect')
    .attr('x', width - 19)
    .attr('width', 19)
    .attr('height', 19)
    .attr('fill', z);

  legend.append('text')
    .attr('x', width - 24)
    .attr('y', 9.5)
    .attr('dy', '0.32em')
    .text(d => d);
});