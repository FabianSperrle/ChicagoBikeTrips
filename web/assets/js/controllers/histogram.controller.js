var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Scales
var x = d3.scale.ordinal().rangeRoundBands([0, width - 90], .1);
var y = d3.scale.linear().range([height, 0]);

// Prepare the barchart canvas
var barchart = d3.select("#histogram").append("svg")
    .attr("class", "barchart")
    .attr("width", "100%")
    .attr("height", height + margin.top + margin.bottom)
    .attr("y", -100)
    .append("g");

var z = d3.scale.ordinal().range([colors.subscriberColor, colors.customerColor]);

let updateHistogram = function(json) {
    barchart.selectAll("g").remove();

    let i = 0;
    json.forEach(function (d) {
        d.customer = +d.customer;
        d.subscriber = +d.subscriber;
        d.index = i++;
    });
    // Coercion since CSV is untyped
    
    var freqs = d3.layout.stack()(["subscriber", "customer"].map(function (type) {
        return json.map(function (d) {
            return {
                x: d.index,
                y: d[type]
            };
        });
    }));

    x.domain(freqs[0].map(function (d) {
        return d.x;
    }));
    y.domain([0, d3.max(freqs[freqs.length - 1], function (d) {
        return d.y0 + d.y;
    })]);

    // Axis variables for the bar chart
    x_axis = d3.svg.axis().scale(x).tickValues([0, 10, 20, 30, 40, 50]).orient("bottom");
    y_axis = d3.svg.axis().scale(y).orient("right");

    // x axis
    barchart.append("g")
        .attr("class", "x axis")
        .style("fill", "#000")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis);

    // y axis
    barchart.append("g")
        .attr("class", "y axis")
        .style("fill", "#000")
        .attr("transform", "translate(" + (width - 85) + ",0)")
        .call(y_axis);

    // Add a group for each cause.
    var freq = barchart.selectAll("g.freq")
        .data(freqs)
        .enter().append("g")
        .attr("class", "freq")
        .style("fill", function (d, i) {
            return z(i);
        })
        .style("stroke", "#CCE5E5");

    // Add a rect for each date.
    let histo_rect = freq.selectAll("rect")
        .data(Object)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y0) + y(d.y) - height;
        })
        .attr("height", function (d) {
            return height - y(d.y);
        })
        .attr("width", x.rangeBand())
        .attr("id", function (d) {
            return d["year"];
        });
};

data.on('top_trips_per_month', updateHistogram);
