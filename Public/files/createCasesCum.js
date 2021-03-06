function createCasesCum(svg, wordAllData, selectedCountry, selectedvalue) {

  let data = {}
  data = wordAllData
  d3.select(".tooltip").html("")
  formatWeek = d3.timeFormat("%b %d %Y")

  if (selectedCountry === undefined) {
    selectedCountry = 'United States'
    var dataFilter = wordAllData.filter(d => d.location === selectedCountry)
  } else {
    var dataFilter = wordAllData.filter(d => d.location === selectedCountry)
  }


  const margin = {
    top: 50,
    bottom: 50,
    left: 80, //100
    right: 0
  }

  const innerHeight = height - margin.top - margin.bottom
  const innerWidth = width - margin.left - margin.right

  const xValue = d => d.date_reported;
  const xAxisLabel = 'Timeline';

  const yValue = d => d.new_cases;
  const yAxisLabel = 'No. Of Cases';

  d3.select("svg").html("")
  d3.select(".tooltip").html("")

  d3.select(".leftTitle").text("")


  let head = 'Country : '
  let head2 = 'Total Cases : '

  d3.select(".leftTitle").html('<i>' + '<strong>' + head + '</strong>' + selectedCountry + '</br>' +
    '<strong>' + head2 + '</strong>' + d3.format(",")(selectedvalue))

  d3.select(".rightTitle").select(".text-muted").text("")
  let head3 = 'Continent : '
  let head4 = 'Population : '
  let head5 = 'Population Density : '
  let head6 = 'GDP Per Capita : '
  let head7 = 'Human Dev. Index : '
  let head8 = 'Median Age : '
  let head9 = 'Life Expectancy : '
  let head10 = 'Hospital Bed/ 1K : '

  let continent = dataFilter[0].continent
  let population = dataFilter[0].population
  let pop_dens = dataFilter[0].population_density
  let gdp = dataFilter[0].gdp_per_capita
  let hdi = dataFilter[0].human_development_index
  let life_ep = dataFilter[0].life_expectancy
  let median_age = dataFilter[0].median_age
  let hosp_1k = dataFilter[0].hospital_beds_per_thousand
  d3.select(".rightTitle").html('<i>' + '<strong>' + head3 + '</strong>' + continent + '</br>' +
    '<strong>' + head4 + '</strong>' + d3.format(",")(population) + '</br>' +
    '<strong>' + head5 + '</strong>' + pop_dens + '</br>' +
    '<strong>' + head6 + '</strong>' + gdp + '</br>' +
    '<strong>' + head7 + '</strong>' + hdi + '</br>' +
    '<strong>' + head8 + '</strong>' + median_age + '</br>' +
    '<strong>' + head9 + '</strong>' + life_ep + '</br>' +
    '<strong>' + head10 + '</strong>' + hosp_1k + '</br>'
  )
  // d3.select(".leftTitle").html("Country : " + selectedCountry + "</br>" + "Total Cases : "+d3.format(",")(selectedvalue))

  const g = svg.append("g")
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataFilter, xValue))
    .range([0, innerWidth])
    .clamp(true)

  const xScaleWidth = d3.scaleBand()
    .domain(d3.map(dataFilter, d => new Date(d.date_reported)))
    .range([0, innerWidth])
    .padding(0.2)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataFilter, yValue)])
    .range([innerHeight, 0])
    .clamp(true)
    .nice();

  const xAxis = d3.axisBottom(xScale)
    .ticks(d3.timeWeek.every(8))

  const yAxisTickFormat = number =>
    d3.format('.2s')(number)
    .replace('G', 'B')

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(yAxisTickFormat)
    .tickSize(-innerWidth)
    .ticks(10)

  const xAxisG = g.append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)

  const yAxisG = g.append('g').call(yAxis)

  yAxisG.append('text')
    .attr('class', 'axis-label')
    .text(yAxisLabel)
    .attr("x", -innerHeight / 2)
    .attr('y', -60)
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", `middle`)
    .attr("fill", "black");

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .text(xAxisLabel)
    .attr("x", innerWidth / 2)
    .attr('y', 50)
    .attr("fill", "black");

  yAxisG.selectAll('.domain')
    .remove();

  xAxisG.select('.domain')
    .remove();

  const title = "Case Growth Over Time - " + selectedCountry
  g.append('text')
    .attr('class', 'title')
    .attr('y', -25)
    .attr('x', 210)
    .text(title)

  rectG = g.append('g')

  rectG.selectAll('rect')
    .data(dataFilter)
    .enter().append('rect')
    .attr('x', d => xScaleWidth(xValue(d)))
    .attr('y', yScale(0))
    .attr('width', xScaleWidth.bandwidth())
    .attr('height', innerHeight - yScale(0))
    .attr('fill', '#0093d5')
    .on('mouseover', function(event, d) {
      d3.select(this).attr('fill', '#AFADAD')
      d3.select(".tooltip")
        .transition()
        .duration(1000)
        .style("opacity", 1)
      d3.select(".tooltip")
        .html("<strong>Date: </strong>" + formatWeek(d.date_reported) + "<br>"
        +"<strong>Number of Cases: </strong>" + d3.format(",")(d.new_cases))
        .style("left", (event.pageX) - 150 + "px")
        .style("top", (event.pageY) - 20 + "px")
    })
    .on('mouseout', function(event) {
      d3.select(".tooltip")
        .transition()
        .duration(500)
        .delay(500)
        .style('opacity', '0')

      d3.select(this).
        attr('fill', "#0093d5")
    })
    .transition()
    .duration((d,i)=> i*5)
    .delay(200)
    .ease(d3.easeLinear)
    .attr('y', d => yScale(yValue(d)))
    .attr('height', d => innerHeight - yScale(yValue(d)))
}
