function DataController() {
    telegraph(this);
    this.all = {};
    this.tracks = {};
    this.racks = {};
    this.trips_per_day = {};
}

var data = new DataController();


d3.json(Routing.generate("list_stations"), function (error, json) {
    if (error) throw error;

    data.all = json;
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

d3.json(Routing.generate("trips_per_day"), function (error, json) {
    if (error) throw error;

    json = json.map(function (elem) {
        elem.x = new Date(elem.x * 1000);
        return elem;
    });

    data.trips_per_day = json;

    data.emit('trips per day');
});
