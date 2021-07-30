function casesCumul(svg, usAllData, countries, countryName, data, data_cases_mil) {
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

  let head = 'What is it?'
  let text1 = `Coronavirus disease (COVID-19)`
  text1a = ` is an infectious disease caused by a newly discovered coronavirus.`
  text1b = ` On March 11, 2020, the WHO declared COVID-19 a global pandemic`
  text1c = `, its first such designation since declaring H1N1 influenza a pandemic in 2009.
  It has spread to almost every country and territory around the world, infecting millions of people and devastating the global economy. `

  text2 = 'As of today, the number of COVID-19 cases worldwide had reached over 195 million.'
  text3 = 'This chart provides current picture of the cases and cases per million people who were infected. Click on the buttons above to navigate to slides.'
  text4 = 'How to interact with the Chart: '
  text5 = 'Hover over the chart to see more details or click on countries to see how they arrived here. Scroll on the map to Zoom in or Out.'
  d3.select(".leftTitle").html('<i>' + '<strong>' + head + '</br>' + text1 + '</strong>' + text1a + '<strong>' + text1b + '</strong>' + text1c + '<strong>' + '<hr>' + text2 + '</strong><br><i>')
  d3.select(".rightTitle").html('<i>' + '<strong>' + "What does this chart mean?" + '</br>' + '</strong>' + '<i>' + text3 + '<hr>' + '<strong>' + text4 + '</strong>' + text5)

  svg.append('div').append('input')
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
    .attr('fill', '#084594')
    .on('mouseover', function(event) {
      d3.select(this).attr('fill', 'green')
    })
    .on('mouseout', function(event) {
      d3.select(this).attr('fill', '#084594')
    })
    .on('click', d => casesCumulMil(svg, usAllData, countries, countryName, data_cases_mil, data))

  switchG.append('text')
    .attr('x', 752)
    .attr('y', 0)
    .text('Switch to Relative to Population')
    .attr("dy", "1em")

  let dropDown = d3.select("select")
    .selectAll('myOptions')

  colorScheme = d3.schemeBlues[7] //schemeYlOrRd

  const caseRange = [10000, 50000, 100000, 500000, 1000000, 30000000, 50000000]
  const colorScale = d3.scaleThreshold()
    .domain(caseRange)
    .range(colorScheme); //schemeRdPu

  d3.select(".card-heading")
    .select('text')
    .remove()

  d3.select(".card-heading")
    .append('text')
    .text("What is the cumulative number of Confirmed Cases?")

  mapG = g.append('g').selectAll('path')
    .data(countries)
    .enter()
    .append('path')
    .attr('d', pathGenerator)
    .attr('class', 'country')
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

  var legendTextScale = d3.scalePoint()
    .domain([0, 50000, 100000, 500000, 1000000, 30000000, 50000000])
    .range([0, 600 / 2]);

  const legendTextScaleTickFormat = number =>
    d3.format('.0s')(number)
    .replace('G', 'B')

  const lgendTextAxis = d3.axisBottom(legendTextScale)
    .tickFormat(legendTextScaleTickFormat)
    .tickValues([0, 10000, 50000, 100000, 500000, 1000000, 30000000, 50000000])

  const legendTextG = svg.append('g').call(lgendTextAxis)
    .attr('transform', `translate(0,${530})`)
    .selectAll("text")

  legendTextG.selectAll('g')
    .select('.tick')
    .attr('opacity', 0)
    .select('line')
    .attr('stroke', '#C0C0BB')

  function mapToolTip(d, i) {
    total_cases = data.get(countryName[i.id]) || 0

    d3.select(".tooltip")
      .style("opacity", 1)
      .html("Country: <b>" + countryName[i.id] + "</b><br/>" +
        "Total Number of Cases : <b>" + d3.format('.4s')(total_cases) +
        "</br> Click for change over time.")
      .style("left", (event.pageX) - 110 + "px")
      .style("top", (event.pageY) - 20 + "px")
  }

  function mapToolTipClear(d, i) {
    d3.select(".tooltip").html("").attr('opacity', '0')
  }

  function createChart(d, i) {
    barColor = d3.select(this).attr('fill')
    total_cases = data.get(countryName[i.id]) || 0
    const callingFrom = 'cumulCase'
    // ddd(svg,usAllData,countryName[i.id], total_cases)
    createCasesCum(svg, usAllData, countryName[i.id], total_cases)
  }

  function setColor(d, i) {
    let total_cases = data.get(countryName[d.id]) || 0

    if (total_cases == 0)
      return 'lightgrey'
    return colorScale(total_cases)
  }

  const annotation1 = [{
    note: {
      label: "COVID-19 Originated from Wuhan, China on 31 Dec 2019. Since then it spread all over the world and caused Pandemic.",
      title: "1) Where it all began?"
    },
    x: 718,
    y: 280,
    dy: 40,
    dx: 148
  }]

  const annotation2 = [{
    note: {
      label: "US is leading with 34M cases so far and counting.",
      title: "2) Who is Leading?"
    },
    x: 240,
    y: 250,
    dy: 100,
    dx: -100
  }]

  const annotation3 = [{
    note: {
      label: "India broke record number of cases per day with 400k+ in May '21'. ",
      title: "3) Where it went wrong?"
    },
    x: 660,
    y: 310,
    dy: 130,
    dx: -160
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
