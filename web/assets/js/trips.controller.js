function addLineChart() {
    var vis = d3.select('#trips-per-day'),
        WIDTH = 1000,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xRange = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data.trips_per_day, function(d) {
            return d.week;
        }), d3.max(data.trips_per_day, function(d) {
            return d.week;
        })]),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data.trips_per_day, function(d) {
            return Math.min(d.customers, d.subscribers);
        }), d3.max(data.trips_per_day, function(d) {
            return Math.max(d.customers, d.subscribers);
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
            return xRange(d.week);
        })
        .y(function(d) {
            return yRange(d.customers);
        })
        .interpolate('linear');

    var subscribersLineFunc = d3.svg.line()
        .x(function(d) {
            return xRange(d.week);
        })
        .y(function(d) {
            return yRange(d.subscribers);
        })
        .interpolate('linear');

    vis.append('svg:path')
        .attr('d', customersLineFunc(data.trips_per_day))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    vis.append('svg:path')
        .attr('d', subscribersLineFunc(data.trips_per_day))
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}

data.on('loaded', addLineChart);
