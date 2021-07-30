function deathsCumulMil(svg, usAllData, countries, countryName, data_death_mil, data) {
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
  d3.select(".leftTitle").select("span").html("");
  d3.select(".leftTitle").select(".text-muted").text("")

  var selectOptions = ["Cumulative Cases", "Cases Per Million"]

  const g = svg.append('g')
  switchG = svg.append('g')
  switchG.append('rect')
    .attr('x', 730)
    .attr('y', 0)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr('height', 20)
    .attr('width', 20)
    .attr('fill', '#b10026')
    .on('mouseover', function(event) {
      d3.select(this).attr('fill', 'green')
    })
    .on('mouseout', function(event) {
      d3.select(this).attr('fill', '#b10026')
    })
    .on('click', d => deathsCumul(svg, usAllData, countries, countryName, data, data_death_mil))

  switchG.append('text')
    .attr('x', 752)
    .attr('y', 0)
    .text('Switch to Relative to Cumulative')
    .attr("dy", "1em")

  colorScheme = d3.schemeYlOrRd[7]

  const caseRange = [0, 50, 100, 500, 1000, 5000, 10000]
  const colorScale = d3.scaleThreshold()
    .domain(caseRange)
    .range(colorScheme); //schemeRdPu

  d3.select(".card-heading")
    .select('text')
    .remove()

  d3.select(".card-heading")
    .append('text')
    .text("What is the cumulative number of Confirmed Deaths per Million?")

  mapG = g.append('g').selectAll('path')
    .data(countries)
    .enter()
    .append('path')
    .attr('d', pathGenerator)
    .attr('class', 'countryd')
    .attr('fill', setColor)
    .on('mouseover', mapToolTip)
    .on('mouseout', mapToolTipClear)
    .on('click', createChart)
  // .append('title')
  // .text(d => countryName[d.id])

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

  legendG.append('text').attr('text', 'hhhh')

  legendG.append('text')
    .attr('x', 10)
    .attr('y', 520)
    .text(d => colorScale(d))
    .attr('stroke', 'black')

  const legendTextScale = d3.scalePoint()
    .domain([0, 50, 100, 500, 1000, 5000, 10000])
    .range([0, 600 / 2])

  const legendTextScaleTickFormat = number =>
    d3.format('.0s')(number)
    .replace('G', 'B')

  const lgendTextAxis = d3.axisBottom(legendTextScale)
    .tickFormat(legendTextScaleTickFormat)

  const legendTextG = svg.append('g').call(lgendTextAxis)
    .attr('transform', `translate(0,${540 })`)
    .selectAll("text")

  legendTextG.selectAll('g').select('.tick').attr('opacity', 0)
    .select('line').attr('stroke', '#C0C0BB')

  function mapToolTip(d, i) {
    total_deaths = data_death_mil.get(countryName[i.id]) || 0

    d3.select(".tooltip")
      .style("opacity", 1)
      .html("Country: <b>" + countryName[i.id] + "</b><br/>" + "Deaths Per Million People: <b>" + d3.format('.0s')(total_deaths) +
        "</br> Click for change over time.")
      .style("left", (event.pageX) - 150 + "px")
      .style("top", (event.pageY) - 20 + "px")
  }

  function mapToolTipClear(d, i) {
    d3.select(".tooltip").style("opacity", 0)
  }

  function createChart(d, i) {
    total_deaths = data_death_mil.get(countryName[i.id]) || 0
    // ddd(countryName[i.id], total_deaths)
    createCumDeathMil(svg, usAllData, countryName[i.id], total_deaths)
  }

  function setColor(d, i) {
    let total_deaths = data_death_mil.get(countryName[d.id]) || 0

    if (total_deaths == 0)
      return 'lightgrey'
    return colorScale(total_deaths)
  }

  const annotation1 = [{
    note: {
      label: "Peru has highest number of deaths per Million people.",
      title: "1) But, who is really leading?"
    },
    x: 330,
    y: 360,
    dy: 40,
    dx: -100
  }]

  const annotation2 = [{
    note: {
      label: "European Nations have more deaths per million compared to other continents.",
      title: "2) Cluster?"
    },
    x: 510,
    y: 230,
    dy: 160,
    dx: 100
  }]

  // Add annotation to the chart
  //
  // const makeAnnotations1 = d3.annotation()
  //   .annotations(annotation1)
  // d3.select("g")
  //   .append("g")
  //   .call(makeAnnotations1)

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

  // vaccination

}
