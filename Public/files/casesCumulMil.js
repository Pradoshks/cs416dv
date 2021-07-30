function casesCumulMil(svg, usAllData, countries, countryName, data_cases_mil, data) {

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

  const g = svg.append('g')

  switchG= svg.append('g')
  switchG.append('rect')
    .attr('x',730)
    .attr('y',0)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr('height', 20)
    .attr('width', 20)
    .attr('fill', '#084594')
    .on('mouseover', function (event) { d3.select(this).attr('fill', 'green')})
    .on('mouseout', function (event) { d3.select(this).attr('fill', '#084594')})
    .on('click', d=>casesCumul(svg, usAllData, countries, countryName, data, data_cases_mil))

    switchG.append('text')
      .attr('x',752)
      .attr('y',0)
      .text('Switch to Cumulative')
      .attr("dy", "1em")

  const caseRange = [10, 100, 1000, 10000, 50000, 100000, 5000000]
  const colorScale = d3.scaleThreshold()
    .domain(caseRange)
    .range(d3.schemeBlues[7]); //schemeRdPu

    d3.select(".card-heading")
      .select('text')
      .remove()

    d3.select(".card-heading")
      .append('text')
      .text("What is the cumulative number of Confirmed Cases per Million?")

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
    .append('title')
    .text(d => countryName[d.id])

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
    .attr('class', (d,i) => 'rect'+i)

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
    .domain([10, 100, 1000, 10000, 50000, 100000, 500000])
    .range([0, 600 / 2])

  const legendTextScaleTickFormat = number =>
    d3.format('.0s')(number)
    .replace('G', 'B')


  const lgendTextAxis = d3.axisBottom(legendTextScale)
    .tickFormat(legendTextScaleTickFormat)

  const legendTextG = svg.append('g').call(lgendTextAxis)
    .attr('transform', `translate(0,${540})`)
    .selectAll("text")
    // .attr("x", -12)
    // .attr("dy", 10)

  legendTextG.selectAll('g').select('.tick').attr('opacity', 0)
    .select('line').attr('stroke', '#C0C0BB')

  function mapToolTip(d, i) {
    total_cases_per_million = data_cases_mil.get(countryName[i.id]) || 0
    d3.select(".tooltip").style("opacity", 1)


      .html("Country: <b>" + countryName[i.id] + "</b><br/>" + "Cases Per Milion People : <b>" + d3.format('.4s')(total_cases_per_million) +
        "</br> Click for change over time.")
      .style("left", (event.pageX) - 150 + "px")
      .style("top", (event.pageY) - 20 + "px")
  }

  function mapToolTipClear(d, i) {
    d3.select(".tooltip").style("opacity", 0)

  }

  function createChart(d, i) {
    total_cases_per_million = data_cases_mil.get(countryName[i.id]) || 0
    const callingFrom = 'cumulCaseMil'
    createCumCaseMil(svg,usAllData,countryName[i.id], total_cases_per_million)
  }


  function setColor(d, i) {

    let total_cases_per_million = data_cases_mil.get(countryName[d.id]) || 0
    if (total_cases_per_million == 0)
      return 'lightgrey'
    return colorScale(total_cases_per_million)
  }

  const annotation2 = [{
    note: {
      label: "US also has more cases per million as well.",
      title: "2) Consistent?"
    },
    x: 240,
    y: 250,
    dy: 100,
    dx: -100
  }]

  const annotation3 = [{
    note: {
      label: "Even if India has 31M cases, it is less compared to overall population.",
      title: "1) Is it less?"
    },
    x: 660,
    y: 310,
    dy: 130,
    dx: -160
  }]

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
