function cumulCasesMap() {
  height = 600;
  width = 900;

  const chartHolder = d3.select(".chart-holder").append('div')
  const svg = d3.select('.chart-holder').select('div').append('svg').attr('height', height).attr('width', width)
  const json = d3.json("https://unpkg.com/world-atlas@1/world/110m.json")
  const tsv = d3.tsv("https://unpkg.com/world-atlas@1/world/110m.tsv")
  const usAllData = d3.csv('/USA/owid-covid-data.csv')

  const path = d3.geoPath()
  const projection = d3.geoMercator()
    .scale(120)
    .translate([width / 2, height / 2]);

  const pathGenerator = path.projection(projection)

  data = new Map()

  const zoom = d3.zoom()
  svg.call(zoom.on('zoom', (event, d) => {
    g.attr('transform', event.transform)

  }));
  d3.select("svg").html("")
  d3.select(".leftTitle").select("span").html("");
  d3.select(".leftTitle").select(".text-muted").html("")



  var selectOptions = ["Cumulative", "valueB", "valueC"]

  // svg.append('path')
  //    .attr('class', 'sphere')
  //    .attr('d', pathGenerator({type:'Sphere'}))
  const g = svg.append('g')

  let dropDown = d3.select("select")
    .selectAll('myOptions')

  d3.select('.form-selecountrySelector').on('change', function(d) {
    var selectedOption = this.value
    if (selectedOption === 'Cumulative') {
      eee()
    } else
      fff(svg)
  })

  dropDown
    .data(selectOptions)
    .enter()
    .append('option')
    .text(d => d)
    .attr(d => d)

  Promise.all([json, tsv, usAllData])
    .then(([topoJSONdata, tsvData, usAllData]) => {
      d => data.set(d.location, +d.total_cases)
      const countryName = {}
      tsvData.forEach(d => {
        countryName[d.iso_n3] = d.name
      })

      usAllData.forEach(d => {
        d.new_deaths = +d.new_deaths;
        d.new_cases = +d.new_cases;
        d.total_cases = +d.total_cases;
        d.vax = +d.vax
        d.date_reported = new Date(d.date) //+ new Date(d.date).getDate()
        data.set(d.location, +d.total_cases)
      })

      const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries).features
      colorScheme = d3.schemeYlOrRd[7]
      const caseRange = [10000, 50000, 100000, 1000000, 2000000, 10000000]
      const colorScale = d3.scaleThreshold()
        .domain(caseRange)
        .range(colorScheme); //schemeRdPu

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
        .attr('y', 550)
        .attr('height', 12)
        .attr('width', 50)
        .attr('fill', d => colorScale(d))
        .attr('stroke', 'black')

      legendG.append('text').attr('text', 'hhhh')

      legendG.append('text')
        .attr('x', 10)
        .attr('y', 520)
        .text(d => colorScale(d))
        .attr('stroke', 'black')

      const legendTextScale = d3.scalePoint()
        .domain([0, 10000, 50000, 100000, 1000000, 2000000, 100000000])
        .range([0, 600 / 2])

      const legendTextScaleTickFormat = number =>
        d3.format('.0s')(number)
        .replace('G', 'B')

      const lgendTextAxis = d3.axisBottom(legendTextScale)
        .tickFormat(legendTextScaleTickFormat)

      const legendTextG = svg.append('g').call(lgendTextAxis)
        .attr('transform', `translate(0,${570 })`)
        .selectAll("text")

      legendTextG.selectAll('g').select('.tick').attr('opacity', 0)
        .select('line').attr('stroke', '#C0C0BB')

      function mapToolTip(d, i) {
        total_cases = data.get(countryName[i.id]) || 0
        d3.select(".tooltip").style("opacity", 1)
          .style("position", "absolute")
          .style("left", (event.pageX) - 160 + "px")
          .style("top", (event.pageY) - 80 + "px")
          .append('text')
          .text("Total Number of Cases : " + total_cases)
      }

      function mapToolTipClear(d, i) {
        d3.select(".tooltip").style("opacity", 0)
          .selectAll('text')
          .remove()
      }

      function createChart(d, i) {
        total_cases = data.get(countryName[i.id]) || 0
        ddd(countryName[i.id], total_cases)
      }

      function setColor(d, i) {
        let total_cases = data.get(countryName[d.id]) || 0
        if (total_cases == 0)
          return 'lightgrey'
        return colorScale(total_cases)
      }
    });
}
