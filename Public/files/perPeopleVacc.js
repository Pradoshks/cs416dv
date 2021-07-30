function perPeopleVacc(svg, wordAllData, countries, countryName, data_rel_pop_vaccine, data) {
  height = 600;
  width = 980;

  const path = d3.geoPath()
  const projection = d3.geoMercator()
    .scale(120)
    .translate([width / 2, height / 2 + 50]);

  const pathGenerator = path.projection(projection)

  const zoom = d3.zoom()

  svg.call(zoom.on('zoom', (event, d) => {
    g.attr('transform', event.transform)

  }));

  d3.select("svg").html("")

  svg.append('div').append('input')
  var selectOptions = ["Cumulative Cases", "Cases Per Million"]

  const g = svg.append('g')
  switchG = svg.append('g')
  switchG.append('rect')

  g.append('rect')
    .attr('x', 730)
    .attr('y', 0)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr('height', 20)
    .attr('width', 20)
    .attr('fill', '#238b45')
    .on('mouseover', function(event) {
      d3.select(this).attr('fill', 'red')
    })
    .on('mouseout', function(event) {
      d3.select(this).attr('fill', '#238b45')
    })
    .on('click', d => peopleVacc(svg, wordAllData, countries, countryName, data, data_rel_pop_vaccine))

  g.append('text')
    .attr('x', 752)
    .attr('y', 0)
    .text('Switch to Cumulative')
    .attr("dy", "1em")

  colorScheme = d3.schemeGreens[7] //schemeYlOrRd
  const caseRange = [0, 5, 10, 20, 50, 70, 100]
  const colorScale = d3.scaleThreshold()
    .domain(caseRange)
    .range(colorScheme); //schemeRdPu

  d3.select(".card-heading")
    .select('text')
    .remove()

  d3.select(".card-heading")
    .append('text')
    .text("What is the share of the population Fully Vaccinated?")

  mapG = g.append('g').selectAll('path')
    .data(countries)
    .enter()
    .append('path')
    .attr('d', pathGenerator)
    .attr('class', 'countrye')
    .attr('fill', setColor)
    .on('mouseover', mapToolTip)
    .on('mouseout', mapToolTipClear)
    .on('click', createChart)

  legendG = svg.append('g').selectAll('rect')
    .data(caseRange)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * 50)
    .attr('y', 530)
    .attr('height', 12)
    .attr('width', 50)
    .attr('fill', d => colorScale(d))
    .attr('stroke', 'black')
    .attr('class', (d, i) => 'rect' + i)

  d3.select('.rect6').remove()

  noDataG = svg.append('g')
  noDataG.append('rect')
    .attr('x', 0)
    .attr('y', 570)
    .attr('height', 12)
    .attr('width', 50)
    .attr('fill', 'lightgrey')
    .attr('stroke', 'black')

  textG = noDataG.append('text')
    .attr('x', 60)
    .attr('y', 580)
    .attr('font-size', '0.8em')
    .attr('fill', '#635F5D')
    .attr('class', 'tick')

  textG.text("No Data")


  const legendTextScale = d3.scalePoint()
    .domain([0, .05, .10, .20, .50, .70, .9])
    .range([0, 600 / 2])

  const legendTextScaleTickFormat = number =>
    d3.format('.0%')(number)
    .replace('G', 'B')


  const lgendTextAxis = d3.axisBottom(legendTextScale)
    .tickFormat(legendTextScaleTickFormat)

  const legendTextG = svg.append('g').call(lgendTextAxis)
    .attr('transform', `translate(0,${540 })`)
    .selectAll("text")

  legendTextG.selectAll('g').select('.tick').attr('opacity', 0)
    .select('line').attr('stroke', '#C0C0BB')

  function mapToolTip(d, i) {
    people_vaccinated = data_rel_pop_vaccine.get(countryName[i.id]) || 0

    d3.select(".tooltip")
      .style("opacity", 1)
      .html("Country: <b>" + countryName[i.id] + "</b><br/>" + "% Of Population Vaccinated: <b>" + d3.format(".2f")(people_vaccinated) + "%")
      .style("left", (event.pageX) - 150 + "px")
      .style("top", (event.pageY) - 20 + "px")
  }

  function mapToolTipClear(d, i) {
    d3.select(".tooltip").style("opacity", 0)
  }

  function createChart(d, i) {
    people_vaccinated = data_rel_pop_vaccine.get(countryName[i.id]) || 0
    perPeopFullyVac(svg, wordAllData, countryName[i.id], people_vaccinated)
    // ddd(countryName[i.id], people_vaccinated)
  }

  function setColor(d, i) {
    let people_vaccinated = data_rel_pop_vaccine.get(countryName[d.id]) || 0

    if (people_vaccinated == 0)
      return 'lightgrey'
    return colorScale(people_vaccinated)
  }

  const annotation1 = [{
    note: {
      label: "Mongolia is the only Asian country to cross 50%.",
      title: "1) Good Progress!"
    },
    x: 720,
    y: 240,
    dy: 40,
    dx: 148
  }]

  const annotation2 = [{
    note: {
      label: "American nations are doing great progress in vaccination.",
      title: "2) Who is Leading?"
    },
    x: 240,
    y: 250,
    dy: 100,
    dx: -100
  }]

  const annotation3 = [{
    note: {
      label: "India has vaccinated 86M people, it only 6% of the total population. ",
      title: "3) Really a great number?"
    },
    x: 660,
    y: 300,
    dy: 130,
    dx: -120
  }]

  // Add annotation to the chart

  const makeAnnotations1 = d3.annotation()
    .annotations(annotation1)
  d3.select("g")
    .append("g")
    .call(makeAnnotations1)

  const makeAnnotations2 = d3.annotation()
    .annotations(annotation2)
  d3.select("g")
    .append("g")
    .call(makeAnnotations2)

  const makeAnnotations3 = d3.annotation()
    .annotations(annotation3)
  d3.select("g")
    .append("g")
    .call(makeAnnotations3)
}
