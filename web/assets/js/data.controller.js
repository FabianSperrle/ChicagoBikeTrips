function DataController() {
    telegraph(this);
    this.all = {};
    this.tracks = {};
    this.racks = {};
}

var data = new DataController();


d3.json("http://www.chicago.dev/web/app_dev.php/stations/", function (error, json) {
    if (error) throw error;

    data.all = json;
    data.emit('loaded');
});

d3.json("http://www.chicago.dev/web/assets/data/bike_tracks.geojson", function(error, json) {
    if (error) throw error;
    
    data.tracks = json;
    
    data.emit('bike_tracks');
});

d3.json("http://www.chicago.dev/web/assets/data/racks.geojson", function(error, json) {
    if (error) throw error;

    data.racks = json;

    data.emit('racks');
});
