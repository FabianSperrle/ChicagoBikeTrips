"use strict";

function DataController() {
    telegraph(this);
    this.stations = {};
    this.stationIndex = {};
    this.tracks = {};
    this.racks = {};
    this.markerlist = {};
    this.trips_per_week = {};
    this.avg_trip_length = {};

    this.loadTop5 = (function(from, to) {
        d3.json(Routing.generate("top5_per_day", {"timestamp": from} ), (function (error, json) {
            if (error) throw error;
            this.emit('top5', json);
        }).bind(this));
    }).bind(this);
    
    this.loadTopTrips = (function(from, to) {
        d3.json(Routing.generate("top_trips_per_month", {"timestamp": from, "amount": 50} ), (function (error, json) {
            if (error) throw error;

            this.emit('top_trips_per_month', json);
        }).bind(this));
    }).bind(this);
}

var data = new DataController();


d3.json(Routing.generate("list_stations"), function (error, json) {
    if (error) throw error;

    data.stations = json;
    for (let i = 0; i < data.stations.length; i++) {
        data.stationIndex[data.stations[i].id] = i;
    }
    data.emit('loaded');
});

d3.json("/assets/data/bike_tracks.geojson", function(error, json) {
    if (error) throw error;

    data.tracks = json;

    data.emit('bike_tracks');
});

d3.json("/assets/data/racks.geojson", function(error, json) {
    if (error) throw error;

    data.racks = json;

    data.emit('racks');
});

d3.json(Routing.generate("trips_per_week"), function (error, json) {
    if (error) throw error;

    json = json.map(function (elem) {
        elem.week = new Date(elem.week * 1000);
        return elem;
    });

    data.trips_per_week = json;

    data.emit('trips_per_day');
});

d3.json(Routing.generate("avg_trip_length"), function (err, json) {
    if (err) throw err;

    json = json.map(function (elem) {
        elem.month = new Date(elem.month * 1000);
        return elem;
    });
    data.avg_trip_length = json;
    data.emit('avg_trip_length');
})
