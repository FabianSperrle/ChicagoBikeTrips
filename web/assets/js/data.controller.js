function DataController() {
    telegraph(this);
    this.all = {};
    this.tracks = {};
    this.racks = {};
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
