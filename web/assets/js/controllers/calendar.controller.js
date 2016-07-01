var width = 1500,
    height = 190,
    cellSize = 25; // cell size

var percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var svg = d3.select("#calendar").selectAll("svg")
    .data(d3.range(2013, 2015))
    .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
    .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function (d) {
        return d;
    });

var gs = svg.selectAll(".day")
    .data(function (d) {
        return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("g")
    .datum(format);

let rect = gs.append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function (d) {
        return d3.time.weekOfYear(new Date(d)) * cellSize;
    })
    .attr("y", function (d) {
        return new Date(d).getDay() * cellSize;
    });

rect.append("title")
    .text(Object);

svg.selectAll(".month")
    .data(function (d) {
        return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

let sum = {};
let ratio = {};
d3.json("trips/per_day", function (error, json) {
    if (error) throw error;

    console.log(json);

    let minRatio = 1, maxRatio = 0;
    let minSum = 10000000, maxSum = 0;
    json.forEach(function(entry) {
        let r = entry.customers / (entry.customers + entry.subscribers);
        ratio[format(new Date(entry.day))] = r;
        
        if (r > maxRatio) maxRatio = r;
        if (r < minRatio) minRatio = r;
        
        let s = entry.subscribers + entry.customers;
        sum[format(new Date(entry.day))] = s;
        
        if (s > maxSum) maxSum = s;
        if (s < minSum) minSum = s;

    });

    minSum = minSum - 0.1 * maxSum;
    console.log(maxSum);
    console.log(minSum);
    
    let color = chroma.scale(['ff3e04', '1188ff'])
        .domain([minRatio, maxRatio]);

    let color2 = chroma.scale(['white', 'green'])
        .domain([minSum, maxSum]);

    let size = d3.scale.quantize()
        .domain([minSum, maxSum])
        .range(d3.range(cellSize));

    
    gs.filter(function (d) { return d in sum; })
        .select("rect")
        .style("fill", function(d) {
            return color2(sum[d]);
        });
    
    gs.filter(function (d) { return d in ratio; })
        .append("rect")
        .attr("class", function (d) {
            return "day";
        })
        .attr("width", function (d) {
            return size(sum[d]);
        })
        .attr("height", function (d) {
            return size(sum[d]);
        })
        .style("fill", function (d) {
            return color(ratio[d]).toString();
        })
        .attr("x", function (d) {
            let o = d3.time.weekOfYear(new Date(d)) * cellSize;
            let c = (cellSize - size(sum[d])) / 2;
            return o + c; 
        })
        .attr("y", function (d) {
            let o = new Date(d).getDay() * cellSize;
            let c = (cellSize - size(sum[d])) / 2;
            return o + c;
        })
        .append('title')
        .text(Object)
        .select("title")
        .text(function (d) {
            return d + ": " + percent(data[d]);
        });
});

function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
        d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
}
