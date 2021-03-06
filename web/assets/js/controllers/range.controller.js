
function RangeController() {
    telegraph(this);
    this.from = 0;
    this.to = 1467324000;

    this.updateRangeFromDate = function(from, to) {
        this.updateRangeFromTimestamp(from.getTime() / 1000, to.getTime() / 1000);
    };

    this.updateRangeFromTimestamp = function (from, to) {
        this.from = from;
        this.to = to;
        this.emit('range_changed', from, to);
    };

    this.updateFromBrush = function () {
        let date = slider.brush.extent()[0];
        date = d3.time.day.floor(date);
        let timestamp = date.getTime() / 1000;
        range.updateRangeFromTimestamp(timestamp, timestamp + 60*60*24);
    };

    this.updateSelection = function(from, to) {
        let fromDate = new Date(from * 1000);
        let toDate = new Date(to * 1000);
        let elem = $('#selection');
        let format = d3.time.format("%d.%m.%Y");
        elem.text(format(fromDate) + " - " + format(toDate));
    }
}

var range = new RangeController();

range.on('range_changed', range.updateSelection);
range.on('range_changed', data.loadTop5);
range.on('range_changed', data.loadTopTrips);
range.on('range_changed', data.loadTopRelocationFrom);
range.on('range_changed', data.loadTopRelocationTo);
