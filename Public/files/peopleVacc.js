function peopleVacc(svg, usAllData, countries, countryName, data, data_rel_pop_vaccine) {
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
  d3.select(".rightTitle").select(".text-muted").text("")

  let head = 'Where are we now?'
  let text1 = `Coronavirus disease (COVID-19)`
  text1a = ` can now be prevented.Vaccines take years to be developed. But, thanks to the latest technology and knowledge gained from previous outbreaks,`
  text1b = ` on Dec 2 2020, 1st vaccine was approved in UK.`
  text1c = ` Since then, many other countries have developed new vaccines or have been exporting from other countries. `

  text2 = 'As of today, the number of people fully vaccinated worldwide has reached over 1.8 billion, which is 13.9% of the world population.'
  text3 = 'This chart provides current picture of the vaccination and share of population who have been fully vaccinated. Click on the buttons above to navigate to slides.'
  text4 = 'How to interact with the Chart: '
  text5 = 'Hover over the chart to see more details or click on countries to see how they arrived here. Scroll on the map to Zoom in or Out.'
  d3.select(".leftTitle").html('<i>' + '<strong>' + head + '</br>' + text1 + '</strong>' + text1a + '<strong>' + text1b + '</strong>' + text1c + '<strong>' + '<hr>' + text2 + '</strong><br><i>')
  d3.select(".rightTitle").html('<i>' + '<strong>' + "What does this chart mean?" + '</br>' + '</strong>' + '<i>' + text3 + '<hr>' + '<strong>' + text4 + '</strong>' + text5)
  // d3.select(".leftTitle").html('<i>'+text+'<br><i>'+'Hover over the chart to see more details or click on countries to see how they arrived here.')


  const g = svg.append('g')
  switchG = svg.append('g')
  switchG.append('rect')
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
    .on('click', d => perPeopleVacc(svg, usAllData, countries, countryName, data_rel_pop_vaccine, data))

  switchG.append('text')
    .attr('x', 752)
    .attr('y', 0)
    .text('Switch to Relative to Population')
    .attr("dy", "1em")

  colorScheme = d3.schemeGreens[7] //schemeYlOrRd
  const caseRange = [0, 1000000, 5000000, 10000000, 100000000, 200000000, 500000000]
  const colorScale = d3.scaleThreshold()
    .domain(caseRange)
    .range(colorScheme); //schemeRdPu

  d3.select(".card-heading")
    .select('text')
    .remove()

  d3.select(".card-heading")
    .append('text')
    .text("What is the cumulative number of People Vaccinated?")

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
    .attr('y', 520)
    .attr('height', 12)
    .attr('width', 50)
    .attr('fill', d => colorScale(d))
    .attr('stroke', 'black')
    .attr('class', (d, i) => 'rect' + i)

  d3.select('.rect6').remove()

  noDataG = svg.append('g')
  noDataG.append('rect')
    .attr('x', 0)
    .attr('y', 560)
    .attr('height', 12)
    .attr('width', 50)
    .attr('fill', 'lightgrey')
    .attr('stroke', 'black')

  textG = noDataG.append('text')
    .attr('x', 60)
    .attr('y', 570)
    .attr('font-size', '0.8em')
    .attr('fill', '#635F5D')
    .attr('class', 'tick')

  textG.text("No Data")

  const legendTextScale = d3.scalePoint()
    .domain([0, 1000000, 5000000, 10000000, 100000000, 200000000, 500000000])
    .range([0, 600 / 2])

  const legendTextScaleTickFormat = number =>
    d3.format('.0s')(number)
    .replace('G', 'B')

  const lgendTextAxis = d3.axisBottom(legendTextScale)
    .tickFormat(legendTextScaleTickFormat)

  const legendTextG = svg.append('g').call(lgendTextAxis)
    .attr('transform', `translate(0,${530 })`)
    .selectAll("text")

  legendTextG.selectAll('g').select('.tick').attr('opacity', 0)
    .select('line').attr('stroke', '#C0C0BB')

  function mapToolTip(d, i) {
    people_vaccinated = data.get(countryName[i.id]) || 0

    d3.select(".tooltip")
      .style("opacity", 1)
      .html("Country: <b>" + countryName[i.id] + "</b><br/>" + "Total Number of Vaccinations : <b>" + d3.format('.4s')(people_vaccinated) +
        "</br> Click for change over time.")
      .style("left", (event.pageX) - 150 + "px")
      .style("top", (event.pageY) - 20 + "px")
  }

  function mapToolTipClear(d, i) {
    d3.select(".tooltip").style("opacity", 0)
  }

  function createChart(d, i) {
    people_vaccinated = data.get(countryName[i.id]) || 0
    // ddd(countryName[i.id], people_vaccinated)
    // fullyVacc(svg, wordAllData, selectedCountry, selectedvalue)
    fullyVacc(svg, usAllData, countryName[i.id], people_vaccinated)
  }

  function setColor(d, i) {
    let people_vaccinated = data.get(countryName[d.id]) || 0

    if (people_vaccinated == 0)
      return 'lightgrey'
    return colorScale(people_vaccinated)
  }

  const annotation1 = [{
    note: {
      label: "China has vaccinated more people than any country in the world.",
      title: "1) Big Numbers!"
    },
    x: 720,
    y: 220,
    dy: 40,
    dx: 135
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
      label: "African countries have less vacinations. ",
      title: "3) Least Vaccinations?"
    },
    x: 550,
    y: 320,
    dy: 110,
    dx: -50
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
