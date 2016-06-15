"use strict";

function RelocationController() {
    this.from = {};
    this.to = {};
}

RelocationController.prototype.initialize = function () {
    $('#relocation_data_container').children().hide();
    this.showRelocationFrom();
};

RelocationController.prototype.showRelocationFrom = function () {
    if ($.isEmptyObject(this.from)) {
        let container = $('#relocation_from').find('tbody');
        container.empty();
        let self = this;
        $.get(Routing.generate("relocation_top_from", {'limit': 20}), function (json) {
            self.from = json;

            for(let i = 0; i < self.from.length; i++) {
                let stationIndex = data.stationIndex[self.from[i].fromstation];
                let station = data.all[stationIndex];
                container.append("<tr><td>" + station.name + "</td><td>" + self.from[i].count + "</td></tr>");
            }
            $('#relocation_data_container').children().hide();
            $('#relocation_from').show();
        });
    } else {
        $('#relocation_data_container').children().hide();
        $('#relocation_from').show();
    }
};

RelocationController.prototype.showRelocationTo = function () {
    if ($.isEmptyObject(this.to)) {
        let container = $('#relocation_to').find('tbody');
        container.empty();
        let self = this;
        $.get(Routing.generate("relocation_top_to", {'limit': 20}), function (json) {
            self.to = json;

            for(let i = 0; i < self.to.length; i++) {
                let stationIndex = data.stationIndex[self.to[i].tostation];
                let station = data.all[stationIndex];
                container.append("<tr><td>" + station.name + "</td><td>" + self.to[i].count + "</td></tr>");
            }
            $('#relocation_data_container').children().hide();
            $('#relocation_to').show();
        });
    } else {
        $('#relocation_data_container').children().hide();
        $('#relocation_to').show();
    }
};

var relocationController = new RelocationController();


data.on('loaded', function () {
    relocationController.initialize();
});

$('#relocation_from_button').click(function () {
    relocationController.showRelocationFrom();
});

$('#relocation_to_button').click(function () {
    relocationController.showRelocationTo();
});
