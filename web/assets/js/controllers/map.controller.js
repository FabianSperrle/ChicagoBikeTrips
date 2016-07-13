"use strict";
var tiles = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    maxZoom: 18,
});

var latlng = L.latLng(41.862036, -87.680009);
var map = L.map('map',
    {
        center: latlng,
        zoom: 12,
        layers: [tiles]
    }
);

var control = L.control.groupedLayers(
    {
        "Streets": tiles
    },
    {
        "Visualizations": {}
    },
    {
        exclusiveGroups: ["Visualizations"]
    }).addTo(map);

var addClusterLayer = function () {
    var clusters = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 30
    });

    var markerList = [];
    for (var i = 0; i < data.stations.length; i++) {
        var a = data.stations[i];
        var title = a.name;

        var marker = L.marker(L.latLng(a.latitude, a.longitude), {
            title: title
        });
        marker.bindPopup(title);
        markerList.push(marker);
    }
    clusters.addLayers(markerList);

    control.addOverlay(clusters, "Divvy Station Clusters", "Visualizations");
};

var points = L.layerGroup();
var addPointsLayer = function () {
    data.markerList = [];

    for (var i = 0; i < data.stations.length; i++) {
        var a = data.stations[i];
        var title = a.name;

        var divIcon = L.divIcon({
            className: 'pin',
            iconSize: [20, 20]
        });

        var marker = L.marker(L.latLng(a.latitude, a.longitude), {
            title: title,
            icon: divIcon,
            rotationAngle: -45
        });

        var date = new Date(a.onlineDate.timestamp * 1000);
        var popup = "<h4>" + title + "</h4>" +
            "Capacity: " + a.dpcapacity + " bikes<br />" +
            "Online Since: " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

        marker.bindPopup(popup);
        points.addLayer(marker);

        data.stations[i].layerId = points.getLayerId(marker);
    }

    control.addOverlay(points, "Divvy Stations", "Visualizations");
    points.addTo(map);

}

var addHeatLayer = function () {
    var latlngList = [];
    for (var i = 0; i < data.stations.length; i++) {
        var a = data.stations[i];
        latlngList.push(L.latLng(a.latitude, a.longitude));
    }

    var heat = L.heatLayer(latlngList, {
        max: 1,
        blur: 40,
        radius: 80
    });
    control.addOverlay(heat, "Divvy Station Heat Map", "Visualizations");
}

var lineLayer = null;
function addTopTripsLayer(topTripsData) {
    if (lineLayer != null) {
        map.removeLayer(lineLayer);
        control.removeLayer(lineLayer);
    }
    var lines = [];
    let max = -99999999;
    let min = 999999999;
    for (var i = 0; i < topTripsData.length; i++) {
        let sum = topTripsData[i].subscriber + topTripsData[i].customer;
        max = Math.max(max, sum);
        min = Math.min(min, sum);
    }

    let scale = d3.scale.linear().domain([min, max]).range([3, 10]);
    let c = colors.cust_sub_chroma.domain([0.0, 1.0]);

    for (var i = 0; i < topTripsData.length; i++) {
        var currentTopTrip = topTripsData[i];
        var from = data.stations[data.stationIndex[currentTopTrip.fromstation]];
        console.log(from);
        var to = data.stations[data.stationIndex[currentTopTrip.tostation]];
        var latlng_from = L.latLng(from.latitude, from.longitude);
        var latlng_to = L.latLng(to.latitude, to.longitude);

        let ratio = +currentTopTrip.customer / (+currentTopTrip.customer + +currentTopTrip.subscriber);
        let weight = scale(currentTopTrip.subscriber + currentTopTrip.customer);
        
        let line = L.polyline([latlng_from, latlng_to], {
            weight: weight,
            color: c(ratio),
            className: "line" + from.id + to.id
        });
        line.on('mouseover', function(e) {
            var layer = e.target;

            layer.setStyle({
                opacity: 1,
                weight: weight * 1.5
            });
        });
        line.on('mouseout', function(e) {
            var layer = e.target;

            layer.setStyle({
                opacity: 0.6,
                weight: weight * 0.66
            });
        });
        lines.push(line);

        lines.push(L.polylineDecorator(line, {
            patterns: [
                {
                    offset: '50%',
                    repeat: '100',
                    fill: c(ratio),
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 10,
                        pathOptions: {
                            fillOpacity: 0.6,
                            color: c(ratio)
                        }
                    })
                }
            ]
        }));
    }

    lineLayer = L.layerGroup(lines);
    lineLayer.addTo(map);
    control.addOverlay(lineLayer, "Top Trips");
}

function addBikeTracks() {
    var routes = L.geoJson(data.tracks, {
        style: {
            "color": "#2ECC40",
            "weight": 2,
            "opacity": 0.65
        }
    });
    control.addOverlay(routes, "Bike Lanes");
}

function addBikeRacks() {
    var geojsonMarkerOptions = {
        radius: 1,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    var racks = L.geoJson(data.racks, {
        style: {
            "color": "#39CCCC",
            "weight": 5,
            "opacity": 0.65
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    control.addOverlay(racks, "Bike Stations");
}

function addRegions() {
    var regions = L.geoJson(data.regions, {
        style: {
            "color": "#39CCCC",
            "weight": 5,
            "opacity": 0.40,
            "fillOpacity": 0.2
        }
    });
    control.addOverlay(regions, "Regions");
}

var stationsLayer = null;
function processTopStations(topStations) {
    if (stationsLayer != null) {
        map.removeLayer(stationsLayer);
    }

    var icon = L.divIcon({
        className: 'pin highlight',
        iconSize: [20, 20]
    });

    let markers = [];
    for (let i = 0; i < topStations.length; i++) {
        let station = data.stations[data.stationIndex[topStations[i].station]];
        markers.push(L.marker([station.latitude, station.longitude], {
            icon: icon
        }));
    }
    stationsLayer = L.layerGroup(markers).addTo(map);
}


data.on('loaded_stations', addPointsLayer);
data.on('loaded_stations', addClusterLayer);
data.on('loaded_stations', addHeatLayer);
data.on('top_trips_per_month', addTopTripsLayer);
data.on('bike_tracks', addBikeTracks);
data.on('racks', addBikeRacks);
data.on('regions', addRegions);
data.on('top5', processTopStations);
