function tripLengthChart() {
    var vis = d3.select('#stats'),
        WIDTH = 1000,
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
            return Math.max(d.customer, d.subscriber) * 1.1;
        })]),
        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(2)
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

    vis.append('svg:path')
        .attr('d', customersLineFunc(data.avg_trip_length))
        .attr('stroke', '#18f')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    vis.append('svg:path')
        .attr('d', subscribersLineFunc(data.avg_trip_length))
        .attr('stroke', '#ff3e04')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    var legendRectSize = 18;
    var legendSpacing = 4;
    var legend = vis.selectAll('.legend')
        .data([{name: "Customers", color: "#18f"}, {name: "Subscribers", color: "#ff3e04"}])
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var vert = 30 + i * 30;
            var left = WIDTH - MARGINS.right - 110;
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
};

var rt_customers = [{
    values: [9.1, 90.9],
    labels: ['Round Trip', 'One-Way'],
    type: 'pie',
    marker: {
        colors: ['#18f', '#4cc4f5']
    }
}];

var rt_subscribers = [{
    values: [1.66, 98.34],
    labels: ['Round Trip', 'One-Way'],
    type: 'pie',
    marker: {
        colors: ['#ff3e04', '#ff8d00']
    }
}];

var layout = {
    height: 400,
    width: 400,
    title: "Customers"
};

Plotly.newPlot('customer_pie', rt_customers, layout);
layout.title = "Subscribers";
Plotly.newPlot('subscriber_pie', rt_subscribers, layout);

data.on('avg_trip_length', tripLengthChart);