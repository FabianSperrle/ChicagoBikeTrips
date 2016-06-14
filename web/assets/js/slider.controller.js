"use strict";

// parameters
var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
    width = 800 - margin.left - margin.right,
    height = 100 - margin.bottom - margin.top;
let formatDate = d3.time.format("%d. %b %Y");


// scale function
var timeScale = d3.time.scale()
    .domain([new Date('2013-06-27'), new Date('2015-01-01')])
    .range([0, width])
    .clamp(true);

// initial value
var startValue = timeScale(new Date('2014-03-20'));
let startingValue = new Date('2014-03-20');

var brush = d3.svg.brush()
    .x(timeScale)
    .extent([startingValue, startingValue])
    .on("brush", brushed_date)
    .on("brushend", load_data);

var svg = d3.select("#slider").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    // classic transform to position g
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    // put in middle of screen
    .attr("transform", "translate(0," + height / 2 + ")")
    // inroduce axis
    .call(d3.svg.axis()
        .scale(timeScale)
        .orient("bottom")
        .tickFormat(function(d) {
            return formatDate(d);
        })
        .tickSize(0)
        .tickPadding(12)
        .tickValues([timeScale.domain()[0], timeScale.domain()[1]]))
    .select(".domain")
    .select(function() {
        console.log(this);
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

var handle = slider.append("g")
    .attr("class", "handle")

handle.append("path")
    .attr("transform", "translate(0," + height / 2 + ")")
    .attr("d", "M 0 -20 V 20")

handle.append('text')
    .text(startingValue)
    .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

slider
    .call(brush.event)

function brushed_date() {
    var value = brush.extent()[0];

    if (d3.event.sourceEvent) { // not a programmatic event
        value = timeScale.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
    }

    handle.attr("transform", "translate(" + timeScale(value) + ",0)");
    handle.select('text').text(formatDate(value));
}

function load_data() {
    var date = brush.extent()[0];
    date = d3.time.day.floor(date);
    d3.time.month.floor(date);
    var timestamp = date.getTime() / 1000 + 7200;
    console.log(date);
    console.log(timestamp);
    data.loadTop5(timestamp);
}

var top5Ids = [undefined, undefined, undefined, undefined, undefined];
var backup = undefined;

function processTop5(top5) {
    if (backup == undefined) {
        backup = data.all;
    }
    top5 = top5[0];
    var stations = [];
    var count = [];

    for (var i = 1; i < 6; i++) {
        var d = top5["rank" + i];
        var s = d.split("-");
        count.push(s[0]);
        stations.push(s[1]);
    };
    console.log("stations = " + stations);
    console.log("count = " + count);

    for (let i = 0; i < data.all.length; i++) {
        let d = data.all[i];
        for (let j = 0; j < 5; j++) {
            if (stations[j] == d.id) {
                stations[j] = i;
            }
        }
    }

    console.log("stations = " + stations);

    var divIcon = L.divIcon({
        className: 'pin highlight',
        iconSize: [20, 20]
    });

    for (let i = 0; i < 5; i++) {
        console.log("i = " + i);
        let marker_id = data.all[stations[i]].layerId;
        console.log("marker_id = " + marker_id);
        let marker = points.getLayer(marker_id);
        let latlng;
        if (marker == undefined) {
            latlng = {
                lat: backup[stations[i]].latitude,
                lng: backup[stations[i]].longitude
            };
        } else {
            latlng = marker.getLatLng();
        }

        let title;
        if (marker == undefined) {
            title = backup[stations[i]].name;
        } else {
            title = marker.options.title;
        }
        var newMarker = L.marker(L.latLng(latlng.lat, latlng.lng), {
            title: title,
            icon: divIcon,
            rotationAngle: -45
        });
        let cont;
        if (marker == undefined) {
            let date = new Date(backup[stations[i]].onlineDate.timestamp * 1000);
            cont = "<h4>" + title + "</h4>" +
                "Capacity: " + backup[stations[i]].dpcapacity + " bikes<br />" +
                "Online Since: " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        } else {
            cont = marker._popup._content;
        }
        newMarker.bindPopup(cont);
        points.removeLayer(marker_id);
        points.addLayer(newMarker);
        
        let newMarkerId = points.getLayerId(newMarker);
        console.log("stations[i] = " + stations[i]);
        data.all[stations[i]].layerId = newMarkerId;
        
        if (top5Ids[i] != undefined)
            if (points.getLayer(top5Ids[i]) != undefined)
                points.removeLayer(top5Ids[i]);
        top5Ids[i] = newMarkerId;
    }
    console.log("top5Ids = " + top5Ids);
    console.log("stations = " + stations);
}

data.on('top5', processTop5);