
function RangeController() {
    telegraph(this);
    this.from = 0;
    this.to = 1467324000;

    this.updateRange = function (from, to) {
        this.from = from;
        this.to = to;
        this.emit('range_changed', from, to);
    };

    this.updateFromBrush = function () {
        let date = slider.brush.extent()[0];
        date = d3.time.day.floor(date);
        let timestamp = date.getTime() / 1000;
        range.updateRange(timestamp, timestamp + 60*60*24);
    };
}

var range = new RangeController();

range.on('range_changed', data.loadTop5);
range.on('range_changed', data.loadTopTrips);
