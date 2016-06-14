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

var points = L.layerGroup();
var addPointsLayer = function () {
    data.markerList = [];

    for (var i = 0; i < data.all.length; i++) {
        var a = data.all[i];
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
        
        data.all[i].layerId = points.getLayerId(marker);
    }

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
data.on('loaded', addPointsLayer);
data.on('loaded', addClusterLayer);
data.on('loaded', addHeatLayer);
data.on('bike_tracks', addBikeTracks);
data.on('racks', addBikeRacks);
