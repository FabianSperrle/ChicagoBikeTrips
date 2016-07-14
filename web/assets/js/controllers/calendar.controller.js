var width = 1500,
    height = 190,
    cellSize = 25; // cell size

var percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d"),
    month_format = d3.time.format("%b"),
    tooltipFormat = d3.time.format("%d.%m.%Y");

var svg = d3.select("#calendar").selectAll("svg")
    .data(d3.range(2013, 2015))
    .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-35," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(function (d) {
        return d;
    });

svg.append("text")
    .attr("transform","translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .style("letter-spacing", "6px")
    .attr("class", "calendar_day")
    .html("S F T W T M S");

svg.append("text")
    .attr("transform","translate(1350," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .style("letter-spacing", "6px")
    .attr("class", "calendar_day")
    .html("S F T W T M S");

var gs = svg.selectAll(".day")
    .data(function (d) {
        return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("g")
    .attr("title", tooltipContent)
    .attr("data-toggle", "tooltip")
    .attr("data-placement", "bottom")
    .datum(format);

let isClicked = false;
let i = 0;
let startID = "";

function startSelect() {
    isClicked = true;
    startID = +(this.getAttribute("id").substring(4));

    // Reset styles for all rectangles
    rect.style("stroke-width", "1px");
    rect.style("stroke", "#ccc");

    // Start by coloring the current rectangle
    this.style.stroke = "black";
    this.style.strokeWidth = "2px";
}

function hoverWhileClicked() {
    if (isClicked) {
        // Reset styles for all rectangles
        rect.style("stroke-width", "1px");
        rect.style("stroke", "#ccc");

        let id = +(this.getAttribute("id").substring(4));
        for (let i = startID; i <= id; i++) {
            d3.select("#cell" + i)
                .style("stroke", "black")
                .style("stroke-width", "2px");
        }
    }
}
function endSelect() {
    isClicked = false;
    let startDate = new Date(document.getElementById("cell" + startID).getAttribute("datum"));
    let endDate = new Date(this.getAttribute("datum"));

    range.updateRangeFromDate(startDate, endDate);
}

function tooltipContent(d) {
    let date = new Date(d);
    if (entryIndex != undefined) {
        let sum = entryIndex[d].customers + entryIndex[d].subscribers;
        return "Date: " + tooltipFormat(date) + "<br>Customers: " + entryIndex[d].customers
            + "<br>Subscribers: " + entryIndex[d].subscribers + "<br>Total: " + sum;
    } else {
        return "Date: " + tooltipFormat(date) + "<br>Customers: N/A<br>Subscribers: N/A<br>Total: N/A";
    }
}

let rect = gs.append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function (d) {
        return d3.time.weekOfYear(new Date(d)) * cellSize;
    })
    .attr("y", function (d) {
        return new Date(d).getDay() * cellSize;
    })
    .attr("id", function (d) {
        //return "x" + (d3.time.weekOfYear(new Date(d)) * cellSize) + "y" + (new Date(d).getDay() * cellSize)
        return "cell" + i++;
    })
    .attr("datum", function (d) {
        return d;
    })
    .on('mousedown', function () {
        startSelect.call(this);
    })
    .on('mouseover', function () {
        hoverWhileClicked.call(this);
    })
    .on('mouseup', function () {
        endSelect.call(this);
    });


let month_groups = svg.selectAll(".month")
    .data(function (d) {
        return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("g");

month_groups.append("path")
    .attr("class", "month")
    .attr("d", monthPath);


month_groups.append("text")
    //.attr("transform", "translate(-6," + cellSize * 3.5 + ")")
    .attr("z-index", 1000000)
    .style("text-anchor", "middle")
    .attr("transform", function(d, i) {
        return "translate(" + (75 + (i * 4.3 * cellSize)) + ", -3)";
    })
    .text(function (d) {
        return month_format(d);
    });

let sum = {};
let ratio = {};
var entryIndex = {};
overlay.show('#calendar');
d3.json(Routing.generate('trips_per_day'), function (error, json) {
    if (error) throw error;

    console.log(json);

    let minRatio = 1, maxRatio = 0;
    let minSum = 10000000, maxSum = 0;

    json.forEach(function (entry) {
        let dayKey = format(new Date(entry.day));
        let r = entry.customers / (entry.customers + entry.subscribers);
        ratio[dayKey] = r;

        if (r > maxRatio) maxRatio = r;
        if (r < minRatio) minRatio = r;

        let s = entry.subscribers + entry.customers;
        sum[dayKey] = s;

        entryIndex[dayKey] = {
            customers: entry.customers,
            subscribers: entry.subscribers
        };

        if (s > maxSum) maxSum = s;
        if (s < minSum) minSum = s;

    });

    minSum = minSum - 0.1 * maxSum;
    console.log(maxSum);
    console.log(minSum);

    let color2 = colors.bg_chroma
        .domain([minSum, maxSum]);

    let size = d3.scale.quantize()
        .domain([minSum, maxSum])
        .range(d3.range(cellSize));

    gs.filter(function (d) {
        return d in sum;
    })
        .select("rect")
        .style("fill", function (d) {
            return color2(sum[d]);
        });

    let tooltipElements = $('#calendar').find('[data-toggle="tooltip"]');
    tooltipElements.tooltip('destroy');


    gs.filter(function (d) {
        return d in ratio;
    })
    .attr("title", tooltipContent)
        .append("rect")
        .attr("class", function (d) {
            return "day";
        })
        .attr("width", function (d) {
            return size(sum[d]);
        })
        .attr("height", function (d) {
            return size(sum[d]) * ratio[d];
        })
        .style("fill", function (d) {
            // return color(ratio[d]).toString();
            return colors.customerColor;
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
        .on('mousedown', function () {
            startSelect.call(this.previousSibling);
        })
        .on('mouseover', function () {
            hoverWhileClicked.call(this.previousSibling);
        })
        .on('mouseup', function () {
            endSelect.call(this.previousSibling);
        });
    

    gs.filter(function (d) {
        return d in ratio;
    })
        .append("rect")
        .attr("class", function (d) {
            return "day";
        })
        .attr("width", function (d) {
            return size(sum[d]);
        })
        .attr("height", function (d) {
            return size(sum[d]) * (1 - ratio[d]);
        })
        .style("fill", function (d) {
            //return color(ratio[d]).toString();
            return colors.subscriberColor;
        })
        .attr("x", function (d) {
            let o = d3.time.weekOfYear(new Date(d)) * cellSize;
            let c = (cellSize - size(sum[d])) / 2;
            return o + c;
        })
        .attr("y", function (d) {
            let o = new Date(d).getDay() * cellSize;
            let c = (cellSize - size(sum[d])) / 2;
            let m = size(sum[d]) * ratio[d];
            return o + c + m;
        })
        .on('mousedown', function () {
            startSelect.call(this.previousSibling.previousSibling);
        })
        .on('mouseover', function () {
            hoverWhileClicked.call(this.previousSibling.previousSibling);
        })
        .on('mouseup', function () {
            endSelect.call(this.previousSibling.previousSibling);
        });
    tooltipElements.tooltip({
        container: '#calendar',
        html: true
    });
    overlay.hide('#calendar');
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
