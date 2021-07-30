function whatsNext(svg, wordAllData, selectedCountry, totalCases, callingFrom) {
  svg.html("")
  d3.select(".card-heading")
    .select('text')
    .remove()

  d3.select("svg").html("")
  d3.select(".leftTitle").select("span").html("");
  d3.select(".leftTitle").select(".text-muted").text("")
  d3.select(".rightTitle").select(".text-muted").text("")

  let head = "What's is next?"
  let text1 = `...`
  text1a = ` For most of the past year, our lives have been disrupted by the COVID-19 pandemic.
  Lives have been lost, livelihoods disrupted, and education adversely impacted. Poverty levels have increased in some countries,
  societal bonds have been strained, and the overall trend of development has been reversed.  Yet, despite the bleak outlook,
  we have witnessed stories of hope, courage, triumph and kindness towards one another: the spirit of oneness.`

  text3 = 'This chart provides some tips to help ease COVID-19. Click on the buttons above to navigate to slides.'
  text4 = '.'
  d3.select(".leftTitle").html('<i>' + '<strong>' + head + '</br>' + text1 + '</strong>' + text1a + '<strong>' + '<hr>')
  d3.select(".rightTitle").html('<i>' + '<strong>' + "What does this chart mean?" + '</br>' + '</strong>' + '<i>' + text3 + '<hr>' + '<strong>' + text4 + '</strong>')

  d3.select(".card-heading")
    .append('text')
    .text("What can you do?")

  noDataG = svg.append('g')

  textG = noDataG.append('text')
    .attr('x', 60)
    .attr('y', 50)
    .attr('font-size', '0.8em')
    .attr('fill', '#635F5D')
    .attr("class", "finalpage");

  textG1 = noDataG.append('text')
    .attr('x', 60)
    .attr('y', 150)
    .attr('font-size', '0.8em')
    .attr('fill', '#635F5D')
    .attr("class", "finalpage");

  textG2 = noDataG.append('text')
    .attr('x', 60)
    .attr('y', 250)
    .attr('font-size', '0.9em')
    .attr('fill', '#635F5D')
    .attr("class", "finaline");

  textG3 = noDataG.append('text')
    .attr('x', 60)
    .attr('y', 530)
    .attr('font-size', '0.6em')
    .attr('fill', '#635F5D')
    .attr("class", "finalpage");

  textG4 = noDataG.append('text')
    .attr('x', 60)
    .attr('y', 570)
    .attr('font-size', '0.6em')
    .attr('fill', '#635F5D')
    .attr("class", "finalpage");

  var names = ['Frank', 'Tom', 'Peter', 'Mary'];

  var ul = d3.select('svg').append('ul');

  ul.selectAll('li')
    .data(names)
    .enter()
    .append('li')
    .html(String);

  text1 = '🏠 Stay home if you can.'
  text2 = '😷 Wear a mask.'
  text3 = '↔ Stay 6 feet apart.'
  text4 = '🚫 Avoid crowds and poorly ventilated spaces.'
  text5 = '🖐 Wash your hands.'

  text6 = '✅ Get vaccinated when it’s available to you.'
  text7 =
    textG.html(text1 + '<hr>' + text2 + '</br>' + text3)
  textG1.html(text4 + '<hr>' + text5 + '</br>')
  textG2.html('And above all' + text6)

  textG3.html("COVID Tips : " + "<a href=https://www.cdc.gov/coronavirus/2019-ncov/communication/stop-the-spread.html>" + "https://www.cdc.gov/" + "<\a>")
  textG4.html("Data/ Inspiration : " + "<a href=https://ourworldindata.org/coronavirus>" + "https://ourworldindata.org/coronavirus" + "<\a>")

}
