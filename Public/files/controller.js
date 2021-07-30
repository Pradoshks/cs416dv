function controller() {
  const height = 600;
  const width = 980;

  // Create SVG and padding for the chart
  const svg = d3
    .select(".chart-holder")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const chartHolder = d3.select(".chart-holder").append('div')

  const json = d3.json("https://unpkg.com/world-atlas@1/world/110m.json")
  const tsv = d3.tsv("https://unpkg.com/world-atlas@1/world/110m.tsv")
  const wordAllData = d3.csv('Public/Data/owid-covid-data.csv')
  const WeekGrowthCase = d3.csv('Public/Data/weekly-growth-covid-cases.csv')
  const json1 = d3.json("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json")

  const path = d3.geoPath()
  const projection = d3.geoMercator()
    .scale(120)
    .translate([width / 2, height / 2]);

  const pathGenerator = path.projection(projection)
  const zoom = d3.zoom()
  svg.call(zoom.on('zoom', (event, d) => {
    g.attr('transform', event.transform)
  }));

  data = new Map()
  data1 = new Map()
  data_death = new Map()
  data_death_mil = new Map()
  data_vaccine = new Map()
  data_rel_pop_vaccine = new Map()
  data_cases_mil = new Map()

  d3.select("svg").html("")
  var selectOptions = ["Cumulative Cases", "Cases Per Million"]

  const g = svg.append('g')

  Promise.all([json, tsv, wordAllData, WeekGrowthCase, json1])
    .then(([topoJSONdata, tsvData, wordAllData, WeekGrowthCase, json1]) => {
      const countryName = {}
      const countryCode = {}
      tsvData.forEach(d => {
        countryName[d.iso_n3] = d.name
      })

      pop = d3.max(wordAllData, d => +d.people_fully_vaccinated)
      wordAllData.forEach(d => {
        d.date_reported = new Date(d.date)
        d.new_deaths = +d.new_deaths;
        d.total_deaths = +d.total_deaths;
        d.new_cases = +d.new_cases;
        d.total_cases = +d.total_cases;
        d.new_cases_per_million = +d.new_cases_per_million
        d.total_cases_per_million = +d.total_cases_per_million;
        d.new_deaths_per_million = +d.new_deaths_per_million
        d.Weekly_case_growth = +d.Weekly_case_growth;
        d.people_fully_vaccinated = +d.people_fully_vaccinated
        d.perc_people_full_vacc = +d.perc_people_full_vacc
        d.new_vaccinations = +d.new_vaccinations
        d.population = +d.population
        d.gdp_per_capita = +d.gdp_per_capita
        d.human_development_index = +d.human_development_index
        d.life_expectancy = d.life_expectancy
        d.population_density = d.population_density
        d.excess_mortality = d.excess_mortality
        d.hospital_beds_per_thousand = +d.hospital_beds_per_thousand
        d.median_age = d.median_age

        data.set(d.location, +d.total_cases)
        data_death.set(d.location, +d.total_deaths)
        data_cases_mil.set(d.location, +d.total_cases_per_million)
        data_death_mil.set(d.location, +d.total_deaths_per_million)

        if (+d.perc_people_full_vacc > 0) {
          data_rel_pop_vaccine.set(d.location, +d.perc_people_full_vacc)
        }

        if (+d.people_fully_vaccinated > 0) {
          data_vaccine.set(d.location, +d.people_fully_vaccinated)
        }
      })

      WeekGrowthCase.forEach(d => {
        data1.set(d.Entity, +d.Weekly_case_growth)
      })

      d3.select(".leftTitle").select(".text-muted").text("");
      const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries).features

      render()

      function render() {
        d3.select(".leftTitle").select("span").html("");
        d3.select(".leftTitle").select(".text-muted").text("")

        casesCumul(svg, wordAllData, countries, countryName, data, data_cases_mil)
        d3.select('.page-1').attr('class', 'page-item page-1 active')
        d3.select('.page-1')
          .on('click', d => {
            d3.select('.page-1').attr('class', 'page-item page-1 active')
            d3.select('.page-2').attr('class', 'page-item page-2')
            d3.select('.page-3').attr('class', 'page-item page-3')
            d3.select('.page-4').attr('class', 'page-item page-4')
            d3.select('.page-5').attr('class', 'page-item page-5')
            casesCumul(svg, wordAllData, countries, countryName, data, data_cases_mil)
          })

        d3.select('.page-2')
          .on('click', d => {
            d3.select('.page-2').attr('class', 'page-item page-2 active')
            d3.select('.page-1').attr('class', 'page-item page-1')
            d3.select('.page-3').attr('class', 'page-item page-3')
            d3.select('.page-4').attr('class', 'page-item page-4')
            d3.select('.page-5').attr('class', 'page-item page-5')
            deathsCumul(svg, wordAllData, countries, countryName, data_death, data_death_mil)
          })

        d3.select('.page-3')
          .on('click', d => {
            d3.select('.page-3').attr('class', 'page-item page-3 active')
            d3.select('.page-1').attr('class', 'page-item page-1')
            d3.select('.page-2').attr('class', 'page-item page-2')
            d3.select('.page-4').attr('class', 'page-item page-4')
            d3.select('.page-5').attr('class', 'page-item page-5')
            peopleVacc(svg, wordAllData, countries, countryName, data_vaccine, data_rel_pop_vaccine)
          })


        d3.select('.page-4')
          .on('click', d => {
            d3.select('.page-4').attr('class', 'page-item page-4 active')
            d3.select('.page-1').attr('class', 'page-item page-1')
            d3.select('.page-2').attr('class', 'page-item page-2')
            d3.select('.page-3').attr('class', 'page-item page-3')
            d3.select('.page-5').attr('class', 'page-item page-5')
            weekGrowth(svg, wordAllData, countries, countryName, data1)
          })


        d3.select('.page-5')
          .on('click', d => {
            d3.select('.page-5').attr('class', 'page-item page-5 active')
            d3.select('.page-1').attr('class', 'page-item page-1')
            d3.select('.page-2').attr('class', 'page-item page-2')
            d3.select('.page-3').attr('class', 'page-item page-3')
            d3.select('.page-4').attr('class', 'page-item page-4')
            whatsNext(svg, wordAllData, countries, countryName, data1)
          })

      }

    });

}
