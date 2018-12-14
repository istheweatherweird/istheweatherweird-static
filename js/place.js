// Parse CSV
d3.csv("/Users/jonah/repos/is\ the\ weather\ weird/website/static/csvs/chicago/1214.csv")
  .row(function(d) { return {year: d.year, max: d.high, min: d.low}})
  .get(function(error, rows) { console.log(rows); });

var forecast = {
  min: 81.3,
  max: 84.5
}
// var past = gon.past //
var past = d3.range(50).map(function(d) { return {
  year: 1967 + d,
  max: 32 + 1.8 * (d3.random.bates(10)() * 21 + 20),
  min: 32 + 1.8 * (d3.random.bates(10)() * 19 + 20)
}});
var maxTemps = past.map(function(d) { return parseFloat(d.max) })
var minTemps = past.map(function(d) { return parseFloat(d.min) })
// var maxTemps = d3.range(50).map(function() { return 32 + 1.8 * (d3.random.bates(10)() * 20 + 20) });
// var minTemps = d3.range(50).map(function() { return 32 + 1.8 * (d3.random.bates(10)() * 20 + 20) });
// var years = d3.range(50).map(function() { return })

data = 3

var makeHist = function(wrapperId, value, temps, title, key) {
    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 60, right: 30, bottom: 30, left: 30},
        width = parseInt(d3.select("#" + wrapperId).style("width")) - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x_with_value = d3.scale.linear()
        .domain([Math.floor(d3.extent(temps.concat(value))[0]), Math.ceil(d3.extent(temps.concat(value))[1])])
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var tickNum = 15
    data = d3.layout.histogram()
        .value(function(d) {return d[key]})
        .bins(x_with_value.ticks(tickNum))
        (past);

    var x = d3.scale.linear()
        .domain(d3.extent(x_with_value.ticks(tickNum)))
        .range([0,width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(d) {return d + "F"});

    var svg = d3.select("#" + wrapperId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // line
    svg.append("line")
        .attr("x1", x(value))
        .attr("y1", -10)
        .attr("x2", x(value))
        .attr("y2", height)
        .attr("stroke-width", 2)
        .attr("opacity", 0.5)
        .attr("stroke", "black");

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx + x.domain()[0]) - 2)
        .attr("height", function(d) { return height - y(d.y); });

    data.forEach(function(d,i) {
        d = d.sort(function(e,f) { return f.year - e.year})
        d.forEach(function(j,k) {
            svg.append("text")
            .attr("dy", ".75em")
            .attr("y", 5 + y(d.y) + k * 10)
            .attr("x", x(d.x) + x(data[0].dx + x.domain()[0]) / 2)
            .attr("text-anchor", "middle")
            // .attr("fill", "white")
            // .attr("stroke", "white")
            .text(j.year);
        })
    })

        

    // .append("text")
    //     .attr("dy", ".75em")
    //     .attr("y", 6)
    //     .attr("x", x(data[0].dx + x.domain()[0]) / 2)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return formatCount(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    svg.append("text")
        .attr("dy", ".75em")
        .attr("y", -20)
        .attr("x", x(value))
        .attr("text-anchor", "middle")
        .text("2018");

    svg.append("text")
        .attr("dy", "2em")
        .attr("y", -70)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text(title + Date().substring(4,10));
    
}


makeHist("maxGraphWrapper", forecast.max, maxTemps, "Daily high temperatures for ", "max")
makeHist("minGraphWrapper", forecast.min, minTemps, "Daily low temperatures for ", "min")