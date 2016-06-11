
"use strict";
var tiles = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    maxZoom: 18,
});

var latlng = L.latLng(41.862036, -87.680009);
var map = L.map('map',
    {
        center: latlng,
        zoom: 11,
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
    for (var i = 0; i < data.all.length; i++) {
        var a = data.all[i];
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

var addPointsLayer = function () {
    var markerList = [];

    for (var i = 0; i < data.all.length; i++) {
        var a = data.all[i];
        var title = a.name;

        var divIcon = L.divIcon({
            className: 'pin ' + title.replace(/ /g, ''),
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
        markerList.push(marker);
    }

    var points = L.layerGroup(markerList);
    control.addOverlay(points, "Divvy Stations", "Visualizations");
    points.addTo(map);
    
}

var addHeatLayer = function () {
    var latlngList = [];
    for (var i = 0; i < data.all.length; i++) {
        var a = data.all[i];
        latlngList.push(L.latLng(a.latitude, a.longitude));
    }

    var heat = L.heatLayer(latlngList, {
        max: 1,
        blur: 40,
        radius: 80
    });
    control.addOverlay(heat, "Divvy Station Heat Map", "Visualizations");
}

function addBikeTracks() {
    var routes = L.geoJson(data.tracks, {
        style: {
            "color": "#2ECC40",
            "weight": 2,
            "opacity": 0.65
        }
    }).addTo(map);
    control.addOverlay(routes, "Bike Lanes");
}

function addBikeRacks() {
    console.log("adding racks");
    console.log(data.racks);
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

function addTopTripsLayer() {
    var lines = [];

    for (var i = 0; i < data.top_trips.length; i++) {
        var current = data.top_trips[i];
        var latlng_from = L.latLng(current.from_lat, current.from_long);
        var latlng_to = L.latLng(current.to_lat, current.to_long);

        lines.push(L.polyline([latlng_from, latlng_to]));
    }

    var lineLayer = L.layerGroup(lines);
    control.addOverlay(lineLayer, "Top Trips")
    lineLayer.addTo(map);
}

data.on('loaded', addPointsLayer);
data.on('loaded', addClusterLayer);
data.on('loaded', addHeatLayer);
data.on('bike_tracks', addBikeTracks);
data.on('racks', addBikeRacks);
data.on('top_trips', addTopTripsLayer);
