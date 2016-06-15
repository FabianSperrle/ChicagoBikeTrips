"use strict";

function DataController() {
    telegraph(this);
    this.all = {};
    this.stationIndex = {};
    this.tracks = {};
    this.racks = {};
    this.markerlist = {};
    this.trips_per_week = {};
    this.avg_trip_length = {};
}

DataController.prototype.loadTop5 = function(timestamp) {
    var self = this;
    d3.json(Routing.generate("top5_per_day", {"timestamp": timestamp} ), function (error, json) {
        if (error) throw error;

        self.emit('top5', json);
    });
}

DataController.prototype.loadTopTrips = function(amount, timestamp) {
    var self = this;
    d3.json(Routing.generate("top_trips_per_month", {"timestamp": timestamp, "amount": amount} ), function (error, json) {
        if (error) throw error;

        self.emit('top_trips_per_month', json);
    });
};

var data = new DataController();


d3.json(Routing.generate("list_stations"), function (error, json) {
    if (error) throw error;

    data.all = json;
    for (let i = 0; i < data.all.length; i++) {
        data.stationIndex[data.all[i].id] = i;
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
