function tripLengthChart() {
    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var formatTime = d3.time.format("%d.%m.%Y");

    var vis = d3.select('#stats'),
        WIDTH = 800,
        HEIGHT = 300,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xRange = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data.avg_trip_length, function(d) {
            return d.month;
        }), d3.max(data.avg_trip_length, function(d) {
            return d.month;
        })]),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data.avg_trip_length, function(d) {
            return Math.min(d.customer, d.subscriber);
        }), d3.max(data.avg_trip_length, function(d) {
            return Math.max(d.customer, d.subscriber);
        })]),
        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),
        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient('left')
            .tickSubdivide(true);

    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    var customersLineFunc = d3.svg.line()
        .x(function(d) {
            return xRange(d.month);
        })
        .y(function(d) {
            return yRange(d.customer);
        })
        .interpolate('linear');

    var subscribersLineFunc = d3.svg.line()
        .x(function(d) {
            return xRange(d.month);
        })
        .y(function(d) {
            return yRange(d.subscriber);
        })
        .interpolate('linear');


/*
    function addScatterPlot(type, color) {
        vis.selectAll("dot")
            .data(data.trips_per_week)
            .enter().append("circle")
            .attr("r", 5)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("cx", function(d) { return xRange(d.week); })
            .attr("cy", function(d) { return yRange(d[type]); })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(formatTime(d.week) + "<br/>"  + d[type])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }*/

    vis.append('svg:path')
        .attr('d', customersLineFunc(data.avg_trip_length))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    //addScatterPlot('customers', 'blue');

    vis.append('svg:path')
        .attr('d', subscribersLineFunc(data.avg_trip_length))
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    //addScatterPlot('subscribers', 'red');

    var legendRectSize = 18;
    var legendSpacing = 4;
    var legend = vis.selectAll('.legend')
        .data([{name: "Customers", color: "blue"}, {name: "Subscribers", color: "red"}])
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var vert = 50 + i * 30;
            var left = MARGINS.left + 20;
            return 'translate(' + left + ',' + vert + ')';
        });
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d) {
            return d.color;
        })
        .style('stroke', function (d) {
            return d.color;
        });
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d.name; });
}

data.on('avg_trip_length', tripLengthChart);